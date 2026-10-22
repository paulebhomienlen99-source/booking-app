import { pool } from "../config/db.js";

export async function uploadDocument(req, res) {
  const { id } = req.user;

  await pool.query(
    "UPDATE providers SET document_uploaded=true WHERE user_id=$1",
    [id]
  );

  res.json({ message: "Document uploaded" });
}

export async function createListing(req, res) {
  const { id } = req.user;
  const { title, price } = req.body;

  await pool.query(
    "INSERT INTO services(title,price,provider_id,approved) VALUES($1,$2,$3,false)",
    [title, price, id]
  );

  res.json({ message: "Listing created" });
}

export async function createSlot(req, res) {
  const { id } = req.user;
  const { date, time } = req.body;

  await pool.query(
    "INSERT INTO slots(provider_id,date,time) VALUES($1,$2,$3)",
    [id, date, time]
  );

  res.json({ message: "Slot created" });
}
