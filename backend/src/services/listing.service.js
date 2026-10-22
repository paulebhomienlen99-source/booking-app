import { pool } from "../config/db.js";

export const createListingService = async ({
  provider_id,
  title,
  description,
  price,
}) => {
  const result = await pool.query(
    `
    INSERT INTO services (
      provider_id,
      title,
      description,
      price,
      status
    )
    VALUES ($1, $2, $3, $4, 'pending')
    RETURNING *
    `,
    [
      provider_id,
      title,
      description,
      price,
    ]
  );

  return result.rows[0];
};

// NUOVA FUNZIONE DA AGGIUNGERE QUI

export const getProviderServicesService = async (
  provider_id
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      price,
      description
    FROM services
    WHERE provider_id = $1
    AND status = 'approved'
    ORDER BY title
    `,
    [provider_id]
  );

  return result.rows;
};