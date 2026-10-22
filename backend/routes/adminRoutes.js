const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");

// =======================
// LOGIN ADMIN
// =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const admin = result.rows[0];

    if (admin.role !== "admin") {
      return res.status(403).json({ error: "Not an admin" });
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, isAdmin: true },
      process.env.ADMIN_JWT_SECRET || "adminsecret",
      { expiresIn: "8h" }
    );

    res.json({ success: true, token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// LISTA PROVIDER PENDING
// =======================
router.get("/providers/pending", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, provider_status, is_provider FROM users WHERE is_provider = true AND provider_status = 'pending'"
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;






