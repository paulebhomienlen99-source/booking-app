import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
} from "../../config/env.js";

import { sendMail } from "../../config/email.js";

import {
  findUserByEmail,
  createUser,
  saveResetToken,
  findUserByResetToken,
  updatePassword,
  clearResetToken,
} from "./auth.repository.js";

const SALT_ROUNDS = 12;

export async function register({
  email,
  password,
  role = "customer",
}) {
  const existing = await findUserByEmail(
    email
  );

  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(
    password,
    SALT_ROUNDS
  );

  const user = await createUser({
    email,
    passwordHash,
    role,
  });

  return user;
}

export async function login({
  email,
  password,
}) {
  const user =
    await findUserByEmail(email);

  if (!user) {
    throw new Error(
      "INVALID_CREDENTIALS"
    );
  }

  const ok = await bcrypt.compare(
    password,
    user.password
  );

  if (!ok) {
    throw new Error(
      "INVALID_CREDENTIALS"
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn:
        JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function forgotPassword(
  email
) {
  const user =
    await findUserByEmail(email);

  if (!user) {
    return {
      success: true,
    };
  }

  const token =
    crypto.randomBytes(32)
      .toString("hex");

  const expires = new Date(
    Date.now() +
      1000 * 60 * 60
  );

  await saveResetToken(
    email,
    token,
    expires
  );

  const resetUrl =
    `https://booking-app-sigma-two.vercel.app/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject:
      "Reset Password - BookHub",
    html: `
      <h2>Reset Password</h2>

      <p>
        Hai richiesto il reset della password.
      </p>

      <p>
        <a href="${resetUrl}">
          Clicca qui per reimpostare la password
        </a>
      </p>

      <p>
        Il link scade fra 1 ora.
      </p>
    `,
  });

  return {
    success: true,
  };
}

export async function resetPassword(
  token,
  newPassword
) {
  const user =
    await findUserByResetToken(
      token
    );

  if (!user) {
    throw new Error(
      "INVALID_RESET_TOKEN"
    );
  }

  const passwordHash =
    await bcrypt.hash(
      newPassword,
      SALT_ROUNDS
    );

  await updatePassword(
    user.id,
    passwordHash
  );

  await clearResetToken(
    user.id
  );

  return {
    success: true,
  };
}