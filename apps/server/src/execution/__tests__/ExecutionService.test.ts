import { ExecutionService } from '../services/ExecutionService';
import { executionQueue } from '../queue/ExecutionQueue';
import { AutomationOrchestrator } from '@testing-platform/automation/src/orchestrator/runtime/AutomationOrchestrator';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      execution: { 
        create: jest.fn().mockResolvedValue({ id: 'ex1' }),
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({})
      }
    }))
  };
});

describe('ExecutionService', () => {
  let service: ExecutionService;

  beforeEach(() => {
    service = new ExecutionService();
    jest.spyOn(executionQueue, 'enqueue').mockImplementation(() => {});
  });

  it('should create execution and enqueue', async () => {
    const exec = await service.createExecution('proj1', 'conf1', 'u1');
    expect(exec.id).toBe('ex1');
    expect(executionQueue.enqueue).toHaveBeenCalledWith(expect.objectContaining({ executionId: 'ex1' }));
  });

  it('should list executions', async () => {
    const list = await service.listExecutions('u1');
    expect(list).toEqual([]);
  });

  it('should handle orchestrator pause', async () => {
    const orchestrator = service.getOrchestrator();
    jest.spyOn(orchestrator, 'pauseExecution').mockImplementation(() => {});
    const result = await service.pauseExecution('ex1');
    expect(result.status).toBe('PAUSED');
  });
});
