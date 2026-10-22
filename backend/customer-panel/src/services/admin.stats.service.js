import { pool } from "../config/db.js";

export const getAdminStatsService = async () => {
  const totalProviders = await pool.query(`SELECT COUNT(*) FROM providers`);
  const pendingProviders = await pool.query(`SELECT COUNT(*) FROM providers WHERE status='pending'`);
  const approvedProviders = await pool.query(`SELECT COUNT(*) FROM providers WHERE status='approved'`);

  const totalUsers = await pool.query(`SELECT COUNT(*) FROM users WHERE role='customer'`);
  const totalListings = await pool.query(`SELECT COUNT(*) FROM listings`);
  const totalReservations = await pool.query(`SELECT COUNT(*) FROM reservations`);

  const reservationsByDay = await pool.query(`
    SELECT DATE(created_at) AS day, COUNT(*) AS count
    FROM reservations
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `);

  const topServices = await pool.query(`
    SELECT listing_id, COUNT(*) AS count
    FROM reservations
    GROUP BY listing_id
    ORDER BY count DESC
    LIMIT 5
  `);

  return {
    totalProviders: totalProviders.rows[0].count,
    pendingProviders: pendingProviders.rows[0].count,
    approvedProviders: approvedProviders.rows[0].count,
    totalUsers: totalUsers.rows[0].count,
    totalListings: totalListings.rows[0].count,
    totalReservations: totalReservations.rows[0].count,
    reservationsByDay: reservationsByDay.rows,
    topServices: topServices.rows
  };
};
const revenueByDay = await pool.query(`
  SELECT DATE(r.created_at) AS day, SUM(l.price) AS revenue
  FROM reservations r
  JOIN listings l ON r.listing_id = l.id
  GROUP BY DATE(r.created_at)
  ORDER BY day ASC
`);

const totalRevenue = await pool.query(`
  SELECT SUM(l.price) AS revenue
  FROM reservations r
  JOIN listings l ON r.listing_id = l.id
`);

const revenueByMonth = await pool.query(`
  SELECT DATE_TRUNC('month', r.created_at) AS month, SUM(l.price) AS revenue
  FROM reservations r
  JOIN listings l ON r.listing_id = l.id
  GROUP BY DATE_TRUNC('month', r.created_at)
  ORDER BY month ASC
`);

const revenueByYear = await pool.query(`
  SELECT DATE_TRUNC('year', r.created_at) AS year, SUM(l.price) AS revenue
  FROM reservations r
  JOIN listings l ON r.listing_id = l.id
  GROUP BY DATE_TRUNC('year', r.created_at)
  ORDER BY year ASC
`);
return {
  totalProviders: totalProviders.rows[0].count,
  pendingProviders: pendingProviders.rows[0].count,
  approvedProviders: approvedProviders.rows[0].count,
  totalUsers: totalUsers.rows[0].count,
  totalListings: totalListings.rows[0].count,
  totalReservations: totalReservations.rows[0].count,
  reservationsByDay: reservationsByDay.rows,
  topServices: topServices.rows,
  revenueByDay: revenueByDay.rows,
  totalRevenue: totalRevenue.rows[0].revenue,
  revenueByMonth: revenueByMonth.rows,
  revenueByYear: revenueByYear.rows
};
