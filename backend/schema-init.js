import { pool } from "./src/config/db.js";

export async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'customer');
    CREATE TABLE IF NOT EXISTS providers (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), approved BOOLEAN DEFAULT false, document_uploaded BOOLEAN DEFAULT false);
    CREATE TABLE IF NOT EXISTS services (id SERIAL PRIMARY KEY, provider_id INTEGER REFERENCES providers(id), title TEXT NOT NULL, price NUMERIC(10,2) NOT NULL, approved BOOLEAN DEFAULT false);
    CREATE TABLE IF NOT EXISTS availability_slots (id SERIAL PRIMARY KEY, provider_id INTEGER REFERENCES providers(id), service_id INTEGER REFERENCES services(id), slot_date DATE NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL, status TEXT DEFAULT 'available');
    CREATE TABLE IF NOT EXISTS reservations (id SERIAL PRIMARY KEY, customer_id INTEGER REFERENCES users(id), provider_id INTEGER REFERENCES providers(id), listing_id INTEGER REFERENCES services(id), slot_id INTEGER REFERENCES availability_slots(id), status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT now());
    CREATE INDEX IF NOT EXISTS availability_lookup ON availability_slots(service_id, slot_date, start_time, status);
  `);
}
