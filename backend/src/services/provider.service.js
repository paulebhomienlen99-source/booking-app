import { pool } from "../config/db.js";

export const createProviderService = async ({
  name,
  email,
  phone,
  user_id,
}) => {
  const result = await pool.query(
    `
    INSERT INTO providers (
      name,
      email,
      phone,
      user_id,
      status,
      approved,
      document_uploaded
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      'pending',
      false,
      false
    )
    RETURNING *
    `,
    [
      name,
      email,
      phone,
      user_id,
    ]
  );

  return result.rows[0];
};

export const uploadDocumentService = async ({
  provider_id,
  document_path,
}) => {
  await pool.query(
    `
    UPDATE providers
    SET
      document_path = $1,
      document_uploaded = true
    WHERE id = $2
    `,
    [
      document_path,
      provider_id,
    ]
  );

  return {
    success: true,
  };
};

export const approveProviderService = async (
  provider_id
) => {
  await pool.query(
    `
    UPDATE providers
    SET
      approved = true,
      status = 'approved'
    WHERE id = $1
    `,
    [provider_id]
  );

  return {
    success: true,
  };
};

export const getProviderReservationsService =
  async (userId) => {

    const providerResult =
      await pool.query(
        `
        SELECT id
        FROM providers
        WHERE user_id = $1
        LIMIT 1
        `,
        [userId]
      );

    if (
      providerResult.rows.length === 0
    ) {
      return [];
    }

    const providerId =
      providerResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.status,
        u.email AS customer_email,
        s.title AS service_title,
        sl.slot_date,
        sl.start_time,
        sl.end_time
      FROM reservations r
      JOIN users u
        ON u.id = r.customer_id
      JOIN services s
        ON s.id = r.listing_id
      JOIN availability_slots sl
        ON sl.id = r.slot_id
      WHERE r.provider_id = $1
      ORDER BY r.created_at DESC
      `,
      [providerId]
    );

    return result.rows;
  };