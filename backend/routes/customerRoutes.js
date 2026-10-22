const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// lista servizi approvati
router.get("/services", auth("customer"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        provider_id,
        title,
        description,
        price
      FROM services
      WHERE status = 'approved'
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// slot disponibili
router.get("/slots/:listingId", auth("customer"), async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM availability WHERE provider_id=(SELECT provider_id FROM listings WHERE id=$1)",
    [req.params.listingId]
  );
  res.json(result.rows);
});

// prenotazione
router.post("/book", auth("customer"), async (req, res) => {
  const { slotId } = req.body;

  await pool.query(
    "INSERT INTO reservations (user_id, slot_id, status) VALUES ($1,$2,'pending')",
    [req.user.id, slotId]
  );

  res.json({ success: true });
});

// mie prenotazioni
router.get("/reservations", auth("customer"), async (req, res) => {
  const result = await pool.query(
    `SELECT r.id, r.status, a.date, a.time, l.title AS listing_title
     FROM reservations r
     JOIN availability a ON r.slot_id=a.id
     JOIN listings l ON a.provider_id=l.provider_id
     WHERE r.user_id=$1`,
    [req.user.id]
  );
  res.json(result.rows);
});

module.exports = router;
