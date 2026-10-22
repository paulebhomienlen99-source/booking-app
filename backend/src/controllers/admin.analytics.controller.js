import { getFilteredAnalyticsService } from "../services/admin.analytics.service.js";

export const getFilteredAnalytics = async (req, res) => {
  try {
    const filters = req.query; // date_from, date_to, provider_id, category
    const data = await getFilteredAnalyticsService(filters);
    res.json(data);
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Errore nel calcolo analytics" });
  }
};
