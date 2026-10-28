import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function auth(req, res, next) {
  const header = req.headers.authorization;

  console.log("AUTHORIZATION:", header);

  if (!header || !header.startsWith("Bearer ")) {
    console.error("AUTH ERROR: Missing token");

    return res.status(401).json({
      error: "Missing token",
    });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      JWT_SECRET
    );

    console.log(
      "JWT PAYLOAD:",
      payload
    );

    req.user = payload;

    next();
  } catch (err) {
    console.error(
      "JWT VERIFY ERROR:",
      err.message
    );

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}