import { pool } from '../../config/db.js';

export async function insertProvider(userId, { business_name, description }) {
  const { rows } = await pool.query(
    `INSERT INTO providers (user_id, business_name, description, status, created_at)
     VALUES ($1, $2, $3, 'pending', NOW())
     RETURNING *`,
    [userId, business_name, description]
  );
  return rows[0];
}

export async function findProviderByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM providers WHERE user_id = $1`,
    [userId]
  );
  return rows[0];
}

export async function findAllProviders() {
  const { rows } = await pool.query(`SELECT * FROM providers`);
  return rows;
}

export async function setProviderStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE providers SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0];
}
