import { pool } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Controlla se l'admin esiste
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const admin = result.rows[0];

    // 2. Controlla la password
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. Genera token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
