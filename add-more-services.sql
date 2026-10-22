WITH catalog(name, description, category, duration_minutes, price, country, city) AS (VALUES
('Airport Transfer','Private airport pickup with luggage assistance','transport',60,55.00,'Canada','Toronto'),
('Deep Home Cleaning','Detailed apartment and home cleaning','cleaning',180,95.00,'Canada','Vancouver'),
('Personal Training Session','One-on-one strength and conditioning session','fitness',60,75.00,'Canada','Montreal'),
('Maple Cooking Workshop','Hands-on Canadian cooking experience','food',120,85.00,'Canada','Quebec City'),
('Surf Lesson','Beginner surf lesson with board included','fitness',90,90.00,'Australia','Sydney'),
('Great Barrier Reef Snorkel Tour','Guided reef snorkeling experience','tour',240,145.00,'Australia','Cairns'),
('Flat-Pack Furniture Assembly','Professional furniture assembly service','repairs',120,70.00,'Australia','Melbourne'),
('Dog Walking - 45 min','Local dog walking and exercise service','pets',45,32.00,'Australia','Brisbane'),
('Capoeira Class','Group introduction to Brazilian capoeira','fitness',90,45.00,'Brazil','Rio de Janeiro'),
('Portuguese Conversation Lesson','Private practical Portuguese tutoring','education',60,35.00,'Brazil','Sao Paulo'),
('Amazon Food Tour','Guided local food and market experience','food',180,65.00,'Brazil','Manaus'),
('Apartment Cleaning','Reliable residential cleaning service','cleaning',120,38.00,'Brazil','Brasilia'),
('Taj Mahal Guided Tour','Licensed local guide and monument tour','tour',180,40.00,'India','Agra'),
('Indian Cooking Class','Learn regional Indian dishes and spices','food',150,55.00,'India','Mumbai'),
('Yoga and Meditation Session','Private guided yoga and meditation','wellness',90,30.00,'India','New Delhi'),
('IT Support Home Visit','On-site computer and network troubleshooting','tech',120,45.00,'India','Bengaluru'),
('Street Taco Food Tour','Guided tasting tour of local taco spots','food',180,60.00,'Mexico','Mexico City'),
('Spanish Language Lesson','Private conversational Spanish lesson','education',60,28.00,'Mexico','Guadalajara'),
('Scuba Diving Introduction','Beginner pool and ocean diving experience','fitness',180,110.00,'Mexico','Cancun'),
('Home Repair Visit','General handyman repairs and maintenance','repairs',120,50.00,'Mexico','Monterrey'),
('Lisbon Walking Tour','Small-group historic city walking tour','tour',150,45.00,'Portugal','Lisbon'),
('Port Wine Tasting','Guided tasting of regional Portuguese wines','food',90,70.00,'Portugal','Porto'),
('Surf Coaching','Private beginner surf coaching session','fitness',120,80.00,'Portugal','Faro'),
('Apartment Move-Out Cleaning','End-of-lease apartment cleaning','cleaning',180,75.00,'Portugal','Lisbon'),
('Desert Safari','Guided desert drive with cultural activities','tour',300,120.00,'United Arab Emirates','Dubai'),
('Luxury Car With Driver','Private city transfer with professional driver','transport',120,150.00,'United Arab Emirates','Abu Dhabi'),
('Arabic Cooking Class','Hands-on traditional Arabic cuisine class','food',150,95.00,'United Arab Emirates','Dubai'),
('Apartment Deep Cleaning','Premium residential deep cleaning service','cleaning',180,90.00,'United Arab Emirates','Sharjah'))
INSERT INTO services (id,name,description,category,duration_minutes,price,country,city)
SELECT gen_random_uuid(), c.name, c.description, c.category, c.duration_minutes,
       c.price, c.country, c.city
FROM catalog c
WHERE NOT EXISTS (
  SELECT 1
  FROM services s
  WHERE s.name = c.name
    AND s.country = c.country
    AND s.city = c.city
);
