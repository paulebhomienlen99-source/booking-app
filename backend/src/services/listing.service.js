import { pool } from "../config/db.js";

export const createListingService = async ({
  provider_id,
  title,
  description,
  price,
  image_url,
}) => {
  const result = await pool.query(
    `
    INSERT INTO services (
      provider_id,
      title,
      description,
      price,
      approved,
      image_url
    )
    VALUES ($1, $2, $3, $4, false, $5)
    RETURNING *
    `,
    [
      provider_id,
      title,
      description,
      price,
      image_url,
    ]
  );

  return result.rows[0];
};

export const getProviderServicesService = async (
  provider_id
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      price,
      description,
      image_url,
      approved
    FROM services
    WHERE provider_id = $1
    ORDER BY title
    `,
    [provider_id]
  );

  return result.rows;
};