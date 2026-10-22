const express = require('express');
const router = express.Router();
const db = require('../provider-adapter');

router.get('/', async (req, res) => {
  const provider_id = req.query.provider_id;

  try {
    const result = await db.query(
      `SELECT * FROM bookings WHERE provider_id = $1 ORDER BY date DESC`,
      [provider_id]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
