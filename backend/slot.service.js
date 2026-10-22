import { pool } from '../config/db.js';

export const createSlotService = async ({
  provider_id, listing_id, start_time, end_time
}) => {
  const result = await pool.query(
    `INSERT INTO availability_slots (provider_id, listing_id, start_time, end_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [provider_id, listing_id, start_time, end_time]
  );
  return result.rows[0];
};
