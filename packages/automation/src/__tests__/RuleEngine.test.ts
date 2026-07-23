import { RuleEngine } from '../rules/RuleEngine';
import { ActionCandidate } from '../planning/models/ActionCandidate';
import { ClassificationCategory } from '../dom/types';

describe('RuleEngine', () => {
  it('should block destructive actions via SafetyRules', () => {
    const candidates: ActionCandidate[] = [
      {
        id: '1',
        actionType: 'CLICK' as any,
        targetElement: { classification: ClassificationCategory.DANGER } as any,
      } as any,
      {
        id: '2',
        actionType: 'CLICK' as any,
        payload: 'confirm delete',
        targetElement: { classification: ClassificationCategory.UNCATEGORIZED, text: 'Confirm Delete' } as any,
      } as any,
      {
        id: '3',
        actionType: 'CLICK' as any,
        targetElement: { classification: ClassificationCategory.NAVIGATION, text: 'Next Page' } as any,
      } as any
    ];

    const safe = RuleEngine.filterCandidates(candidates, new Set());
    expect(safe.length).toBe(1);
    expect(safe[0].id).toBe('3');
  });

  it('should block duplicate actions', () => {
    const candidates: ActionCandidate[] = [
      {
        id: '1',
        actionType: 'CLICK' as any,
        targetElement: { uniqueId: 'elem_1' } as any,
      } as any
    ];

    const executed = new Set(['elem_1']);
    const safe = RuleEngine.filterCandidates(candidates, executed);
    expect(safe.length).toBe(0);
  });
});
