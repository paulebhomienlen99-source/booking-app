import { pool } from '../config/db.js';

export const createListingService = async ({
  provider_id, title, description, price, duration_minutes
}) => {
  const result = await pool.query(
    `INSERT INTO listings (provider_id, title, description, price, duration_minutes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [provider_id, title, description, price, duration_minutes]
  );
  return result.rows[0];
};
