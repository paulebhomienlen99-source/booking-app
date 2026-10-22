import { pool } from "../config/db.js";

export async function getPendingProviders(req, res) {
  const result = await pool.query(
    "SELECT * FROM providers WHERE approved=false"
  );
  res.json(result.rows);
}

export async function approveProvider(req, res) {
  await pool.query("UPDATE providers SET approved=true WHERE id=$1", [
    req.params.id,
  ]);
  res.json({ message: "Provider approved" });
}

export async function getPendingServices(req, res) {
  const result = await pool.query(
    "SELECT * FROM services WHERE approved=false"
  );
  res.json(result.rows);
}

export async function approveService(req, res) {
  await pool.query("UPDATE services SET approved=true WHERE id=$1", [
    req.params.id,
  ]);
  res.json({ message: "Service approved" });
}
