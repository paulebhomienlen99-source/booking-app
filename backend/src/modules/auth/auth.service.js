import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
} from "../../config/env.js";

import {
  findUserByEmail,
  createUser,
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

  const passwordHash =
    await bcrypt.hash(
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

  const ok =
    await bcrypt.compare(
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