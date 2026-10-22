import express from 'express';
import {
  createProvider,
  uploadDocument,
  approveProvider
} from '../controllers/provider.controller.js';

const router = express.Router();

router.post('/create', createProvider);
router.post('/document', uploadDocument);
router.post('/approve/:id', approveProvider);

export default router;
