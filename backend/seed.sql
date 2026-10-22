-- RESET
TRUNCATE bookings, slots, services, providers, users RESTART IDENTITY CASCADE;

---------------------------------------------------------
-- USERS BASE (admin + 10 provider + 50 customer)
---------------------------------------------------------

INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', 'admin123', 'admin');

DO $$
DECLARE
  i INT;
BEGIN
  -- 10 provider
  FOR i IN 1..10 LOOP
    INSERT INTO users (name, email, password, role)
    VALUES (
      'Provider ' || i,
      'provider' || i || '@example.com',
      'provider123',
      'provider'
    );
  END LOOP;

  -- 50 customer
  FOR i IN 1..50 LOOP
    INSERT INTO users (name, email, password, role)
    VALUES (
      'Customer ' || i,
      'customer' || i || '@example.com',
      'customer123',
      'customer'
    );
  END LOOP;
END $$;

---------------------------------------------------------
-- PROVIDERS PROFILE (auto per i 10 provider)
---------------------------------------------------------

DO $$
DECLARE
  uid INT;
BEGIN
  FOR uid IN 2..11 LOOP
    INSERT INTO providers (user_id, approved, document_uploaded)
    VALUES (uid, true, true);
  END LOOP;
END $$;

---------------------------------------------------------
-- SERVICES AUTO (10 provider × 10 servizi = 100 servizi)
---------------------------------------------------------

DO $$
DECLARE
  p INT;
  s INT;
BEGIN
  FOR p IN 1..10 LOOP
    FOR s IN 1..10 LOOP
      INSERT INTO services (provider_id, title, price, approved)
      VALUES (
        p,
        'Service ' || p || '-' || s,
        10 + (p * 5) + s,
        true
      );
    END LOOP;
  END LOOP;
END $$;

---------------------------------------------------------
-- SLOTS AUTO (10 provider × 30 slot = 300 slot)
---------------------------------------------------------

DO $$
DECLARE
  p INT;
  i INT;
  base_date DATE := '2026-10-12';
BEGIN
  FOR p IN 1..10 LOOP
    FOR i IN 0..29 LOOP
      INSERT INTO slots (provider_id, date, time)
      VALUES (
        p,
        base_date + (i / 5),
        LPAD((9 + (i % 10))::text, 2, '0') || ':00'
      );
    END LOOP;
  END LOOP;
END $$;

---------------------------------------------------------
-- BOOKINGS AUTO (500 prenotazioni random)
---------------------------------------------------------

DO $$
DECLARE
  i INT;
  cust_id INT;
  serv_id INT;
  slot_id INT;
BEGIN
  FOR i IN 1..500 LOOP
    cust_id := (SELECT FLOOR(RANDOM() * 50) + 12);   -- customers 12..61
    serv_id := (SELECT FLOOR(RANDOM() * 100) + 1);   -- services 1..100
    slot_id := (SELECT FLOOR(RANDOM() * 300) + 1);   -- slots 1..300;

    INSERT INTO bookings (customer_id, service_id, date, time)
    SELECT cust_id, serv_id, slots.date, slots.time
    FROM slots
    WHERE slots.id = slot_id;
  END LOOP;
END $$;



