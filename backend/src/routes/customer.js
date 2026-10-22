import express from "express";

import {
  getCustomerReservations,
  getApprovedServices,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get(
  "/services",
  getApprovedServices
);

router.get(
  "/:id/reservations",
  getCustomerReservations
);

export default router;
