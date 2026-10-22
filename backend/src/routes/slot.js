import express from "express";

import {
  createSlot,
  getAvailableSlots,
} from "../controllers/slot.controller.js";

const router = express.Router();

// Create slot
router.post("/create", createSlot);

// Get available slots for a service
router.get(
  "/service/:id",
  getAvailableSlots
);

export default router;
