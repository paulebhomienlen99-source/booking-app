const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (user.rowCount === 0) {
    return res.status(401).json({ success: false });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) {
    return res.status(401).json({ success: false });
  }

  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token, role: user.rows[0].role });
});

module.exports = router;


