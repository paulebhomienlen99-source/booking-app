import express from "express";

import {
  createReservation,
  cancelReservation,
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

export default router;