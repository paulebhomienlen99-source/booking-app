const express = require('express');
const router = express.Router();
const db = require('../provider-adapter');

router.get('/', async (req, res) => {
  const provider_id = req.query.provider_id;

  try {
    const result = await db.query(
      `SELECT SUM(price) AS total_earnings
       FROM bookings
       WHERE provider_id = $1 AND status = 'completed'`,
      [provider_id]
    );

    res.json({ success: true, earnings: result.rows[0].total_earnings || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
