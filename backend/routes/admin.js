import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getPendingProviders,
  approveProvider,
  getPendingServices,
  approveService,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/providers/pending", auth("admin"), getPendingProviders);
router.post("/providers/approve/:id", auth("admin"), approveProvider);

router.get("/services/pending", auth("admin"), getPendingServices);
router.post("/services/approve/:id", auth("admin"), approveService);

export default router;
