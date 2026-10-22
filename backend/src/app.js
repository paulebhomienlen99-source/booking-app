import express from "express";
import cors from "cors";

// AUTH ROUTES
import authRoutes from "./modules/auth/auth.routes.js";

// ADMIN ROUTES
import adminAnalyticsRoutes from "./routes/admin.analytics.js";
import adminExportRoutes from "./routes/admin.export.js";
import adminNotifyRoutes from "./routes/admin.notify.js";

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

// ADMIN
app.use("/api/admin", adminAnalyticsRoutes);
app.use("/api/admin", adminExportRoutes);
app.use("/api/admin", adminNotifyRoutes);

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;


