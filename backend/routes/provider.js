import express from "express";
import { auth } from "../middleware/auth.js";
import {
  uploadDocument,
  createListing,
  createSlot,
} from "../controllers/providerController.js";

const router = express.Router();

router.post("/upload-document", auth("provider"), uploadDocument);
router.post("/create-listing", auth("provider"), createListing);
router.post("/create-slot", auth("provider"), createSlot);

export default router;
