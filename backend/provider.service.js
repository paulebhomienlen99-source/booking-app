import { pool } from '../config/db.js';

export const createProviderService = async ({ user_id, business_name, description }) => {
  const result = await pool.query(
    `INSERT INTO providers (user_id, business_name, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [user_id, business_name, description]
  );
  return result.rows[0];
};

export const uploadDocumentService = async ({ provider_id, file_path }) => {
  const result = await pool.query(
    `INSERT INTO provider_documents (provider_id, file_path)
     VALUES ($1, $2) RETURNING *`,
    [provider_id, file_path]
  );
  return result.rows[0];
};

export const approveProviderService = async (provider_id) => {
  await pool.query(
    `UPDATE providers SET status='approved' WHERE id=$1`,
    [provider_id]
  );
  return { success: true };
};
