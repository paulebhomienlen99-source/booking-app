import { pool } from "../../config/db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    "SELECT id, email, password, role FROM users WHERE email = $1",
    [email]
  );

  return rows[0] || null;
}

export async function createUser({
  email,
  passwordHash,
  role,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO users (
      email,
      password,
      role
    )
    VALUES ($1, $2, $3)
    RETURNING id, email, role
    `,
    [
      email,
      passwordHash,
      role,
    ]
  );

  return rows[0];
}
