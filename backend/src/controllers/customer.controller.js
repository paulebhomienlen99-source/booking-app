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
        id,
        title,
        description,
        price
      FROM services
      WHERE status = 'approved'
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};