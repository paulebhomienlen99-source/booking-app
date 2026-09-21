const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:[REDACTED]@postgres:5432/postgres',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Email transporter (using Gmail or your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
}

// Initialize database
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration_minutes INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        service_id UUID NOT NULL REFERENCES services(id),
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO services (id, name, description, duration_minutes, price)
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440001', 'Haircut', 'Professional haircut service', 30, 25.00),
        ('550e8400-e29b-41d4-a716-446655440002', 'Massage', 'Relaxing full-body massage', 60, 80.00),
        ('550e8400-e29b-41d4-a716-446655440003', 'Consultation', 'One-on-one consultation', 45, 50.00)
      ON CONFLICT DO NOTHING;
    `);
    console.log('Database initialized with sample services');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

// ROUTES

// Sign up
app.post('/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    await pool.query(
      'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
      [userId, email, hashedPassword, name]
    );

    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Signup successful' });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get services (no auth required)
app.get('/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking (auth required)
app.post('/bookings', verifyToken, async (req, res) => {
  const { service_id, booking_date, booking_time } = req.body;
  const id = uuidv4();
  
  if (!service_id || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Service, date, and time required' });
  }

  try {
    // Insert booking
    await pool.query(
      'INSERT INTO bookings (id, user_id, service_id, booking_date, booking_time) VALUES ($1, $2, $3, $4, $5)',
      [id, req.userId, service_id, booking_date, booking_time]
    );

    // Get service details
    const serviceResult = await pool.query('SELECT * FROM services WHERE id = $1', [service_id]);
    const service = serviceResult.rows[0];

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.userEmail,
      subject: `Booking Confirmation: ${service.name}`,
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Your booking for <strong>${service.name}</strong> is confirmed.</p>
        <p><strong>Date:</strong> ${booking_date}</p>
        <p><strong>Time:</strong> ${booking_time}</p>
        <p><strong>Duration:</strong> ${service.duration_minutes} minutes</p>
        <p><strong>Price:</strong> $${service.price}</p>
        <p>Thank you for booking with us!</p>
      `,
    });

    res.json({ id, message: 'Booking created and confirmation email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's bookings (auth required)
app.get('/bookings', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT b.*, s.name, s.price, s.duration_minutes FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.user_id = $1',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status (auth required)
app.patch('/bookings/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 AND user_id = $3', [status, id, req.userId]);
    res.json({ message: 'Booking updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} with JWT auth and email notifications`);
  initDB();
});
