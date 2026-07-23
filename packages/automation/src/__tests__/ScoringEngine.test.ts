import { ScoringEngine } from '../scoring/ScoringEngine';
import { ActionCandidate } from '../planning/models/ActionCandidate';
import { ActionPriorityLevel } from '../planning/AutomationActionEnums';
import { ClassificationCategory } from '../dom/types';

describe('ScoringEngine', () => {
  it('should assign HIGH priority to Authentication elements', () => {
    const candidate: ActionCandidate = {
      id: '1',
      actionType: 'CLICK' as any,
      targetElement: { classification: ClassificationCategory.AUTHENTICATION, tag: 'button', attributes: { type: 'submit' } } as any
    } as any;

    ScoringEngine.scoreCandidate(candidate);
    expect(candidate.priorityScore).toBe(ActionPriorityLevel.VERY_HIGH);
    expect(candidate.riskScore).toBeGreaterThan(0.1);
  });

  it('should calculate higher risk for forms than links', () => {
    const formCandidate: ActionCandidate = {
      id: '1',
      actionType: 'CLICK' as any,
      targetElement: { classification: ClassificationCategory.FORM_INPUT, tag: 'form', attributes: {} } as any
    } as any;

    const linkCandidate: ActionCandidate = {
      id: '2',
      actionType: 'CLICK' as any,
      targetElement: { classification: ClassificationCategory.NAVIGATION, tag: 'a', attributes: {} } as any
    } as any;

    ScoringEngine.scoreCandidate(formCandidate);
    ScoringEngine.scoreCandidate(linkCandidate);

    expect(formCandidate.riskScore).toBeGreaterThan(linkCandidate.riskScore);
  });
});
