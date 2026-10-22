-- Additional BookHub cities and matching services.
-- Safe to run repeatedly: existing city/service records are preserved.

INSERT INTO cities (id, name, country, region)
VALUES
  (gen_random_uuid(), 'Toronto', 'Canada', 'Ontario'),
  (gen_random_uuid(), 'Vancouver', 'Canada', 'British Columbia'),
  (gen_random_uuid(), 'Montreal', 'Canada', 'Quebec'),
  (gen_random_uuid(), 'Sydney', 'Australia', 'New South Wales'),
  (gen_random_uuid(), 'Melbourne', 'Australia', 'Victoria'),
  (gen_random_uuid(), 'Brisbane', 'Australia', 'Queensland'),
  (gen_random_uuid(), 'Dubai', 'United Arab Emirates', 'Dubai'),
  (gen_random_uuid(), 'Abu Dhabi', 'United Arab Emirates', 'Abu Dhabi'),
  (gen_random_uuid(), 'Sharjah', 'United Arab Emirates', 'Sharjah'),
  (gen_random_uuid(), 'Lisbon', 'Portugal', 'Lisbon'),
  (gen_random_uuid(), 'Porto', 'Portugal', 'Porto'),
  (gen_random_uuid(), 'Faro', 'Portugal', 'Algarve'),
  (gen_random_uuid(), 'Mumbai', 'India', 'Maharashtra'),
  (gen_random_uuid(), 'New Delhi', 'India', 'Delhi'),
  (gen_random_uuid(), 'Bengaluru', 'India', 'Karnataka'),
  (gen_random_uuid(), 'Mexico City', 'Mexico', 'Mexico City'),
  (gen_random_uuid(), 'Guadalajara', 'Mexico', 'Jalisco'),
  (gen_random_uuid(), 'Cancun', 'Mexico', 'Quintana Roo'),
  (gen_random_uuid(), 'Rio de Janeiro', 'Brazil', 'Rio de Janeiro'),
  (gen_random_uuid(), 'Sao Paulo', 'Brazil', 'Sao Paulo'),
  (gen_random_uuid(), 'Manaus', 'Brazil', 'Amazonas'),
  (gen_random_uuid(), 'Brasilia', 'Brazil', 'Federal District')
ON CONFLICT (name) DO NOTHING;

WITH catalog(name, description, category, duration_minutes, price, country, city) AS (VALUES
  ('Airport Transfer', 'Private airport pickup with luggage assistance', 'transport', 60, 55.00, 'Canada', 'Toronto'),
  ('Deep Home Cleaning', 'Detailed apartment and home cleaning', 'cleaning', 180, 95.00, 'Canada', 'Vancouver'),
  ('Personal Training Session', 'One-on-one strength and conditioning session', 'fitness', 60, 75.00, 'Canada', 'Montreal'),
  ('Surf Lesson', 'Beginner surf lesson with board included', 'fitness', 90, 90.00, 'Australia', 'Sydney'),
  ('Furniture Assembly', 'Professional flat-pack furniture assembly', 'repairs', 120, 70.00, 'Australia', 'Melbourne'),
  ('Dog Walking', 'Local dog walking and exercise service', 'pets', 45, 32.00, 'Australia', 'Brisbane'),
  ('Desert Safari', 'Guided desert drive with cultural activities', 'tour', 300, 120.00, 'United Arab Emirates', 'Dubai'),
  ('Luxury Car With Driver', 'Private city transfer with professional driver', 'transport', 120, 150.00, 'United Arab Emirates', 'Abu Dhabi'),
  ('Apartment Deep Cleaning', 'Premium residential deep cleaning service', 'cleaning', 180, 90.00, 'United Arab Emirates', 'Sharjah'),
  ('Lisbon Walking Tour', 'Small-group historic city walking tour', 'tour', 150, 45.00, 'Portugal', 'Lisbon'),
  ('Port Wine Tasting', 'Guided tasting of regional Portuguese wines', 'food', 90, 70.00, 'Portugal', 'Porto'),
  ('Surf Coaching', 'Private beginner surf coaching session', 'fitness', 120, 80.00, 'Portugal', 'Faro'),
  ('Indian Cooking Class', 'Learn regional Indian dishes and spices', 'food', 150, 55.00, 'India', 'Mumbai'),
  ('Yoga and Meditation Session', 'Private guided yoga and meditation', 'wellness', 90, 30.00, 'India', 'New Delhi'),
  ('IT Support Home Visit', 'On-site computer and network troubleshooting', 'tech', 120, 45.00, 'India', 'Bengaluru'),
  ('Street Taco Food Tour', 'Guided tasting tour of local taco spots', 'food', 180, 60.00, 'Mexico', 'Mexico City'),
  ('Spanish Language Lesson', 'Private conversational Spanish lesson', 'education', 60, 28.00, 'Mexico', 'Guadalajara'),
  ('Scuba Diving Introduction', 'Beginner pool and ocean diving experience', 'fitness', 180, 110.00, 'Mexico', 'Cancun'),
  ('Samba Dancing', 'Learn Brazilian samba dancing', 'dance', 90, 60.00, 'Brazil', 'Rio de Janeiro'),
  ('Portuguese Conversation Lesson', 'Private practical Portuguese tutoring', 'education', 60, 35.00, 'Brazil', 'Sao Paulo'),
  ('Amazon Food Tour', 'Guided local food and market experience', 'food', 180, 65.00, 'Brazil', 'Manaus'),
  ('Apartment Cleaning', 'Reliable residential cleaning service', 'cleaning', 120, 38.00, 'Brazil', 'Brasilia')
)
INSERT INTO services (id, name, description, category, duration_minutes, price, country, city)
SELECT gen_random_uuid(), c.name, c.description, c.category, c.duration_minutes, c.price, c.country, c.city
FROM catalog c
WHERE NOT EXISTS (
  SELECT 1 FROM services s
  WHERE s.name = c.name AND s.country = c.country AND s.city = c.city
);
