import express from "express";
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
export default router;