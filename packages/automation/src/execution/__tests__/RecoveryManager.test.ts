import { RecoveryManager, RecoveryStrategy } from '../../recovery/RecoveryManager';
import { ExecutorContext, ActionExecutor } from '../../executors/ActionExecutor';
import { ActionStatus } from '../../results/ActionResult';
import { SupportedAction, ActionPriorityLevel } from '../../planning/AutomationActionEnums';
import { AutomationEventEmitter } from '../../events/AutomationEventEmitter';

describe('RecoveryManager', () => {
  let recoveryManager: RecoveryManager;
  let mockExecutor: ActionExecutor;
  let mockContext: ExecutorContext;
  let mockPage: any;

  beforeEach(() => {
    recoveryManager = new RecoveryManager();
    
    mockPage = {
      url: jest.fn().mockReturnValue('http://example.com/'),
      waitForTimeout: jest.fn().mockResolvedValue(undefined),
      reload: jest.fn().mockResolvedValue(undefined),
    };

    mockContext = {
      page: mockPage as any,
      action: {
        id: '123',
        actionType: SupportedAction.CLICK,
        priorityScore: ActionPriorityLevel.HIGH,
        riskScore: 0.1,
        confidenceScore: 0.9,
        estimatedBenefit: 1,
        estimatedCost: 1,
        reasoning: 'test',
      },
      previousUrl: 'http://example.com/',
    };

    mockExecutor = {
      execute: jest.fn(),
    };
  });

  it('should retry action on timeout', async () => {
    (mockExecutor.execute as jest.Mock).mockResolvedValueOnce({ status: ActionStatus.SUCCESS });
    
    const result = await recoveryManager.attemptRecovery(
      mockContext,
      mockExecutor,
      new Error('timeout')
    );

    expect(result.status).toBe(ActionStatus.RECOVERED);
    expect(mockExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it('should abort execution on permission error', async () => {
    await expect(
      recoveryManager.attemptRecovery(
        mockContext,
        mockExecutor,
        new Error('permission denied')
      )
    ).rejects.toThrow('permission denied');
  });

  it('should reload and retry on navigation error', async () => {
    (mockExecutor.execute as jest.Mock).mockResolvedValueOnce({ status: ActionStatus.SUCCESS });

    const result = await recoveryManager.attemptRecovery(
      mockContext,
      mockExecutor,
      new Error('navigation failed')
    );

    expect(mockPage.reload).toHaveBeenCalled();
    expect(result.status).toBe(ActionStatus.RECOVERED);
  });
});
