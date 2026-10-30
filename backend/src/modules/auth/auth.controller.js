import {
  register,
  login,
  forgotPassword,
} from "./auth.service.js";

export async function registerHandler(req, res) {
  try {
    const { email, password, role } = req.body;

    const user = await register({
      email,
      password,
      role,
    });

    res.status(201).json({
      user,
    });
  } catch (err) {
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

    const result = await login({
      email,
      password,
    });

    res.json(result);
  } catch (err) {
    if (
      err.message ===
      "INVALID_CREDENTIALS"
    ) {
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

export async function forgotPasswordHandler(
  req,
  res
) {
  try {
    const { email } = req.body;

    await forgotPassword(email);

    res.json({
      success: true,
      message:
        "Se l'email esiste, riceverai un link per il reset della password.",
    });
  } catch (err) {
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
