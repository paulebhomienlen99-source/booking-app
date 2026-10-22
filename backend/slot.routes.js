import express from 'express';
import { createSlot } from '../controllers/slot.controller.js';

const router = express.Router();

router.post('/create', createSlot);

export default router;
