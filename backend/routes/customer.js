import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getAllServices,
  getMyBookings,
  createBooking,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/services", auth("customer"), getAllServices);
router.get("/bookings", auth("customer"), getMyBookings);
router.post("/book", auth("customer"), createBooking);

export default router;
