import { PageModel } from '../dom/models';
import { WebsiteGraph } from '../graph/WebsiteGraph';
import { AutomationConfig } from '../types';
import { ExecutionPlan } from './models/ExecutionPlan';
import { ExecutionStep, StepStatus } from './models/ExecutionStep';
import { ActionCandidate } from './models/ActionCandidate';
import { SupportedAction, ActionPriorityLevel } from './AutomationActionEnums';
import { RuleEngine } from '../rules/RuleEngine';
import { ScoringEngine } from '../scoring/ScoringEngine';
import { FormStrategy } from '../strategies/FormStrategy';
import { ClassificationCategory } from '../dom/types';
import { Logger } from '../utils/Logger';
import * as crypto from 'crypto';

const logger = new Logger('InteractionPlanner');

export class InteractionPlanner {
  
  /**
   * Translates the current state (DOM + Graph) into an ordered ExecutionPlan.
   * This is the brain of the engine.
   */
  public static plan(
    pageModel: PageModel, 
    graph: WebsiteGraph, 
    config: AutomationConfig,
    executedElementIds: Set<string> = new Set()
  ): ExecutionPlan {
    logger.info(`Generating Interaction Plan for ${pageModel.url}`);
    
    // Determine the immediate goal
    let goal = 'Crawl and Discover';
    
    const hasAuthForm = pageModel.forms.some(f => f.type === 'LOGIN');
    if (config.loginRequired && hasAuthForm) {
      goal = 'Complete Authentication';
    }

    const plan = new ExecutionPlan(goal);
    let candidates: ActionCandidate[] = [];

    // Phase 1: Generate Candidates based on Goal
    if (goal === 'Complete Authentication') {
      const loginForm = pageModel.forms.find(f => f.type === 'LOGIN')!;
      candidates = FormStrategy.planFormFill(loginForm, pageModel);
    } else {
      // Crawling: Pick highest priority navigation links
      const navElements = pageModel.interactiveElements.filter(el => 
        el.classification === ClassificationCategory.NAVIGATION ||
        el.classification === ClassificationCategory.AUTHENTICATION // might be a link to a login page
      );

      for (const el of navElements) {
        candidates.push({
          id: crypto.randomUUID(),
          actionType: SupportedAction.CLICK,
          targetElement: el,
          priorityScore: ActionPriorityLevel.LOW, // Will be updated by ScoringEngine
          riskScore: 0,
          confidenceScore: 0,
          estimatedBenefit: 0,
          estimatedCost: 0,
          reasoning: 'Exploratory Navigation'
        });
      }
    }

    // Phase 2: Rule Engine (Safety Filters)
    let safeCandidates = RuleEngine.filterCandidates(candidates, executedElementIds);

    // Phase 3: Scoring & Prioritization
    for (const candidate of safeCandidates) {
      ScoringEngine.scoreCandidate(candidate);
    }

    // Sort by priority (highest first), then by risk (lowest first)
    safeCandidates.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return a.riskScore - b.riskScore;
    });

    // Phase 4: Construct Execution Steps
    let order = 1;
    for (const candidate of safeCandidates) {
      const step: ExecutionStep = {
        id: crypto.randomUUID(),
        order: order++,
        candidate,
        status: StepStatus.PENDING
      };
      plan.addStep(step);
    }

    logger.info(`Generated ExecutionPlan [${plan.id}] with ${plan.steps.length} steps. Goal: ${goal}`);
    return plan;
  }
}
