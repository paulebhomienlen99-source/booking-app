// backend/src/modules/auth/auth.repository.js

import { pool } from "../../config/db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      email,
      password,
      role
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return rows[0] || null;
}

export async function createUser({
  email,
  passwordHash,
  role,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO users (
      email,
      password,
      role
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      email,
      role
    `,
    [
      email,
      passwordHash,
      role,
    ]
  );

  return rows[0];
}

export async function saveResetToken(
  email,
  token,
  expires
) {
  await pool.query(
    `
    UPDATE users
    SET
      reset_token = $1,
      reset_token_expires = $2
    WHERE email = $3
    `,
    [
      token,
      expires,
      email,
    ]
  );
}

export async function findUserByResetToken(
  token
) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM users
    WHERE reset_token = $1
      AND reset_token_expires > NOW()
    `,
    [token]
  );

  return rows[0] || null;
}

export async function updatePassword(
  userId,
  passwordHash
) {
  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE id = $2
    `,
    [
      passwordHash,
      userId,
    ]
  );
}

export async function clearResetToken(
  userId
) {
  await pool.query(
    `
    UPDATE users
    SET
      reset_token = NULL,
      reset_token_expires = NULL
    WHERE id = $1
    `,
    [userId]
  );
}