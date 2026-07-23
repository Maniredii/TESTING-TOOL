import { Router } from 'express';
import { TestConfigController } from '../controllers/testConfig.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validateRequest } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as Validators from '../validators/testConfig.validator';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', validateRequest(Validators.createTestConfigSchema), asyncHandler(TestConfigController.createConfig));
// Note: Getting configs by project will be mapped in the project routes or a special query here
router.get('/:id', asyncHandler(TestConfigController.getConfigById));
router.patch('/:id', validateRequest(Validators.updateTestConfigSchema), asyncHandler(TestConfigController.updateConfig));
router.delete('/:id', asyncHandler(TestConfigController.deleteConfig));

export default router;
