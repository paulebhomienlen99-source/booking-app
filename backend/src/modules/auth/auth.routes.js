import { Router } from 'express';
import { registerHandler, loginHandler, meHandler } from './auth.controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/me', auth, meHandler);

export default router;
