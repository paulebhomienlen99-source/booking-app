import { getAdminStatsService } from "../services/admin.stats.service.js";

export const getAdminStats = async (req, res) => {
  res.json(await getAdminStatsService());
};
