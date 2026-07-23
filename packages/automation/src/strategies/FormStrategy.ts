import { PageModel, FormModel, InteractiveElement } from '../dom/models';
import { ActionCandidate } from '../planning/models/ActionCandidate';
import { SupportedAction, ActionPriorityLevel } from '../planning/AutomationActionEnums';
import * as crypto from 'crypto';

export class FormStrategy {
  
  /**
   * Generates a sequence of ActionCandidates to complete a specific form.
   * Note: This does NOT execute the actions. It just plans them.
   */
  public static planFormFill(form: FormModel, pageModel: PageModel): ActionCandidate[] {
    const candidates: ActionCandidate[] = [];

    // Find the actual input elements mapped to this form
    const inputs = pageModel.interactiveElements.filter(el => 
      form.inputs.includes(el.uniqueId)
    );

    // Find the submit button
    const submitBtn = pageModel.interactiveElements.find(el => 
      form.submitButtons.includes(el.uniqueId)
    );

    // Generate input steps
    for (const input of inputs) {
      candidates.push(this.createInputCandidate(input, form.type));
    }

    // Generate submit step
    if (submitBtn) {
      candidates.push({
        id: crypto.randomUUID(),
        actionType: SupportedAction.CLICK,
        targetElement: submitBtn,
        priorityScore: ActionPriorityLevel.HIGH,
        riskScore: 0.5,
        confidenceScore: 0.9,
        estimatedBenefit: 10,
        estimatedCost: 1,
        reasoning: `Submit button for ${form.type || 'UNKNOWN'} form`
      });
    }

    // Generate a virtual 'ANALYZE_PAGE' action so the engine knows to wait for navigation and rescan
    candidates.push({
        id: crypto.randomUUID(),
        actionType: SupportedAction.ANALYZE_PAGE,
        priorityScore: ActionPriorityLevel.HIGH,
        riskScore: 0,
        confidenceScore: 1.0,
        estimatedBenefit: 10,
        estimatedCost: 1,
        reasoning: `Trigger re-analysis after form submission`
    });

    return candidates;
  }

  private static createInputCandidate(input: InteractiveElement, formType?: string): ActionCandidate {
    // Determine mock data based on input type and form context
    let mockData = 'test_value';
    const typeAttr = input.attributes['type']?.toLowerCase() || 'text';
    const nameAttr = input.attributes['name']?.toLowerCase() || '';

    if (typeAttr === 'email' || nameAttr.includes('email')) {
      mockData = 'test@example.com';
    } else if (typeAttr === 'password' || nameAttr.includes('password')) {
      mockData = 'SecurePass123!';
    } else if (typeAttr === 'tel' || nameAttr.includes('phone')) {
      mockData = '555-0100';
    }

    return {
      id: crypto.randomUUID(),
      actionType: SupportedAction.INPUT,
      targetElement: input,
      payload: { value: mockData },
      priorityScore: ActionPriorityLevel.HIGH,
      riskScore: 0.2,
      confidenceScore: 0.9,
      estimatedBenefit: 5,
      estimatedCost: 1,
      reasoning: `Fill input field [${typeAttr}] for ${formType || 'UNKNOWN'} form`
    };
  }
}
