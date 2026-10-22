import { pool } from '../config/db.js';

export const createReservationService = async ({
  customer_id, provider_id, listing_id, slot_id
}) => {
  const result = await pool.query(
    `INSERT INTO reservations (customer_id, provider_id, listing_id, slot_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [customer_id, provider_id, listing_id, slot_id]
  );

  await pool.query(
    `UPDATE availability_slots SET status='booked' WHERE id=$1`,
    [slot_id]
  );

  return result.rows[0];
};
