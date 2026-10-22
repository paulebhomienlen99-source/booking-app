CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT
);

CREATE TABLE providers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  approved BOOLEAN DEFAULT false,
  document_uploaded BOOLEAN DEFAULT false
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id),
  title TEXT,
  price INTEGER,
  approved BOOLEAN DEFAULT false
);

CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES providers(id),
  date TEXT,
  time TEXT
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES users(id),
  service_id INTEGER REFERENCES services(id),
  date TEXT,
  time TEXT
);


