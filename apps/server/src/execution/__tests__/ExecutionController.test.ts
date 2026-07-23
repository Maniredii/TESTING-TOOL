import { ExecutionController } from '../controllers/ExecutionController';
import { Request, Response } from 'express';

// Mock dependencies
jest.mock('../services/ExecutionService', () => {
  return {
    ExecutionService: jest.fn().mockImplementation(() => ({
      createExecution: jest.fn().mockResolvedValue({ id: 'ex-1' }),
      listExecutions: jest.fn().mockResolvedValue([]),
      getExecution: jest.fn().mockResolvedValue({ id: 'ex-1' }),
      pauseExecution: jest.fn().mockResolvedValue({ status: 'PAUSED' })
    }))
  };
});

describe('ExecutionController', () => {
  let controller: ExecutionController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    controller = new ExecutionController();
    mockReq = {
      body: {},
      params: {}
    };
    (mockReq as any).user = { id: 'u1' };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should create execution on valid payload', async () => {
    mockReq.body = { projectId: 'cld2cjxh0000qzrmn831i7rn', configurationId: 'cld2cjxh0000qzrmn831i7ro' };
    await controller.createExecution(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: { id: 'ex-1' } });
  });

  it('should list executions', async () => {
    await controller.listExecutions(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should pause execution', async () => {
    mockReq.params = { id: 'ex-1' };
    await controller.pauseExecution(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: { status: 'PAUSED' } });
  });
});
