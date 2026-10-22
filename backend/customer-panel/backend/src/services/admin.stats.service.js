import { pool } from "../config/db.js";

export const getAdminStatsService = async () => {

  // ============================
  //   KPI BASE
  // ============================
  const totalProviders = await pool.query(`SELECT COUNT(*) FROM providers`);
  const pendingProviders = await pool.query(`SELECT COUNT(*) FROM providers WHERE status='pending'`);
  const approvedProviders = await pool.query(`SELECT COUNT(*) FROM providers WHERE status='approved'`);

  const totalUsers = await pool.query(`SELECT COUNT(*) FROM users WHERE role='customer'`);
  const totalListings = await pool.query(`SELECT COUNT(*) FROM listings`);
  const totalReservations = await pool.query(`SELECT COUNT(*) FROM reservations`);

  // ============================
  //   PRENOTAZIONI PER GIORNO
  // ============================
  const reservationsByDay = await pool.query(`
    SELECT DATE(created_at) AS day, COUNT(*) AS count
    FROM reservations
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `);

  // ============================
  //   TOP SERVIZI PIÙ PRENOTATI
  // ============================
  const topServices = await pool.query(`
    SELECT listing_id, COUNT(*) AS count
    FROM reservations
    GROUP BY listing_id
    ORDER BY count DESC
    LIMIT 5
  `);

  // ============================
  //   RICAVI TOTALI
  // ============================
  const totalRevenue = await pool.query(`
    SELECT SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
  `);

  // ============================
  //   RICAVI PER GIORNO
  // ============================
  const revenueByDay = await pool.query(`
    SELECT DATE(r.created_at) AS day, SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY DATE(r.created_at)
    ORDER BY day ASC
  `);

  // ============================
  //   RICAVI PER MESE
  // ============================
  const revenueByMonth = await pool.query(`
    SELECT DATE_TRUNC('month', r.created_at) AS month, SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY DATE_TRUNC('month', r.created_at)
    ORDER BY month ASC
  `);

  // ============================
  //   RICAVI PER ANNO
  // ============================
  const revenueByYear = await pool.query(`
    SELECT DATE_TRUNC('year', r.created_at) AS year, SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY DATE_TRUNC('year', r.created_at)
    ORDER BY year ASC
  `);

  // ============================
  //   RICAVI PER PROVIDER
  // ============================
  const revenueByProvider = await pool.query(`
    SELECT 
      p.id AS provider_id,
      p.business_name,
      SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    JOIN providers p ON l.provider_id = p.id
    GROUP BY p.id, p.business_name
    ORDER BY revenue DESC
  `);

  // ============================
  //   RICAVI PER SERVIZIO (TOP 10)
  // ============================
  const revenueByService = await pool.query(`
    SELECT 
      l.id AS listing_id,
      l.title,
      SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY l.id, l.title
    ORDER BY revenue DESC
    LIMIT 10
  `);

  // ============================
  //   RICAVI PER CATEGORIA
  // ============================
  const revenueByCategory = await pool.query(`
    SELECT 
      l.category,
      SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY l.category
    ORDER BY revenue DESC
  `);

  // ============================
  //   RICAVI PER FASCIA ORARIA
  // ============================
  const revenueByHour = await pool.query(`
    SELECT 
      EXTRACT(HOUR FROM r.created_at) AS hour,
      SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY hour
    ORDER BY hour ASC
  `);

  // ============================
  //   RICAVI PER GIORNO DELLA SETTIMANA
  // ============================
  const revenueByWeekday = await pool.query(`
    SELECT 
      TO_CHAR(r.created_at, 'Day') AS weekday,
      SUM(l.price) AS revenue
    FROM reservations r
    JOIN listings l ON r.listing_id = l.id
    GROUP BY weekday
    ORDER BY weekday ASC
  `);

  // ============================
  //   RETURN COMPLETO
  // ============================
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
    revenueByYear: revenueByYear.rows,

    revenueByProvider: revenueByProvider.rows,
    revenueByService: revenueByService.rows,
    revenueByCategory: revenueByCategory.rows,
    revenueByHour: revenueByHour.rows,
    revenueByWeekday: revenueByWeekday.rows
  };
};



