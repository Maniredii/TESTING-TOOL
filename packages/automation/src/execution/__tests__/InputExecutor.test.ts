import { InputExecutor } from '../../executors/InputExecutor';
import { ExecutorContext } from '../../executors/ActionExecutor';
import { SupportedAction, ActionPriorityLevel } from '../../planning/AutomationActionEnums';
import { ActionStatus } from '../../results/ActionResult';

describe('InputExecutor', () => {
  let executor: InputExecutor;
  let mockLocator: any;
  let mockPage: any;
  let mockContext: ExecutorContext;

  beforeEach(() => {
    executor = new InputExecutor();
    
    mockLocator = {
      waitFor: jest.fn().mockResolvedValue(undefined),
      fill: jest.fn().mockResolvedValue(undefined),
      selectOption: jest.fn().mockResolvedValue(undefined),
      check: jest.fn().mockResolvedValue(undefined),
      uncheck: jest.fn().mockResolvedValue(undefined),
    };

    mockPage = {
      url: jest.fn().mockReturnValue('http://example.com/'),
    };

    mockContext = {
      page: mockPage as any,
      action: {
        id: '123',
        actionType: SupportedAction.INPUT,
        priorityScore: ActionPriorityLevel.HIGH,
        riskScore: 0.1,
        confidenceScore: 0.9,
        estimatedBenefit: 1,
        estimatedCost: 1,
        reasoning: 'test',
        payload: { text: 'hello' }
      },
      locator: mockLocator as any,
      previousUrl: 'http://example.com/',
    };
  });

  it('should fill input', async () => {
    const result = await executor.execute(mockContext);
    
    expect(mockLocator.fill).toHaveBeenCalledWith('');
    expect(mockLocator.fill).toHaveBeenCalledWith('hello');
    expect(result.status).toBe(ActionStatus.SUCCESS);
  });

  it('should select option', async () => {
    mockContext.action.actionType = SupportedAction.SELECT;
    mockContext.action.payload = { value: 'option1' };
    
    const result = await executor.execute(mockContext);
    
    expect(mockLocator.selectOption).toHaveBeenCalledWith({ value: 'option1' });
    expect(result.status).toBe(ActionStatus.SUCCESS);
  });
});
