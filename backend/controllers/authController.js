import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password]
  );

  if (user.rows.length === 0)
    return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user.rows[0].id,
      role: user.rows[0].role,
    },
    "SECRET123"
  );

  res.json({
    token,
    role: user.rows[0].role,
  });
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  await pool.query(
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)",
    [name, email, password, role]
  );

  res.json({ message: "User registered" });
}
