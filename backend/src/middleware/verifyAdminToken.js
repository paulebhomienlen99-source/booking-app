import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export default function verifyAdminToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Token missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("DECODED JWT:", decoded);

    req.admin = decoded;

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("JWT ERROR:", error.message);
    }

    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}
    