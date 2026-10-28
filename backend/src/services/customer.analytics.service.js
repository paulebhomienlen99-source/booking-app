import { pool } from "../config/db.js";

export async function getCustomerAnalyticsService(
  customerId
) {
  const bookings = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE customer_id = $1
    `,
    [customerId]
  );

  const completed = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE customer_id = $1
    AND status = 'confirmed'
    `,
    [customerId]
  );

  const cancelled = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE customer_id = $1
    AND status = 'cancelled'
    `,
    [customerId]
  );

  const totalSpent = await pool.query(
    `
    SELECT
      COALESCE(
        SUM(s.price),
        0
      ) AS total
    FROM reservations r
    JOIN services s
      ON s.id = r.listing_id
    WHERE r.customer_id = $1
    AND r.status = 'confirmed'
    `,
    [customerId]
  );

  const reviews = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM reviews
    WHERE customer_id = $1
    `,
    [customerId]
  );

  return {
    totalBookings: Number(
      bookings.rows[0].total
    ),

    completedBookings: Number(
      completed.rows[0].total
    ),

    cancelledBookings: Number(
      cancelled.rows[0].total
    ),

    totalSpent: Number(
      totalSpent.rows[0].total
    ),

    totalReviews: Number(
      reviews.rows[0].total
    ),
  };
}
