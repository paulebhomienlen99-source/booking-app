import express from "express";
import {
  exportAnalyticsCSV,
  exportAnalyticsPDF
} from "../controllers/admin.export.controller.js";

const router = express.Router();

// EXPORT CSV
router.get("/export/csv", exportAnalyticsCSV);

// EXPORT PDF
router.get("/export/pdf", exportAnalyticsPDF);

export default router;
