import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import {
  createProvider,
  uploadDocument,
  approveProvider,
  getProviderReservations,
  getProviderAnalytics,
} from "../controllers/provider.controller.js";

import {
  createListing,
  getMyServices,
  deleteService,
  updateService,
} from "../controllers/listing.controller.js";

import {
  createSlot,
} from "../controllers/slot.controller.js";

const router = express.Router();

/*
=====================================
PROVIDER PROFILE
=====================================
*/

router.post(
  "/create",
  auth,
  createProvider
);

router.post(
  "/upload-document",
  auth,
  upload.single("document"),
  uploadDocument
);

router.post(
  "/approve/:id",
  auth,
  approveProvider
);

/*
=====================================
SERVICES
=====================================
*/

router.post(
  "/create-listing",
  auth,
  upload.single("image"),
  createListing
);

router.get(
  "/services",
  auth,
  getMyServices
);

router.delete(
  "/service/:id",
  auth,
  deleteService
);

router.put(
  "/service/:id",
  auth,
  updateService
);

/*
=====================================
SLOTS
=====================================
*/

router.post(
  "/create-slot",
  auth,
  createSlot
);

/*
=====================================
BOOKINGS
=====================================
*/

router.get(
  "/bookings",
  auth,
  getProviderReservations
);

router.get(
  "/analytics",
  auth,
  getProviderAnalytics
);

/*
=====================================
NOTIFICATIONS
=====================================
*/

router.get(
  "/notifications",
  auth,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY id DESC
        `,
        [req.user.id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

export default router;