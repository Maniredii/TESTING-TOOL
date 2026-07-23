import { ExecutionWorker } from '../workers/ExecutionWorker';
import { ExecutionService } from '../services/ExecutionService';
import { executionQueue } from '../queue/ExecutionQueue';

// Mock prisma and service
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      execution: { update: jest.fn().mockResolvedValue({}) }
    }))
  };
});

describe('ExecutionWorker', () => {
  let service: any;
  let worker: ExecutionWorker;

  beforeEach(() => {
    service = {
      getOrchestrator: jest.fn().mockReturnValue({
        runExecution: jest.fn().mockResolvedValue('exec-id')
      })
    };
    worker = new ExecutionWorker(service as any);
  });

  it('should process job from queue', async () => {
    const job = { executionId: 'ex1', projectId: 'proj1', configurationId: 'conf1' };
    
    executionQueue.enqueue(job);
    
    // allow microtasks to flush
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(service.getOrchestrator).toHaveBeenCalled();
    expect(service.getOrchestrator().runExecution).toHaveBeenCalledWith('proj1', 'conf1');
  });
});
