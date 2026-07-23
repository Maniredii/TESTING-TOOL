import { Router } from 'express';
import { ExecutionController } from './controllers/ExecutionController';

const router = Router();
const controller = new ExecutionController();

// Basic routes (Auth middleware assumed to be applied upstream)
router.post('/', controller.createExecution);
router.get('/', controller.listExecutions);
router.get('/:id', controller.getExecution);

// Control actions
router.post('/:id/pause', controller.pauseExecution);
router.post('/:id/resume', controller.resumeExecution);
router.post('/:id/cancel', controller.cancelExecution);

// Report
router.get('/:id/report', controller.getReport);

export default router;
