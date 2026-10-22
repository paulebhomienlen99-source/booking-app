import express from "express";

import { auth } from "../middleware/auth.js";

import {
  createOrder,
  captureOrder,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    success: true,
    paypalConfigured:
      Boolean(process.env.PAYPAL_CLIENT_ID) &&
      Boolean(process.env.PAYPAL_CLIENT_SECRET),
    mode: process.env.PAYPAL_MODE || "sandbox",
  });
});

router.post(
  "/create-order",
  auth,
  createOrder
);

router.post(
  "/capture-order",
  auth,
  captureOrder
);

export default router;