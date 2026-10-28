import { pool } from "../config/db.js";

export const getCustomerReservationsService = async (
  customer_id
) => {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.status,

      s.title AS service_title,

      p.id AS provider_id,
      p.name AS provider_name,

      sl.slot_date,
      sl.start_time,
      sl.end_time

    FROM reservations r

    JOIN services s
      ON s.id = r.listing_id

    JOIN providers p
      ON p.id = r.provider_id

    JOIN availability_slots sl
      ON sl.id = r.slot_id

    WHERE r.customer_id = $1

    ORDER BY r.created_at DESC
    `,
    [customer_id]
  );

  return result.rows;
};