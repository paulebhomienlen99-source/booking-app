import { pool } from "../config/db.js";

export async function getAllServices(req, res) {
  const result = await pool.query(
    "SELECT * FROM services WHERE approved=true"
  );
  res.json(result.rows);
}

export async function getMyBookings(req, res) {
  const { id } = req.user;

  const result = await pool.query(
    "SELECT * FROM bookings WHERE customer_id=$1",
    [id]
  );

  res.json(result.rows);
}

export async function createBooking(req, res) {
  const { id } = req.user;
  const { serviceId, date, time } = req.body;

  await pool.query(
    "INSERT INTO bookings(customer_id,service_id,date,time) VALUES($1,$2,$3,$4)",
    [id, serviceId, date, time]
  );

  res.json({ message: "Booking created" });
}
