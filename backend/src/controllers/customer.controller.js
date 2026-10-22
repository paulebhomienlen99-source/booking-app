import { pool } from "../config/db.js";
import { getCustomerReservationsService } from "../services/customer.service.js";

export const getCustomerReservations = async (
  req,
  res
) => {
  res.json(
    await getCustomerReservationsService(
      req.params.id
    )
  );
};

export const getApprovedServices = async (
  req,
  res
) => {
  try {
    const result = await pool.query(`
  SELECT
    s.id,
    s.title,
    s.description,
    s.price,

    COALESCE(
      ROUND(AVG(r.rating)::numeric, 1),
      0
    ) AS average_rating,

    COUNT(r.id)::integer
      AS total_reviews

  FROM services s

  LEFT JOIN reviews r
    ON r.provider_id = s.provider_id

  WHERE s.status = 'approved'

  GROUP BY
    s.id,
    s.title,
    s.description,
    s.price

  ORDER BY s.id DESC
`);


    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};