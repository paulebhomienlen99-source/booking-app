import express from 'express';
import { createReservation } from '../controllers/reservation.controller.js';

const router = express.Router();

router.post('/create', createReservation);

export default router;
