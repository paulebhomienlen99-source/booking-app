import { pool } from "../config/db.js";

export const getFilteredAnalyticsService = async (
  filters
) => {
  const {
    date_from,
    date_to,
    provider_id,
    category,
    min_price,
    max_price,
  } = filters;

  let conditions = [];
  let params = [];

  if (date_from) {
    params.push(date_from);
    conditions.push(
      `r.created_at >= $${params.length}`
    );
  }

  if (date_to) {
    params.push(date_to);
    conditions.push(
      `r.created_at <= $${params.length}`
    );
  }

  if (provider_id) {
    params.push(provider_id);
    conditions.push(
      `l.provider_id = $${params.length}`
    );
  }

  if (category) {
    params.push(category);
    conditions.push(
      `l.category = $${params.length}`
    );
  }

  if (min_price) {
    params.push(min_price);
    conditions.push(
      `l.price >= $${params.length}`
    );
  }

  if (max_price) {
    params.push(max_price);
    conditions.push(
      `l.price <= $${params.length}`
    );
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const revenue = await pool.query(
    `
    SELECT COALESCE(SUM(l.price), 0) AS revenue
    FROM reservations r
    JOIN listings l
      ON r.listing_id = l.id
    ${where}
    `,
    params
  );

  const reservations = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM reservations r
    JOIN listings l
      ON r.listing_id = l.id
    ${where}
    `,
    params
  );

  const revenueByDay = await pool.query(
    `
    SELECT
      DATE(r.created_at) AS day,
      SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l
      ON r.listing_id = l.id
    ${where}
    GROUP BY DATE(r.created_at)
    ORDER BY day ASC
    `,
    params
  );

  const monthlyRevenue = await pool.query(
    `
    SELECT
      TO_CHAR(
        DATE_TRUNC('month', r.created_at),
        'Mon YYYY'
      ) AS month,
      COALESCE(
        SUM(l.price),
        0
      ) AS revenue
    FROM reservations r
    JOIN listings l
      ON r.listing_id = l.id
    ${where}
    GROUP BY DATE_TRUNC('month', r.created_at)
    ORDER BY DATE_TRUNC('month', r.created_at)
    `,
    params
  );

  return {
    revenue: Number(
      revenue.rows[0].revenue || 0
    ),

    reservations: Number(
      reservations.rows[0].count || 0
    ),

    revenueByDay: revenueByDay.rows,

    monthlyRevenue:
      monthlyRevenue.rows,
  };
};