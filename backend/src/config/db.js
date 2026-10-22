import pg from "pg";
import { DATABASE_URL } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

/*
=================================================
DATABASE CONNECTION
=================================================
*/

if (process.env.NODE_ENV !== "test") {
  pool.connect()
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
}

/*
=================================================
GRACEFUL SHUTDOWN
=================================================
*/

process.on("SIGINT", async () => {
  try {
    await pool.end();
    console.log("Database pool closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing database pool:", err);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    await pool.end();
    console.log("Database pool closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing database pool:", err);
    process.exit(1);
  }
});