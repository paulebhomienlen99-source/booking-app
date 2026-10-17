import { pool } from "../config/db.js";

export const createReservationService = async ({ customer_id, provider_id, listing_id, slot_id, payment_status = 'pending' }) => {
  if (payment_status !== 'completed') throw new Error('Payment must be completed before reservation confirmation');
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const listing = await db.query(`SELECT s.id, s.provider_id, s.approved, p.status AS provider_status FROM services s JOIN providers p ON p.id=s.provider_id WHERE s.id=$1 FOR UPDATE`, [listing_id]);
    if (!listing.rows.length) throw new Error('Listing not found');
    if (!listing.rows[0].approved || listing.rows[0].provider_status !== 'approved') throw new Error('Provider or listing is not approved');
    const slot = await db.query(`SELECT id, provider_id, service_id, status FROM availability_slots WHERE id=$1 FOR UPDATE`, [slot_id]);
    if (!slot.rows.length) throw new Error('Slot not found');
    if (slot.rows[0].status !== 'available') throw new Error('Slot is already booked');
    if (Number(slot.rows[0].service_id) !== Number(listing_id)) throw new Error('Slot does not belong to listing');
    await db.query(`UPDATE availability_slots SET status='booked' WHERE id=$1`, [slot_id]);
    const result = await db.query(`INSERT INTO reservations (customer_id, provider_id, listing_id, slot_id, status) VALUES ($1,$2,$3,$4,'confirmed') RETURNING *`, [customer_id, listing.rows[0].provider_id, listing_id, slot_id]);
    await db.query('COMMIT');
    return result.rows[0];
  } catch (error) { await db.query('ROLLBACK').catch(() => null); throw error; }
  finally { db.release(); }
};
