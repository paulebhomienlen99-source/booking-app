import { pool } from "../config/db.js";

// ===============================
// NOTIFICA TOP PROVIDERS
// ===============================
export const notifyTopProviders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        COUNT(r.id) AS total_reservations
      FROM providers p
      JOIN listings l ON l.provider_id = p.id
      JOIN reservations r ON r.listing_id = l.id
      GROUP BY p.id
      ORDER BY total_reservations DESC
      LIMIT 5
    `);

    const topProviders = result.rows;

    res.json({
      message: "Top providers notificati",
      providers: topProviders
    });

  } catch (err) {
    console.error("Notify top providers error:", err);
    res.status(500).json({ error: "Errore nella notifica dei top providers" });
  }
};

// ===============================
// ENDPOINT DI TEST
// ===============================
export const notifyAdmin = async (req, res) => {
  try {
    res.json({ message: "Notify endpoint OK" });
  } catch (err) {
    console.error("Notify error:", err);
    res.status(500).json({ error: "Errore nella notifica" });
  }
};

