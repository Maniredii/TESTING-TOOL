import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validateRequest } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as Validators from '../validators/project.validator';

const router = Router();

// All project routes require authentication
router.use(authMiddleware);

router.post('/', validateRequest(Validators.createProjectSchema), asyncHandler(ProjectController.createProject));
router.get('/', validateRequest(Validators.getProjectsQuerySchema), asyncHandler(ProjectController.getProjects));
router.get('/:id', asyncHandler(ProjectController.getProjectById));
router.patch('/:id', validateRequest(Validators.updateProjectSchema), asyncHandler(ProjectController.updateProject));
router.delete('/:id', asyncHandler(ProjectController.deleteProject));

export default router;
