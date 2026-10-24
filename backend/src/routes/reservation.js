import express from "express";

import { auth } from "../middleware/auth.js";

import {
  createReservation,
  cancelReservation,
  getMyReservations,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post(
  "/create",
  createReservation
);

router.post(
  "/cancel/:id",
  cancelReservation
);

router.get(
  "/my",
  auth,
  getMyReservations
);

export default router;