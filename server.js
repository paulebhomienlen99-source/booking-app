const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect().catch(err => console.error('Connection error:', err));

async function initDB() {
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await client.query(`CREATE TABLE IF NOT EXISTS services (id UUID PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, category VARCHAR(50) NOT NULL, duration_minutes INT NOT NULL, price DECIMAL(10, 2) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await client.query(`CREATE TABLE IF NOT EXISTS bookings (id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id), service_id UUID NOT NULL REFERENCES services(id), booking_date DATE NOT NULL, booking_time TIME NOT NULL, address VARCHAR(255), city VARCHAR(100), status VARCHAR(50) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    
    await client.query(`INSERT INTO services (id, name, description, category, duration_minutes, price) VALUES 
      ('550e8400-e29b-41d4-a716-446655440001', 'Haircut', 'Professional haircut service', 'salon', 30, 25.00),
      ('550e8400-e29b-41d4-a716-446655440002', 'Massage', 'Relaxing full-body massage', 'salon', 60, 80.00),
      ('550e8400-e29b-41d4-a716-446655440003', 'Consultation', 'One-on-one consultation', 'salon', 45, 50.00),
      ('550e8400-e29b-41d4-a716-446655440004', 'Italian Restaurant', 'Fine dining Italian cuisine', 'restaurant', 120, 65.00),
      ('550e8400-e29b-41d4-a716-446655440005', 'Sushi Bar', 'Fresh Japanese sushi experience', 'restaurant', 90, 55.00),
      ('550e8400-e29b-41d4-a716-446655440006', 'Burger Joint', 'Casual burger and fries', 'restaurant', 60, 20.00),
      ('550e8400-e29b-41d4-a716-446655440007', 'City Taxi', 'Economy taxi service', 'taxi', 30, 15.00),
      ('550e8400-e29b-41d4-a716-446655440008', 'Premium Taxi', 'Luxury taxi service', 'taxi', 30, 30.00),
      ('550e8400-e29b-41d4-a716-446655440009', '5-Star Hotel', 'Luxury hotel with all amenities', 'hotel', 1440, 250.00),
      ('550e8400-e29b-41d4-a716-446655440010', '4-Star Hotel', 'Comfortable hotel with great service', 'hotel', 1440, 150.00),
      ('550e8400-e29b-41d4-a716-446655440011', 'Budget Hotel', 'Affordable hotel rooms', 'hotel', 1440, 75.00)
      ON CONFLICT DO NOTHING`);
    console.log('Database initialized');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
}

app.post('/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await client.query('INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)', [userId, email, hashedPassword, name]);
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/services', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM services ORDER BY category, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/bookings', verifyToken, async (req, res) => {
  const { service_id, booking_date, booking_time, address, city } = req.body;
  const id = uuidv4();
  try {
    await client.query('INSERT INTO bookings (id, user_id, service_id, booking_date, booking_time, address, city) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, req.userId, service_id, booking_date, booking_time, address, city]);
    res.json({ id, message: 'Booking created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bookings', verifyToken, async (req, res) => {
  try {
    const result = await client.query('SELECT b.*, s.name, s.price FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.user_id = $1 ORDER BY b.booking_date DESC', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/bookings/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await client.query('UPDATE bookings SET status = $1 WHERE id = $2 AND user_id = $3', [status, id, req.userId]);
    res.json({ message: 'Booking updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  initDB();
});

client.on('error', (err) => console.error('Database error:', err));
