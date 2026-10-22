import express from "express";
import { notifyTopProviders, notifyAdmin } from "../controllers/admin.notify.controller.js";

const router = express.Router();

// Notifica i top provider
router.get("/top", notifyTopProviders);

// Endpoint di test
router.get("/test", notifyAdmin);

export default router;

