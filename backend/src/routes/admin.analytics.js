import express from "express";
import { getFilteredAnalytics } from "../controllers/admin.analytics.controller.js";

const router = express.Router();

router.get("/analytics", getFilteredAnalytics);

export default router;
