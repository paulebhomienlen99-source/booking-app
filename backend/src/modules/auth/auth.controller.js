import { register, login } from "./auth.service.js";

export async function registerHandler(req, res) {
  try {
    const { email, password, role } = req.body;

    console.log("REGISTER REQUEST:", {
      email,
      role,
    });

    const user = await register({
      email,
      password,
      role,
    });

    res.status(201).json({
      user,
    });
  } catch (err) {
    console.error(
      "REGISTER ERROR:",
      err
    );

    if (err.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    res.status(500).json({
      error: "Internal error",
      details: err.message,
    });
  }
}

export async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", email);

    const result = await login({
      email,
      password,
    });

    console.log("LOGIN RESULT:", result);

    res.json(result);
  } catch (err) {
    console.error(
      "LOGIN ERROR:",
      err
    );

    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    res.status(500).json({
      error: "Internal error",
      details: err.message,
    });
  }
}

export async function meHandler(req, res) {
  res.json({
    user: req.user,
  });
}
