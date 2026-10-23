import { pool } from "../config/db.js";

export const createReviewService = async ({
  reservation_id,
  customer_id,
  provider_id,
  rating,
  comment,
}) => {
  const result = await pool.query(
    `
    INSERT INTO reviews (
      reservation_id,
      customer_id,
      provider_id,
      rating,
      comment
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      reservation_id,
      customer_id,
      provider_id,
      rating,
      comment,
    ]
  );

  return result.rows[0];
};

export const getProviderReviewsService =
  async (provider_id) => {
    const result = await pool.query(
      `
      SELECT
  r.id,
  r.rating,
  r.comment,
  r.created_at,
  u.email AS customer_name
      FROM reviews r
      JOIN users u
        ON u.id = r.customer_id
      WHERE r.provider_id = $1
      ORDER BY r.created_at DESC
      `,
      [provider_id]
    );

    return result.rows;
  };

export const getProviderAverageRatingService =
  async (provider_id) => {
    const result = await pool.query(
      `
      SELECT
        ROUND(
          AVG(rating)::numeric,
          1
        ) AS average_rating,
        COUNT(*) AS total_reviews
      FROM reviews
      WHERE provider_id = $1
      `,
      [provider_id]
    );

    return result.rows[0];
  };
  export const getReviewByReservationService =
  async (reservation_id) => {
    const result = await pool.query(
      `
      SELECT *
      FROM reviews
      WHERE reservation_id = $1
      `,
      [reservation_id]
    );

    return result.rows[0] || null;
  };