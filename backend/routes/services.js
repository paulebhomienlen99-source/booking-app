const express = require('express');
const router = express.Router();
const db = require('../provider-adapter');

router.post('/create', async (req, res) => {
  const { provider_id, name, category, country, city, price, duration, description } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO services (provider_id, name, category, country, city, price, duration, description, approved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false)
       RETURNING *`,
      [provider_id, name, category, country, city, price, duration, description]
    );

    res.json({ success: true, service: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/my', async (req, res) => {
  const provider_id = req.query.provider_id;

  try {
    const result = await db.query(
      `SELECT * FROM services WHERE provider_id = $1`,
      [provider_id]
    );

    res.json({ success: true, services: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
