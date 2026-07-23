import { ClickExecutor } from '../../executors/ClickExecutor';
import { ExecutorContext } from '../../executors/ActionExecutor';
import { SupportedAction, ActionPriorityLevel } from '../../planning/AutomationActionEnums';
import { ActionStatus } from '../../results/ActionResult';

describe('ClickExecutor', () => {
  let executor: ClickExecutor;
  let mockLocator: any;
  let mockPage: any;
  let mockContext: ExecutorContext;

  beforeEach(() => {
    executor = new ClickExecutor();
    
    mockLocator = {
      waitFor: jest.fn().mockResolvedValue(undefined),
      click: jest.fn().mockResolvedValue(undefined),
      dblclick: jest.fn().mockResolvedValue(undefined),
    };

    mockPage = {
      url: jest.fn().mockReturnValue('http://example.com/next'),
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
        payload: { clickType: 'left' }
      },
      locator: mockLocator as any,
      previousUrl: 'http://example.com/prev',
    };
  });

  it('should successfully execute a left click', async () => {
    const result = await executor.execute(mockContext);
    
    expect(mockLocator.waitFor).toHaveBeenCalledWith({ state: 'visible', timeout: 10000 });
    expect(mockLocator.click).toHaveBeenCalledWith();
    expect(result.status).toBe(ActionStatus.SUCCESS);
    expect(result.currentUrl).toBe('http://example.com/next');
  });

  it('should successfully execute a double click', async () => {
    mockContext.action.payload = { clickType: 'double' };
    const result = await executor.execute(mockContext);
    
    expect(mockLocator.dblclick).toHaveBeenCalled();
    expect(result.status).toBe(ActionStatus.SUCCESS);
  });

  it('should fail if locator is missing', async () => {
    mockContext.locator = undefined;
    const result = await executor.execute(mockContext);
    
    expect(result.status).toBe(ActionStatus.FAILED);
    expect(result.error?.message).toBe('Locator is required for ClickExecutor');
  });
});
