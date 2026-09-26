const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const paypal = require('@paypal/checkout-server-sdk');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send email
async function sendEmail(to, subject, htmlContent) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
}
let paypalClient;
if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  paypalClient = new paypal.core.PayPalHttpClient(environment);
  console.log('✓ PayPal client initialized');
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect().catch(err => console.error('Connection error:', err));

async function initDB() {
  try {
    console.log('Starting database initialization...');
    
    await client.query(`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, reset_token VARCHAR(255), reset_token_expires TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('✓ Users table created');
    
    await client.query(`CREATE TABLE IF NOT EXISTS services (id UUID PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, category VARCHAR(50) NOT NULL, duration_minutes INT NOT NULL, price DECIMAL(10, 2) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('✓ Services table created');
    
    await client.query(`CREATE TABLE IF NOT EXISTS cities (id UUID PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, country VARCHAR(100) NOT NULL, region VARCHAR(100), latitude DECIMAL(10, 8), longitude DECIMAL(11, 8))`);
    console.log('✓ Cities table created');
    
    await client.query(`CREATE TABLE IF NOT EXISTS bookings (id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id), service_id UUID NOT NULL REFERENCES services(id), booking_date DATE NOT NULL, booking_time TIME NOT NULL, address VARCHAR(255), city VARCHAR(100), latitude DECIMAL(10, 8), longitude DECIMAL(11, 8), user_latitude DECIMAL(10, 8), user_longitude DECIMAL(11, 8), status VARCHAR(50) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await client.query(`CREATE TABLE IF NOT EXISTS subscriptions (id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id) UNIQUE, plan VARCHAR(50) DEFAULT 'free', booking_limit INT DEFAULT 10, monthly_bookings INT DEFAULT 0, subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, next_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 month', renewal_price DECIMAL(10, 2), auto_renew BOOLEAN DEFAULT true, paypal_subscription_id VARCHAR(255))`);
    await client.query(`CREATE TABLE IF NOT EXISTS payments (id UUID PRIMARY KEY, booking_id UUID NOT NULL REFERENCES bookings(id), user_id UUID NOT NULL REFERENCES users(id), service_price DECIMAL(10, 2) NOT NULL, commission DECIMAL(10, 2) NOT NULL, total_paid DECIMAL(10, 2) NOT NULL, payment_status VARCHAR(50) DEFAULT 'completed', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await client.query(`CREATE TABLE IF NOT EXISTS earnings (id UUID PRIMARY KEY, total_commission DECIMAL(12, 2) DEFAULT 0, total_bookings INT DEFAULT 0, last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await client.query(`CREATE TABLE IF NOT EXISTS admin_users (id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    
    // Initialize earnings tracker
    await client.query(`INSERT INTO earnings (id) SELECT '00000000-0000-0000-0000-000000000000' WHERE NOT EXISTS (SELECT 1 FROM earnings)`);
    console.log('✓ Subscriptions, payments, and earnings tables created');
    console.log('✓ Admin users table created');
    console.log('✓ Bookings table created');
    
    // Insert services
    await client.query(`INSERT INTO services (id, name, description, category, duration_minutes, price) VALUES 
      ('550e8400-e29b-41d4-a716-446655440001', 'Haircut', 'Professional haircut service', 'salon', 30, 25.00),
      ('550e8400-e29b-41d4-a716-446655440002', 'Massage', 'Relaxing full-body massage', 'salon', 60, 80.00),
      ('550e8400-e29b-41d4-a716-446655440003', 'Consultation', 'One-on-one consultation', 'salon', 45, 50.00),
      ('550e8400-e29b-41d4-a716-446655440004', 'Italian Restaurant', 'Fine dining Italian cuisine', 'restaurant', 120, 65.00),
      ('550e8400-e29b-41d4-a716-446655440005', 'Sushi Bar', 'Fresh Japanese sushi experience', 'restaurant', 90, 55.00),
      ('550e8400-e29b-41d4-a716-446655440006', 'Burger Joint', 'Casual burger and fries', 'restaurant', 60, 20.00),
      ('550e8400-e29b-41d4-a716-446655440007', 'City Taxi', 'Economy taxi service', 'taxi', 30, 15.00),
      ('550e8400-e29b-41d4-a716-446655440008', 'Premium Taxi', 'Luxury taxi service', 'taxi', 30, 30.00),
      ('550e8400-e29b-41d4-a716-446655440065', 'Economy Car Rental - Daily', 'Affordable economy car rental', 'carrent', 1440, 45.00),
      ('550e8400-e29b-41d4-a716-446655440066', 'Compact Car Rental - Daily', 'Fuel-efficient compact car rental', 'carrent', 1440, 55.00),
      ('550e8400-e29b-41d4-a716-446655440067', 'Mid-Size Car Rental - Daily', 'Spacious mid-size car rental', 'carrent', 1440, 65.00),
      ('550e8400-e29b-41d4-a716-446655440068', 'SUV Rental - Daily', 'Large SUV for family trips', 'carrent', 1440, 85.00),
      ('550e8400-e29b-41d4-a716-446655440069', 'Luxury Car Rental - Daily', 'Premium luxury car rental', 'carrent', 1440, 150.00),
      ('550e8400-e29b-41d4-a716-446655440070', 'Van Rental - Daily', 'Spacious van for group travel', 'carrent', 1440, 95.00),
      ('550e8400-e29b-41d4-a716-446655440071', 'Car Rental - Weekly', '7-day economy car rental', 'carrent', 10080, 280.00),
      ('550e8400-e29b-41d4-a716-446655440072', 'SUV Rental - Weekly', '7-day SUV rental', 'carrent', 10080, 520.00),
      ('550e8400-e29b-41d4-a716-446655440073', 'Luxury Car Rental - Weekly', '7-day luxury car rental', 'carrent', 10080, 900.00),
      ('550e8400-e29b-41d4-a716-446655440074', 'Car Rental - Monthly', '30-day economy car rental', 'carrent', 43200, 1100.00),
      ('550e8400-e29b-41d4-a716-446655440075', 'SUV Rental - Monthly', '30-day SUV rental', 'carrent', 43200, 2000.00),
      ('550e8400-e29b-41d4-a716-446655440009', '5-Star Hotel', 'Luxury hotel with all amenities', 'hotel', 1440, 250.00),
      ('550e8400-e29b-41d4-a716-446655440010', '4-Star Hotel', 'Comfortable hotel with great service', 'hotel', 1440, 150.00),
      ('550e8400-e29b-41d4-a716-446655440011', 'Budget Hotel', 'Affordable hotel rooms', 'hotel', 1440, 75.00),
      ('550e8400-e29b-41d4-a716-446655440012', 'Supermarket Shopping', 'Full grocery shopping service', 'supermarket', 120, 40.00),
      ('550e8400-e29b-41d4-a716-446655440013', 'Organic Groceries', 'Fresh organic produce and products', 'supermarket', 90, 60.00),
      ('550e8400-e29b-41d4-a716-446655440014', 'Pharmacy Delivery', 'Prescription and medicine delivery', 'supermarket', 45, 15.00),
      ('550e8400-e29b-41d4-a716-446655440015', 'Holiday Home Cleaning', 'Deep clean before holidays', 'home', 180, 120.00),
      ('550e8400-e29b-41d4-a716-446655440016', 'Holiday Home Preparation', 'Prepare home for vacation', 'home', 120, 100.00),
      ('550e8400-e29b-41d4-a716-446655440017', 'Pet Care Services', 'Dog walking and pet sitting', 'home', 60, 35.00),
      ('550e8400-e29b-41d4-a716-446655440018', 'Laundry Service', 'Professional laundry and ironing', 'home', 120, 50.00),
      ('550e8400-e29b-41d4-a716-446655440019', 'House Maintenance', 'General repairs and maintenance', 'home', 120, 75.00),
      ('550e8400-e29b-41d4-a716-446655440020', 'Grocery Delivery', 'Fresh groceries at your doorstep', 'supermarket', 60, 25.00),
      ('550e8400-e29b-41d4-a716-446655440021', 'Baby Sitting - 4 Hours', 'Professional baby sitting service', 'childcare', 240, 60.00),
      ('550e8400-e29b-41d4-a716-446655440022', 'Baby Sitting - 8 Hours', 'Full day baby sitting service', 'childcare', 480, 100.00),
      ('550e8400-e29b-41d4-a716-446655440023', 'Newborn Care', 'Specialized newborn care and feeding', 'childcare', 240, 80.00),
      ('550e8400-e29b-41d4-a716-446655440024', 'Dog Day Care', 'Full day dog care and exercise', 'petcare', 480, 50.00),
      ('550e8400-e29b-41d4-a716-446655440025', 'Dog Grooming', 'Professional dog grooming service', 'petcare', 180, 75.00),
      ('550e8400-e29b-41d4-a716-446655440026', 'Dog Training', 'Professional dog training session', 'petcare', 120, 65.00),
      ('550e8400-e29b-41d4-a716-446655440027', 'Dog Walking - 30 min', 'Quick dog walking service', 'petcare', 30, 20.00),
      ('550e8400-e29b-41d4-a716-446655440028', 'Pet Sitting', 'Care for pets while you are away', 'petcare', 240, 45.00),
      ('550e8400-e29b-41d4-a716-446655440029', 'Gym Membership - Monthly', 'Full month gym access', 'gym', 2880, 45.00),
      ('550e8400-e29b-41d4-a716-446655440030', 'Personal Training - 1 Hour', 'One-on-one personal training session', 'gym', 60, 70.00),
      ('550e8400-e29b-41d4-a716-446655440031', 'Yoga Class - 1 Hour', 'Relaxing yoga class for all levels', 'gym', 60, 30.00),
      ('550e8400-e29b-41d4-a716-446655440032', 'CrossFit Training', 'High-intensity CrossFit workout', 'gym', 60, 50.00),
      ('550e8400-e29b-41d4-a716-446655440033', 'Pilates Class', 'Core strengthening pilates class', 'gym', 60, 35.00),
      ('550e8400-e29b-41d4-a716-446655440034', 'Spinning Class', 'Indoor cycling class', 'gym', 45, 25.00),
      ('550e8400-e29b-41d4-a716-446655440035', 'Swimming Session', 'Pool session with instructor', 'gym', 60, 40.00),
      ('550e8400-e29b-41d4-a716-446655440036', 'Zumba Class', 'Fun dance fitness class', 'gym', 60, 25.00),
      ('550e8400-e29b-41d4-a716-446655440037', 'Cozy Home Rental - 1 Night', 'Comfortable home rental for family', 'accommodation', 1440, 85.00),
      ('550e8400-e29b-41d4-a716-446655440038', 'Luxury Home Rental - 1 Night', 'Premium home with modern amenities', 'accommodation', 1440, 150.00),
      ('550e8400-e29b-41d4-a716-446655440039', 'Vacation Home - 1 Week', 'Full week vacation home rental', 'accommodation', 10080, 500.00),
      ('550e8400-e29b-41d4-a716-446655440040', 'Bed & Breakfast - Standard', 'Cozy B&B with breakfast included', 'accommodation', 1440, 70.00),
      ('550e8400-e29b-41d4-a716-446655440041', 'Bed & Breakfast - Deluxe', 'Luxury B&B with premium breakfast', 'accommodation', 1440, 110.00),
      ('550e8400-e29b-41d4-a716-446655440042', 'B&B Package - 2 Nights', 'Two nights B&B stay with meals', 'accommodation', 2880, 180.00),
      ('550e8400-e29b-41d4-a716-446655440043', 'Farm Stay Experience', 'Authentic farm stay with activities', 'accommodation', 1440, 95.00),
      ('550e8400-e29b-41d4-a716-446655440044', 'Beach House Rental - 1 Night', 'Beachfront house with ocean view', 'accommodation', 1440, 200.00),
      ('550e8400-e29b-41d4-a716-446655440045', 'Web Design Service', 'Professional website design and development', 'marketplace', 480, 150.00),
      ('550e8400-e29b-41d4-a716-446655440046', 'Logo Design', 'Custom logo and branding design', 'marketplace', 240, 100.00),
      ('550e8400-e29b-41d4-a716-446655440047', 'Social Media Management', 'Monthly social media content and posting', 'marketplace', 2880, 200.00),
      ('550e8400-e29b-41d4-a716-446655440048', 'Content Writing - Blog Post', 'Professional blog post writing (1000 words)', 'marketplace', 120, 50.00),
      ('550e8400-e29b-41d4-a716-446655440049', 'Video Editing Service', 'Professional video editing and production', 'marketplace', 360, 120.00),
      ('550e8400-e29b-41d4-a716-446655440050', 'Photography Session - 2 Hours', 'Professional photo shoot session', 'marketplace', 120, 150.00),
      ('550e8400-e29b-41d4-a716-446655440051', 'Wedding Photography - Full Day', 'Complete wedding day photography service', 'marketplace', 480, 500.00),
      ('550e8400-e29b-41d4-a716-446655440052', 'Portrait Photography', 'Professional portrait and headshot session', 'marketplace', 90, 100.00),
      ('550e8400-e29b-41d4-a716-446655440053', 'English Tutoring - 1 Hour', 'One-on-one English language tutoring', 'marketplace', 60, 40.00),
      ('550e8400-e29b-41d4-a716-446655440054', 'Math Tutoring - 1 Hour', 'Professional mathematics tutoring', 'marketplace', 60, 45.00),
      ('550e8400-e29b-41d4-a716-446655440055', 'Piano Lessons - 1 Hour', 'Professional piano instruction', 'marketplace', 60, 50.00),
      ('550e8400-e29b-41d4-a716-446655440056', 'Guitar Lessons - 1 Hour', 'Guitar instruction for all levels', 'marketplace', 60, 40.00),
      ('550e8400-e29b-41d4-a716-446655440057', 'Handyman Services - 1 Hour', 'General home repairs and maintenance', 'marketplace', 60, 55.00),
      ('550e8400-e29b-41d4-a716-446655440058', 'Plumbing Repair', 'Professional plumbing services', 'marketplace', 120, 85.00),
      ('550e8400-e29b-41d4-a716-446655440059', 'Electrical Work', 'Licensed electrician services', 'marketplace', 120, 95.00),
      ('550e8400-e29b-41d4-a716-446655440060', 'House Painting - Per Room', 'Professional interior/exterior painting', 'marketplace', 240, 150.00),
      ('550e8400-e29b-41d4-a716-446655440061', 'Freelance Accounting - 1 Hour', 'Small business accounting consultation', 'marketplace', 60, 60.00),
      ('550e8400-e29b-41d4-a716-446655440062', 'Business Consulting - 1 Hour', 'Strategic business advice and planning', 'marketplace', 60, 75.00),
      ('550e8400-e29b-41d4-a716-446655440063', 'Resume Writing Service', 'Professional resume and cover letter', 'marketplace', 90, 50.00),
      ('550e8400-e29b-41d4-a716-446655440064', 'Interview Coaching - 1 Hour', 'Job interview preparation and coaching', 'marketplace', 60, 55.00)
      ON CONFLICT DO NOTHING`);
    console.log('✓ Services inserted');
    
    const cities = [
      ['New York', 'USA', 'New York'],
      ['Los Angeles', 'USA', 'California'],
      ['Chicago', 'USA', 'Illinois'],
      ['Houston', 'USA', 'Texas'],
      ['Miami', 'USA', 'Florida'],
      ['San Francisco', 'USA', 'California'],
      ['Boston', 'USA', 'Massachusetts'],
      ['Seattle', 'USA', 'Washington'],
      ['Philadelphia', 'USA', 'Pennsylvania'],
      ['Phoenix', 'USA', 'Arizona'],
      ['San Antonio', 'USA', 'Texas'],
      ['San Diego', 'USA', 'California'],
      ['Dallas', 'USA', 'Texas'],
      ['Austin', 'USA', 'Texas'],
      ['Denver', 'USA', 'Colorado'],
      ['Portland', 'USA', 'Oregon'],
      ['Las Vegas', 'USA', 'Nevada'],
      ['Atlanta', 'USA', 'Georgia'],
      ['Detroit', 'USA', 'Michigan'],
      ['Minneapolis', 'USA', 'Minnesota'],
      ['Saint Paul', 'USA', 'Minnesota'],
      ['Tampa', 'USA', 'Florida'],
      ['Orlando', 'USA', 'Florida'],
      ['Charlotte', 'USA', 'North Carolina'],
      ['Nashville', 'USA', 'Tennessee'],
      ['Memphis', 'USA', 'Tennessee'],
      ['New Orleans', 'USA', 'Louisiana'],
      ['Baltimore', 'USA', 'Maryland'],
      ['Washington DC', 'USA', 'District of Columbia'],
      ['Pittsburgh', 'USA', 'Pennsylvania'],
      ['Cleveland', 'USA', 'Ohio'],
      ['Columbus', 'USA', 'Ohio'],
      ['Cincinnati', 'USA', 'Ohio'],
      ['Indianapolis', 'USA', 'Indiana'],
      ['Milwaukee', 'USA', 'Wisconsin'],
      ['Louisville', 'USA', 'Kentucky'],
      ['Kansas City', 'USA', 'Missouri'],
      ['Saint Louis', 'USA', 'Missouri'],
      ['Buffalo', 'USA', 'New York'],
      ['Rochester', 'USA', 'New York'],
      ['Albany', 'USA', 'New York'],
      ['Hartford', 'USA', 'Connecticut'],
      ['Providence', 'USA', 'Rhode Island'],
      ['New Haven', 'USA', 'Connecticut'],
      ['Burlington', 'USA', 'Vermont'],
      ['Portland', 'USA', 'Maine'],
      ['Manchester', 'USA', 'New Hampshire'],
      ['Jersey City', 'USA', 'New Jersey'],
      ['Newark', 'USA', 'New Jersey'],
      ['Trenton', 'USA', 'New Jersey'],
      ['Philadelphia', 'USA', 'Pennsylvania'],
      ['Pittsburgh', 'USA', 'Pennsylvania'],
      ['Allentown', 'USA', 'Pennsylvania'],
      ['Baltimore', 'USA', 'Maryland'],
      ['Richmond', 'USA', 'Virginia'],
      ['Arlington', 'USA', 'Virginia'],
      ['Raleigh', 'USA', 'North Carolina'],
      ['Greensboro', 'USA', 'North Carolina'],
      ['Charleston', 'USA', 'South Carolina'],
      ['Savannah', 'USA', 'Georgia'],
      ['Jacksonville', 'USA', 'Florida'],
      ['Key West', 'USA', 'Florida'],
      ['Birmingham', 'USA', 'Alabama'],
      ['Montgomery', 'USA', 'Alabama'],
      ['Mobile', 'USA', 'Alabama'],
      ['Jackson', 'USA', 'Mississippi'],
      ['Memphis', 'USA', 'Tennessee'],
      ['Nashville', 'USA', 'Tennessee'],
      ['Little Rock', 'USA', 'Arkansas'],
      ['Houston', 'USA', 'Texas'],
      ['Dallas', 'USA', 'Texas'],
      ['San Antonio', 'USA', 'Texas'],
      ['Austin', 'USA', 'Texas'],
      ['Fort Worth', 'USA', 'Texas'],
      ['Corpus Christi', 'USA', 'Texas'],
      ['Beaumont', 'USA', 'Texas'],
      ['Galveston', 'USA', 'Texas'],
      ['Oklahoma City', 'USA', 'Oklahoma'],
      ['Tulsa', 'USA', 'Oklahoma'],
      ['Kansas City', 'USA', 'Kansas'],
      ['Wichita', 'USA', 'Kansas'],
      ['Omaha', 'USA', 'Nebraska'],
      ['Lincoln', 'USA', 'Nebraska'],
      ['Des Moines', 'USA', 'Iowa'],
      ['Cedar Rapids', 'USA', 'Iowa'],
      ['Davenport', 'USA', 'Iowa'],
      ['Madison', 'USA', 'Wisconsin'],
      ['Green Bay', 'USA', 'Wisconsin'],
      ['Minneapolis', 'USA', 'Minnesota'],
      ['Saint Paul', 'USA', 'Minnesota'],
      ['Duluth', 'USA', 'Minnesota'],
      ['Rapid City', 'USA', 'South Dakota'],
      ['Sioux Falls', 'USA', 'South Dakota'],
      ['Bismarck', 'USA', 'North Dakota'],
      ['Fargo', 'USA', 'North Dakota'],
      ['Billings', 'USA', 'Montana'],
      ['Missoula', 'USA', 'Montana'],
      ['Bozeman', 'USA', 'Montana'],
      ['Denver', 'USA', 'Colorado'],
      ['Boulder', 'USA', 'Colorado'],
      ['Colorado Springs', 'USA', 'Colorado'],
      ['Albuquerque', 'USA', 'New Mexico'],
      ['Santa Fe', 'USA', 'New Mexico'],
      ['Las Vegas', 'USA', 'Nevada'],
      ['Reno', 'USA', 'Nevada'],
      ['Phoenix', 'USA', 'Arizona'],
      ['Tucson', 'USA', 'Arizona'],
      ['Mesa', 'USA', 'Arizona'],
      ['Chandler', 'USA', 'Arizona'],
      ['Salt Lake City', 'USA', 'Utah'],
      ['Provo', 'USA', 'Utah'],
      ['Ogden', 'USA', 'Utah'],
      ['Boise', 'USA', 'Idaho'],
      ['Pocatello', 'USA', 'Idaho'],
      ['Portland', 'USA', 'Oregon'],
      ['Eugene', 'USA', 'Oregon'],
      ['Salem', 'USA', 'Oregon'],
      ['Seattle', 'USA', 'Washington'],
      ['Spokane', 'USA', 'Washington'],
      ['Tacoma', 'USA', 'Washington'],
      ['Vancouver', 'USA', 'Washington'],
      ['San Francisco', 'USA', 'California'],
      ['Oakland', 'USA', 'California'],
      ['San Jose', 'USA', 'California'],
      ['San Diego', 'USA', 'California'],
      ['Los Angeles', 'USA', 'California'],
      ['Long Beach', 'USA', 'California'],
      ['Pasadena', 'USA', 'California'],
      ['Santa Monica', 'USA', 'California'],
      ['Beverly Hills', 'USA', 'California'],
      ['Sacramento', 'USA', 'California'],
      ['Fresno', 'USA', 'California'],
      ['Bakersfield', 'USA', 'California'],
      ['Anaheim', 'USA', 'California'],
      ['Santa Ana', 'USA', 'California'],
      ['Irvine', 'USA', 'California'],
      ['Honolulu', 'USA', 'Hawaii'],
      ['Anchorage', 'USA', 'Alaska'],
      ['Fairbanks', 'USA', 'Alaska'],
      ['Tokyo', 'Japan', 'Tokyo'],
      ['Yokohama', 'Japan', 'Kanagawa'],
      ['Osaka', 'Japan', 'Osaka'],
      ['Kobe', 'Japan', 'Hyogo'],
      ['Kyoto', 'Japan', 'Kyoto'],
      ['Nagoya', 'Japan', 'Aichi'],
      ['Sapporo', 'Japan', 'Hokkaido'],
      ['Fukuoka', 'Japan', 'Fukuoka'],
      ['Kawasaki', 'Japan', 'Kanagawa'],
      ['Saitama', 'Japan', 'Saitama'],
      ['Kita', 'Japan', 'Tokyo'],
      ['Nishi', 'Japan', 'Tokyo'],
      ['Hiroshima', 'Japan', 'Hiroshima'],
      ['Sendai', 'Japan', 'Miyagi'],
      ['Chiba', 'Japan', 'Chiba'],
      ['Hamamatsu', 'Japan', 'Shizuoka'],
      ['Matsuyama', 'Japan', 'Ehime'],
      ['Shizuoka', 'Japan', 'Shizuoka'],
      ['Okayama', 'Japan', 'Okayama'],
      ['Kumamoto', 'Japan', 'Kumamoto'],
      ['Beijing', 'China', 'Beijing'],
      ['Shanghai', 'China', 'Shanghai'],
      ['Chongqing', 'China', 'Chongqing'],
      ['Tianjin', 'China', 'Tianjin'],
      ['Xi\'an', 'China', 'Shaanxi'],
      ['Guangzhou', 'China', 'Guangdong'],
      ['Shenzhen', 'China', 'Guangdong'],
      ['Wuhan', 'China', 'Hubei'],
      ['Chengdu', 'China', 'Sichuan'],
      ['Nanjing', 'China', 'Jiangsu'],
      ['Hangzhou', 'China', 'Zhejiang'],
      ['Suzhou', 'China', 'Jiangsu'],
      ['Shenyang', 'China', 'Liaoning'],
      ['Qingdao', 'China', 'Shandong'],
      ['Jinan', 'China', 'Shandong'],
      ['Nanchang', 'China', 'Jiangxi'],
      ['Hefei', 'China', 'Anhui'],
      ['Fuzhou', 'China', 'Fujian'],
      ['Xiamen', 'China', 'Fujian'],
      ['Taiyuan', 'China', 'Shanxi'],
      ['Lanzhou', 'China', 'Gansu'],
      ['Urumqi', 'China', 'Xinjiang'],
      ['Lhasa', 'China', 'Tibet'],
      ['Kunming', 'China', 'Yunnan'],
      ['Guiyang', 'China', 'Guizhou'],
      ['Nanning', 'China', 'Guangxi'],
      ['Harbin', 'China', 'Heilongjiang'],
      ['Milan', 'Italy', 'Lombardy'],
      ['Rome', 'Italy', 'Lazio'],
      ['Venice', 'Italy', 'Veneto'],
      ['Naples', 'Italy', 'Campania'],
      ['Turin', 'Italy', 'Piedmont'],
      ['Palermo', 'Italy', 'Sicily'],
      ['Genoa', 'Italy', 'Liguria'],
      ['Bologna', 'Italy', 'Emilia-Romagna'],
      ['Florence', 'Italy', 'Tuscany'],
      ['Bari', 'Italy', 'Apulia'],
      ['Catania', 'Italy', 'Sicily'],
      ['Verona', 'Italy', 'Veneto'],
      ['Messina', 'Italy', 'Sicily'],
      ['Padua', 'Italy', 'Veneto'],
      ['Trieste', 'Italy', 'Friuli-Venezia Giulia'],
      ['Brescia', 'Italy', 'Lombardy'],
      ['Parma', 'Italy', 'Emilia-Romagna'],
      ['Ravenna', 'Italy', 'Emilia-Romagna'],
      ['Reggio Calabria', 'Italy', 'Calabria'],
      ['Reggio Emilia', 'Italy', 'Emilia-Romagna'],
      ['Perugia', 'Italy', 'Umbria'],
      ['Modena', 'Italy', 'Emilia-Romagna'],
      ['Pisa', 'Italy', 'Tuscany'],
      ['Lecce', 'Italy', 'Apulia'],
      ['Ancona', 'Italy', 'Marche'],
      ['Bergamo', 'Italy', 'Lombardy'],
      ['Udine', 'Italy', 'Friuli-Venezia Giulia'],
      ['Como', 'Italy', 'Lombardy'],
      ['Salerno', 'Italy', 'Campania'],
      ['Sassari', 'Italy', 'Sardinia'],
      ['Cagliari', 'Italy', 'Sardinia'],
      ['Siena', 'Italy', 'Tuscany'],
      ['Rimini', 'Italy', 'Emilia-Romagna'],
      ['Terni', 'Italy', 'Umbria'],
      ['Pescara', 'Italy', 'Abruzzo'],
      ['L\'Aquila', 'Italy', 'Abruzzo'],
      ['Chieti', 'Italy', 'Abruzzo'],
      ['Potenza', 'Italy', 'Basilicata'],
      ['Cosenza', 'Italy', 'Calabria'],
      ['Crotone', 'Italy', 'Calabria'],
      ['Lamezia Terme', 'Italy', 'Calabria'],
      ['Caltanissetta', 'Italy', 'Sicily'],
      ['Agrigento', 'Italy', 'Sicily'],
      ['Trapani', 'Italy', 'Sicily'],
      ['Enna', 'Italy', 'Sicily'],
      ['Nuoro', 'Italy', 'Sardinia'],
      ['Oristano', 'Italy', 'Sardinia'],
      ['Isernia', 'Italy', 'Molise'],
      ['Campobasso', 'Italy', 'Molise'],
      ['Frosinone', 'Italy', 'Lazio'],
      ['Latina', 'Italy', 'Lazio'],
      ['Rieti', 'Italy', 'Lazio'],
      ['Viterbo', 'Italy', 'Lazio'],
      ['Benevento', 'Italy', 'Campania'],
      ['Caserta', 'Italy', 'Campania'],
      ['Avellino', 'Italy', 'Campania'],
      ['Matera', 'Italy', 'Basilicata'],
      ['Taranto', 'Italy', 'Apulia'],
      ['Brindisi', 'Italy', 'Apulia'],
      ['Foggia', 'Italy', 'Apulia'],
      ['Barletta', 'Italy', 'Apulia'],
      ['Pesaro', 'Italy', 'Marche'],
      ['Fermo', 'Italy', 'Marche'],
      ['Ascoli Piceno', 'Italy', 'Marche'],
      ['Macerata', 'Italy', 'Marche'],
      ['Tivoli', 'Italy', 'Lazio'],
      ['Frascati', 'Italy', 'Lazio'],
      ['Albano Laziale', 'Italy', 'Lazio'],
      ['Genzano di Roma', 'Italy', 'Lazio'],
      ['Mantova', 'Italy', 'Lombardy'],
      ['Paris', 'France', 'Île-de-France'],
      ['Lyon', 'France', 'Rhône-Alpes'],
      ['Marseille', 'France', 'Provence'],
      ['Berlin', 'Germany', 'Berlin'],
      ['Munich', 'Germany', 'Bavaria'],
      ['Hamburg', 'Germany', 'Hamburg'],
      ['Frankfurt', 'Germany', 'Hesse'],
      ['London', 'United Kingdom', 'England'],
      ['Manchester', 'United Kingdom', 'England'],
      ['Edinburgh', 'United Kingdom', 'Scotland'],
      ['Madrid', 'Spain', 'Community of Madrid'],
      ['Barcelona', 'Spain', 'Catalonia'],
      ['Valencia', 'Spain', 'Community of Valencia'],
      ['Amsterdam', 'Netherlands', 'North Holland'],
      ['Rotterdam', 'Netherlands', 'South Holland'],
      ['Brussels', 'Belgium', 'Brussels'],
      ['Antwerp', 'Belgium', 'Flanders'],
      ['Stockholm', 'Sweden', 'Stockholm'],
      ['Gothenburg', 'Sweden', 'Västra Götaland'],
      ['Oslo', 'Norway', 'Akershus'],
      ['Bergen', 'Norway', 'Hordaland'],
      ['Copenhagen', 'Denmark', 'Capital Region'],
      ['Warsaw', 'Poland', 'Masovian'],
      ['Krakow', 'Poland', 'Lesser Poland'],
      ['Prague', 'Czech Republic', 'Prague'],
      ['Budapest', 'Hungary', 'Budapest'],
      ['Vienna', 'Austria', 'Vienna'],
      ['Salzburg', 'Austria', 'Salzburg'],
      ['Zurich', 'Switzerland', 'Zurich'],
      ['Geneva', 'Switzerland', 'Geneva'],
      ['Lisbon', 'Portugal', 'Lisbon'],
      ['Dublin', 'Ireland', 'Dublin'],
      ['San Juan', 'Puerto Rico', 'San Juan'],
      ['Ponce', 'Puerto Rico', 'Ponce'],
      ['Mayaguez', 'Puerto Rico', 'Mayaguez'],
      ['Havana', 'Cuba', 'Havana'],
      ['Santiago de Cuba', 'Cuba', 'Santiago de Cuba'],
      ['Santa Clara', 'Cuba', 'Villa Clara'],
      ['Camagüey', 'Cuba', 'Camagüey'],
      ['Kingston', 'Jamaica', 'Kingston'],
      ['Montego Bay', 'Jamaica', 'St. James'],
      ['Negril', 'Jamaica', 'Westmoreland'],
      ['Spanish Town', 'Jamaica', 'St. Catherine'],
      ['Port-au-Prince', 'Haiti', 'West'],
      ['Cap-Haïtien', 'Haiti', 'Nord'],
      ['Santo Domingo', 'Dominican Republic', 'Santo Domingo'],
      ['Santiago', 'Dominican Republic', 'Santiago'],
      ['Punta Cana', 'Dominican Republic', 'La Altagracia'],
      ['Puerto Plata', 'Dominican Republic', 'Puerto Plata'],
      ['Bridgetown', 'Barbados', 'Saint Michael'],
      ['Oistins', 'Barbados', 'Christ Church'],
      ['Castries', 'Saint Lucia', 'Castries'],
      ['Soufrière', 'Saint Lucia', 'Soufrière'],
      ['Kingstown', 'Saint Vincent and the Grenadines', 'Saint George'],
      ['Port of Spain', 'Trinidad and Tobago', 'Port of Spain'],
      ['San Fernando', 'Trinidad and Tobago', 'San Fernando'],
      ['Scarborough', 'Trinidad and Tobago', 'Tobago'],
      ['Oranjestad', 'Aruba', 'Oranjestad'],
      ['Willemstad', 'Curaçao', 'Willemstad'],
      ['Philipsburg', 'Sint Maarten', 'Philipsburg'],
      ['Basseterre', 'Saint Kitts and Nevis', 'Basseterre'],
      ['Charlestown', 'Nevis', 'Charlestown'],
      ['The Valley', 'Anguilla', 'The Valley'],
      ['Gustavia', 'Saint Barthélemy', 'Gustavia'],
      ['Anguilla', 'British Virgin Islands', 'Road Town'],
      ['Tortola', 'British Virgin Islands', 'Road Town'],
      ['Virgin Gorda', 'British Virgin Islands', 'Virgin Gorda'],
      ['Charlotte Amalie', 'US Virgin Islands', 'Saint Croix'],
      ['Christiansted', 'US Virgin Islands', 'Saint Croix'],
      ['Road Town', 'British Virgin Islands', 'Tortola'],
      ['São Paulo', 'Brazil', 'São Paulo'],
      ['Rio de Janeiro', 'Brazil', 'Rio de Janeiro'],
      ['Salvador', 'Brazil', 'Bahia'],
      ['Brasília', 'Brazil', 'Federal District'],
      ['Fortaleza', 'Brazil', 'Ceará'],
      ['Belo Horizonte', 'Brazil', 'Minas Gerais'],
      ['Manaus', 'Brazil', 'Amazonas'],
      ['Curitiba', 'Brazil', 'Paraná'],
      ['Recife', 'Brazil', 'Pernambuco'],
      ['Porto Alegre', 'Brazil', 'Rio Grande do Sul'],
      ['Belém', 'Brazil', 'Pará'],
      ['Goiânia', 'Brazil', 'Goiás'],
      ['Guarulhos', 'Brazil', 'São Paulo'],
      ['Campinas', 'Brazil', 'São Paulo'],
      ['São Gonçalo', 'Brazil', 'Rio de Janeiro'],
      ['Maceió', 'Brazil', 'Alagoas'],
      ['Duque de Caxias', 'Brazil', 'Rio de Janeiro'],
      ['São Bernardo do Campo', 'Brazil', 'São Paulo'],
      ['Teresina', 'Brazil', 'Piauí'],
      ['Santo André', 'Brazil', 'São Paulo'],
      ['Sorocaba', 'Brazil', 'São Paulo'],
      ['João Pessoa', 'Brazil', 'Paraíba'],
      ['Osasco', 'Brazil', 'São Paulo'],
      ['Natal', 'Brazil', 'Rio Grande do Norte'],
      ['Santa Catarina', 'Brazil', 'Santa Catarina'],
      ['Aracaju', 'Brazil', 'Sergipe'],
      ['Palmas', 'Brazil', 'Tocantins'],
      ['Boa Vista', 'Brazil', 'Roraima'],
      ['Macapá', 'Brazil', 'Amapá']
    ];
    
    for (const [name, country, region] of cities) {
      await client.query(
        'INSERT INTO cities (id, name, country, region) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [uuidv4(), name, country, region]
      );
    }
    console.log('✓ 300+ cities from USA, Italy, Japan, and China inserted');
    console.log('Database initialization complete!');
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
    res.json({ token, name, message: 'Signup successful' });
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

app.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Email not found' });
    
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    
    await client.query('UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [resetToken, expiresAt, email]);
    
    res.json({ message: 'Password reset token generated', token: resetToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const result = await client.query('SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()', [resetToken]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid or expired reset token' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query('UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2', [hashedPassword, resetToken]);
    
    res.json({ message: 'Password reset successful' });
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

app.get('/cities', async (req, res) => {
  try {
    const result = await client.query('SELECT name, country, region FROM cities ORDER BY country, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/subscription', verifyToken, async (req, res) => {
  try {
    let result = await client.query('SELECT plan, booking_limit, monthly_bookings, subscription_date FROM subscriptions WHERE user_id = $1', [req.userId]);
    if (result.rows.length === 0) {
      result = { rows: [{ plan: 'free', booking_limit: 10, monthly_bookings: 0, subscription_date: new Date() }] };
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/subscription-plans', (req, res) => {
  res.json([
    { id: 'free', name: 'Free', price: 0, bookings: 10, features: ['10 bookings/month', 'Basic support', 'Email notifications'] },
    { id: 'pro', name: 'Pro', price: 9.99, bookings: 50, features: ['50 bookings/month', 'Priority support', 'Email notifications', 'Payment history'] },
    { id: 'premium', name: 'Premium', price: 29.99, bookings: 999, features: ['Unlimited bookings', '24/7 support', 'Advanced analytics', 'API access', 'Custom branding'] }
  ]);
});

app.post('/subscription/upgrade', verifyToken, async (req, res) => {
  const { plan } = req.body;
  try {
    if (!['pro', 'premium'].includes(plan)) return res.status(400).json({ error: 'Invalid plan' });
    
    const planLimits = { pro: 50, premium: 999 };
    const planPrices = { pro: 9.99, premium: 29.99 };
    
    // Get user email for receipt
    const userRes = await client.query('SELECT email FROM users WHERE id = $1', [req.userId]);
    const userEmail = userRes.rows[0]?.email;
    
    const result = await client.query('SELECT id FROM subscriptions WHERE user_id = $1', [req.userId]);
    
    if (result.rows.length === 0) {
      await client.query(
        'INSERT INTO subscriptions (id, user_id, plan, booking_limit, monthly_bookings, renewal_price, auto_renew) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [uuidv4(), req.userId, plan, planLimits[plan], 0, planPrices[plan], true]
      );
    } else {
      await client.query(
        'UPDATE subscriptions SET plan = $1, booking_limit = $2, monthly_bookings = 0, renewal_price = $3, auto_renew = $4 WHERE user_id = $5',
        [plan, planLimits[plan], planPrices[plan], true, req.userId]
      );
    }
    
    // Send upgrade confirmation email
    const emailHtml = `
      <h2>Subscription Upgraded!</h2>
      <p>Your subscription has been upgraded to <strong>${plan.toUpperCase()}</strong> plan.</p>
      <p>Price: $${planPrices[plan]}/month</p>
      <p>Bookings limit: ${planLimits[plan] === 999 ? 'Unlimited' : planLimits[plan]}/month</p>
      <p>Thank you for supporting BookHub!</p>
    `;
    await sendEmail(userEmail, `BookHub: Upgraded to ${plan} plan`, emailHtml);
    
    res.json({ message: `Upgraded to ${plan} plan!`, plan, bookingLimit: planLimits[plan] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/earnings', async (req, res) => {
  try {
    const result = await client.query('SELECT total_commission, total_bookings FROM earnings WHERE id = $1', ['00000000-0000-0000-0000-000000000000']);
    res.json(result.rows[0] || { total_commission: 0, total_bookings: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/payment-history', verifyToken, async (req, res) => {
  try {
    const result = await client.query(`
      SELECT p.id, p.booking_id, p.service_price, p.commission, p.total_paid, p.payment_status, p.created_at,
        b.city, s.name as service_name, b.booking_date
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [req.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders', verifyToken, async (req, res) => {
  try {
    const result = await client.query(`
      SELECT b.id, b.booking_date, b.booking_time, b.city, b.status, b.created_at,
        s.name as service_name, s.price,
        u.username
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 100
    `);
    const orders = result.rows.map(row => ({
      ...row,
      commission: parseFloat(row.price) * 0.20
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/bookings', verifyToken, async (req, res) => {
  const { service_id, booking_date, booking_time, address, city } = req.body;
  const id = uuidv4();
  try {
    // Get service details
    const serviceRes = await client.query('SELECT price FROM services WHERE id = $1', [service_id]);
    if (serviceRes.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    
    const servicePrice = parseFloat(serviceRes.rows[0].price);
    const commission = (servicePrice * 0.20); // 20% commission
    const totalPaid = servicePrice + commission;
    
    // Check subscription limits
    const subRes = await client.query('SELECT plan, booking_limit, monthly_bookings FROM subscriptions WHERE user_id = $1', [req.userId]);
    const sub = subRes.rows[0] || { plan: 'free', booking_limit: 10, monthly_bookings: 0 };
    
    if (sub.plan === 'free' && sub.monthly_bookings >= sub.booking_limit) {
      return res.status(403).json({ error: `Free plan limit reached (${sub.booking_limit}/month). Upgrade to Premium!` });
    }
    
    // Create booking
    await client.query('INSERT INTO bookings (id, user_id, service_id, booking_date, booking_time, address, city) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, req.userId, service_id, booking_date, booking_time, address, city]);
    
    // Record payment
    await client.query('INSERT INTO payments (id, booking_id, user_id, service_price, commission, total_paid) VALUES ($1, $2, $3, $4, $5, $6)', [uuidv4(), id, req.userId, servicePrice, commission, totalPaid]);
    
    // Update subscription monthly bookings
    if (subRes.rows.length === 0) {
      await client.query('INSERT INTO subscriptions (id, user_id, plan) VALUES ($1, $2, $3)', [uuidv4(), req.userId, 'free']);
    }
    await client.query('UPDATE subscriptions SET monthly_bookings = monthly_bookings + 1 WHERE user_id = $1', [req.userId]);
    
    // Update total earnings
    await client.query('UPDATE earnings SET total_commission = total_commission + $1, total_bookings = total_bookings + 1 WHERE id = $2', [commission, '00000000-0000-0000-0000-000000000000']);
    
    res.json({ id, message: 'Booking created', totalPaid, commission });
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

app.delete('/bookings/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('UPDATE bookings SET status = $1 WHERE id = $2 AND user_id = $3', ['cancelled', id, req.userId]);
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PayPal Payment Endpoints
app.post('/payments/paypal/create-order', verifyToken, async (req, res) => {
  const { booking_id, amount } = req.body;
  
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: 'PayPal credentials not configured' });
  }
  
  try {
    const auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString('base64');
    
    const response = await fetch('https://api.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2)
            },
            description: `Booking ID: ${booking_id}`
          }
        ]
      })
    });
    
    const data = await response.json();
    
    console.log('PayPal Order Created:', { status: response.status, orderId: data.id, error: data.message });
    
    if (response.ok && data.id) {
      res.json({ id: data.id });
    } else {
      console.error('PayPal Error:', data);
      res.status(400).json({ error: 'Failed to create PayPal order', details: data });
    }
  } catch (err) {
    console.error('PayPal Create Order Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/payments/paypal/capture-order', verifyToken, async (req, res) => {
  const { order_id, booking_id } = req.body;
  
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: 'PayPal credentials not configured' });
  }
  
  try {
    const auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString('base64');
    
    const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${order_id}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      }
    });
    
    const data = await response.json();
    
    console.log('PayPal Order Captured:', { status: response.status, orderId: order_id });
    
    if (response.ok && data.status === 'COMPLETED') {
      // Update payment status in database
      await client.query(
        'UPDATE payments SET payment_status = $1 WHERE booking_id = $2',
        ['completed', booking_id]
      );
      
      // Get booking and user details for email
      const bookingRes = await client.query(
        'SELECT b.*, s.name as service_name, s.price, u.email, u.name FROM bookings b JOIN services s ON b.service_id = s.id JOIN users u ON b.user_id = u.id WHERE b.id = $1',
        [booking_id]
      );
      
      if (bookingRes.rows.length > 0) {
        const booking = bookingRes.rows[0];
        const commission = booking.price * 0.20;
        
        // Send email receipt
        const emailHTML = `
          <h2>📧 Payment Receipt - BookHub</h2>
          <p>Hello <strong>${booking.name}</strong>,</p>
          <p>Your payment has been successfully processed!</p>
          <hr>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Service:</strong> ${booking.service_name}</li>
            <li><strong>Date:</strong> ${booking.booking_date}</li>
            <li><strong>Time:</strong> ${booking.booking_time}</li>
            <li><strong>Location:</strong> ${booking.address}, ${booking.city}</li>
            <li><strong>Service Price:</strong> $${parseFloat(booking.price).toFixed(2)}</li>
            <li><strong>Your Commission (20%):</strong> $${commission.toFixed(2)}</li>
            <li><strong>Total Paid:</strong> $${(parseFloat(booking.price) + commission).toFixed(2)}</li>
          </ul>
          <hr>
          <p><strong>Status:</strong> ✅ Payment Completed</p>
          <p>Order ID: ${booking_id}</p>
          <p>PayPal Transaction ID: ${order_id}</p>
          <hr>
          <p>Thank you for booking with BookHub!</p>
          <p>Questions? Contact us at support@bookhub.app</p>
        `;
        
        await sendEmail(booking.email, 'Payment Receipt - BookHub Booking', emailHTML);
      }
      
      res.json({ status: 'COMPLETED', message: 'Payment captured successfully' });
    } else {
      console.error('PayPal Capture Error:', data);
      res.status(400).json({ error: 'Payment capture failed', status: data.status });
    }
  } catch (err) {
    console.error('PayPal Capture Order Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/payments/paypal/config', (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID || 'test_client_id'
  });
});

// ADMIN PANEL ENDPOINTS
const ADMIN_EMAIL = 'admin@bookhub.app';
const ADMIN_PASSWORD = 'Admin@BookHub2024';

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid admin credentials' });
    
    const adminRes = await client.query('SELECT id, password_hash FROM admin_users WHERE email = $1', [email]);
    if (adminRes.rows.length === 0) return res.status(401).json({ error: 'Admin not found' });
    
    const admin = adminRes.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ adminId: admin.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, message: 'Admin logged in' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.adminId) return res.status(401).json({ error: 'Not an admin token' });
    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/admin/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await client.query('SELECT COUNT(*) FROM users');
    const totalBookings = await client.query('SELECT COUNT(*) FROM bookings');
    const totalPayments = await client.query('SELECT SUM(total_paid) as total FROM payments');
    const totalEarnings = await client.query('SELECT total_commission FROM earnings');
    
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalBookings: parseInt(totalBookings.rows[0].count),
      totalPayments: parseFloat(totalPayments.rows[0]?.total || 0),
      totalEarnings: parseFloat(totalEarnings.rows[0]?.total_commission || 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/users', verifyAdmin, async (req, res) => {
  try {
    const result = await client.query('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/bookings', verifyAdmin, async (req, res) => {
  try {
    const result = await client.query(`
      SELECT b.id, b.user_id, b.booking_date, b.status, b.address, b.city,
        s.name as service_name, s.price,
        u.name as user_name, u.email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/payments', verifyAdmin, async (req, res) => {
  try {
    const result = await client.query(`
      SELECT p.id, p.service_price, p.commission, p.total_paid, p.payment_status, p.created_at,
        b.city, s.name as service_name,
        u.name as user_name, u.email
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/subscriptions', verifyAdmin, async (req, res) => {
  try {
    const result = await client.query(`
      SELECT s.id, s.user_id, s.plan, s.booking_limit, s.monthly_bookings, s.renewal_price, s.auto_renew, s.subscription_date,
        u.name, u.email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.subscription_date DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/admin/bookings/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await client.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/admin.html'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  initDB();
});

client.on('error', (err) => console.error('Database error:', err));
