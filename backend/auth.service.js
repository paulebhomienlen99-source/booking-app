import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export const registerUser = async ({ email, password, role }) => {
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password, role)
     VALUES ($1, $2, $3) RETURNING id, email, role`,
    [email, hashed, role]
  );

  return result.rows[0];
};

export const loginUser = async ({ email, password }) => {
  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!user.rows.length) return { error: 'User not found' };

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return { error: 'Invalid password' };

  return {
    id: user.rows[0].id,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
};
