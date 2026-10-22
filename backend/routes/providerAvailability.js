const express = require('express');
const router = express.Router();
const db = require('../provider-adapter');

router.post('/', async (req, res) => {
  const { provider_id, date, start_time, end_time } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO provider_availability (provider_id, date, start_time, end_time)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [provider_id, date, start_time, end_time]
    );

    res.json({ success: true, availability: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  const provider_id = req.query.provider_id;

  try {
    const result = await db.query(
      `SELECT * FROM provider_availability WHERE provider_id = $1`,
      [provider_id]
    );

    res.json({ success: true, availability: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
