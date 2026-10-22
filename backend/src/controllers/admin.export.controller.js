import { pool } from "../config/db.js";
import { Parser } from "json2csv";

// ===============================
// EXPORT CSV
// ===============================
export const exportAnalyticsCSV = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id AS reservation_id,
        r.created_at,
        l.id AS listing_id,
        l.title,
        l.category,
        l.price,
        p.id AS provider_id,
        p.name AS provider_name
      FROM reservations r
      JOIN listings l ON r.listing_id = l.id
      JOIN providers p ON l.provider_id = p.id
      ORDER BY r.created_at DESC
    `);

    const rows = result.rows;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Nessun dato da esportare" });
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("analytics_export.csv");
    return res.send(csv);

  } catch (err) {
    console.error("Export CSV error:", err);
    res.status(500).json({ error: "Errore nell'esportazione CSV" });
  }
};

// ===============================
// EXPORT PDF (placeholder)
// ===============================
export const exportAnalyticsPDF = async (req, res) => {
  try {
    res.json({ message: "Export PDF endpoint OK (placeholder)" });
  } catch (err) {
    console.error("Export PDF error:", err);
    res.status(500).json({ error: "Errore nell'export PDF" });
  }
};

// ===============================
// TEST ENDPOINT
// ===============================
export const exportTest = async (req, res) => {
  try {
    res.json({ message: "Export endpoint OK" });
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Errore nell'export" });
  }
};


