import express from "express";
import { getAdminStats } from "../controllers/admin.stats.controller.js";

const router = express.Router();

router.get("/stats", getAdminStats);

export default router;
