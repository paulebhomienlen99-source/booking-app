import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';
import {
  createProviderHandler,
  getMyProviderHandler,
  getProvidersHandler,
  updateProviderStatusHandler
} from './provider.controller.js';

const router = Router();

router.post('/', auth, createProviderHandler);
router.get('/me', auth, requireRole('provider'), getMyProviderHandler);
router.get('/', getProvidersHandler);
router.patch('/:id/status', auth, requireRole('admin'), updateProviderStatusHandler);

export default router;
