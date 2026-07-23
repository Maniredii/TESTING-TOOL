import { Page } from 'playwright';
import { ExecutionPlan } from '../planning/models/ExecutionPlan';
import { ExecutionResult } from '../results/ExecutionResult';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { MetricsTracker } from '../metrics/ExecutionMetrics';
import { AutomationEventEmitter } from '../events/AutomationEventEmitter';
import { RecoveryManager } from '../recovery/RecoveryManager';
import { StateValidator } from '../validators/StateValidator';
import { LocatorStrategies } from './LocatorStrategies';
import { ActionExecutor, ExecutorContext } from '../executors/ActionExecutor';
import { ClickExecutor } from '../executors/ClickExecutor';
import { InputExecutor } from '../executors/InputExecutor';
import { NavigationExecutor } from '../executors/NavigationExecutor';
import { ScrollExecutor } from '../executors/ScrollExecutor';
import { UploadExecutor } from '../executors/UploadExecutor';
import { KeyboardExecutor } from '../executors/KeyboardExecutor';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class ExecutionEngine {
  private page: Page;
  private recoveryManager: RecoveryManager;
  private metricsTracker: MetricsTracker;
  private emitter: AutomationEventEmitter;

  private executors: Map<SupportedAction, ActionExecutor>;

  constructor(page: Page) {
    this.page = page;
    this.recoveryManager = new RecoveryManager();
    this.metricsTracker = new MetricsTracker();
    this.emitter = AutomationEventEmitter.getInstance();
    
    // Register Executors
    this.executors = new Map();
    const clickExecutor = new ClickExecutor();
    this.executors.set(SupportedAction.CLICK, clickExecutor);
    
    const inputExecutor = new InputExecutor();
    this.executors.set(SupportedAction.INPUT, inputExecutor);
    this.executors.set(SupportedAction.SELECT, inputExecutor);
    this.executors.set(SupportedAction.CHECKBOX, inputExecutor);
    this.executors.set(SupportedAction.RADIO, inputExecutor);
    
    const navExecutor = new NavigationExecutor();
    this.executors.set(SupportedAction.NAVIGATION, navExecutor);
    this.executors.set(SupportedAction.REFRESH, navExecutor);
    this.executors.set(SupportedAction.BACK, navExecutor);
    this.executors.set(SupportedAction.FORWARD, navExecutor);
    
    const scrollExecutor = new ScrollExecutor();
    this.executors.set(SupportedAction.SCROLL, scrollExecutor);
    
    const uploadExecutor = new UploadExecutor();
    this.executors.set(SupportedAction.UPLOAD, uploadExecutor);
    this.executors.set(SupportedAction.DOWNLOAD, uploadExecutor);
    
    const kbExecutor = new KeyboardExecutor();
    this.executors.set(SupportedAction.WAIT, kbExecutor);
    this.executors.set(SupportedAction.HOVER, kbExecutor);
  }

  public async executePlan(plan: ExecutionPlan): Promise<ExecutionResult> {
    const startTime = Date.now();
    this.emitter.emit('execution:started', { planId: plan.id });
    
    const actionResults: ActionResult[] = [];
    let planSuccess = true;

    for (const step of plan.steps) {
      const action = step.candidate;
      this.emitter.emit('action:started', { actionId: action.id, type: action.actionType });

      let executor = this.executors.get(action.actionType);
      if (!executor) {
        // Fallback to keyboard/other if missing from map initially
        executor = new KeyboardExecutor(); 
      }

      let locator;
      if (action.targetElement) {
        locator = LocatorStrategies.resolveLocator(this.page, action.targetElement);
      }

      const context: ExecutorContext = {
        page: this.page,
        action,
        locator,
        previousUrl: this.page.url(),
      };

      let result: ActionResult;
      try {
        result = await executor.execute(context);
        if (result.status === ActionStatus.FAILED && result.error) {
          throw result.error;
        }
      } catch (error: any) {
        this.metricsTracker.recordFailure();
        this.emitter.emit('action:failed', { actionId: action.id, error: error.message });
        try {
          result = await this.recoveryManager.attemptRecovery(context, executor, error);
          this.metricsTracker.recordRetry();
        } catch (recoveryError: any) {
          result = {
            actionId: action.id,
            actionType: action.actionType,
            status: ActionStatus.FAILED,
            startTime: new Date(),
            endTime: new Date(),
            duration: 0,
            previousUrl: context.previousUrl,
            currentUrl: this.page.url(),
            error: recoveryError,
          };
          planSuccess = false;
          actionResults.push(result);
          break; // Abort execution on unrecoverable error
        }
      }

      // State Validation
      result.validationResult = await StateValidator.validate(
        this.page,
        locator,
        context.previousUrl,
        result.error
      );

      this.metricsTracker.recordActionTime(result.duration);
      actionResults.push(result);
      
      this.emitter.emit('action:completed', { actionId: action.id, status: result.status });

      if (!result.validationResult.isValid) {
        planSuccess = false;
        break; // Stop execution if state is invalid
      }
    }

    const totalExecutionTime = Date.now() - startTime;
    this.metricsTracker.finalize(totalExecutionTime, plan.steps.length);
    
    this.emitter.emit('execution:finished', { planId: plan.id, success: planSuccess });

    return {
      planId: plan.id,
      success: planSuccess,
      actionResults,
      metrics: this.metricsTracker.getMetrics(),
    };
  }
}
