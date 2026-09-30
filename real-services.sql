-- REAL MARKETPLACE SERVICES FOR BOOKHUB
-- Organized by category with realistic pricing

DELETE FROM bookings CASCADE;
DELETE FROM payments CASCADE;
DELETE FROM services CASCADE;

INSERT INTO services (id, name, description, category, duration_minutes, price, country, city) VALUES

-- HOME CLEANING & MAINTENANCE (Most popular category)
('10001-0000-0000-0000-000000000000', 'Home Cleaning - 2 Hours', 'Professional house cleaning service', 'cleaning', 120, 45.00, 'USA', 'New York'),
('10002-0000-0000-0000-000000000000', 'Deep Cleaning - 3 Hours', 'Deep clean entire apartment', 'cleaning', 180, 65.00, 'USA', 'New York'),
('10003-0000-0000-0000-000000000000', 'Move-In/Out Cleaning', 'Complete apartment cleaning after move', 'cleaning', 240, 85.00, 'USA', 'Los Angeles'),
('10004-0000-0000-0000-000000000000', 'Kitchen Deep Clean', 'Professional kitchen cleaning', 'cleaning', 90, 40.00, 'USA', 'Chicago'),
('10005-0000-0000-0000-000000000000', 'Bathroom Cleaning', 'Complete bathroom sanitation', 'cleaning', 60, 35.00, 'USA', 'Houston'),

-- HANDYMAN & REPAIRS
('20001-0000-0000-0000-000000000000', 'Plumbing Repair', 'Fix leaks, unclog drains', 'repairs', 120, 75.00, 'USA', 'New York'),
('20002-0000-0000-0000-000000000000', 'Electrical Repair', 'Fix outlets, switches, wiring', 'repairs', 120, 85.00, 'USA', 'Los Angeles'),
('20003-0000-0000-0000-000000000000', 'Door/Lock Installation', 'Install new doors or locks', 'repairs', 90, 55.00, 'USA', 'Chicago'),
('20004-0000-0000-0000-000000000000', 'Drywall Repair', 'Fix holes and patch drywall', 'repairs', 120, 65.00, 'USA', 'Houston'),
('20005-0000-0000-0000-000000000000', 'Appliance Repair', 'Fix washer, dryer, dishwasher', 'repairs', 120, 95.00, 'USA', 'Phoenix'),

-- MOVING & DELIVERY
('30001-0000-0000-0000-000000000000', 'Moving Help - 2 Hours', 'Help loading/unloading truck', 'moving', 120, 50.00, 'USA', 'New York'),
('30002-0000-0000-0000-000000000000', 'Furniture Delivery', 'Deliver and assemble furniture', 'moving', 120, 60.00, 'USA', 'Los Angeles'),
('30003-0000-0000-0000-000000000000', 'Junk Removal', 'Remove and haul away junk', 'moving', 180, 80.00, 'USA', 'Chicago'),
('30004-0000-0000-0000-000000000000', 'Piano Moving', 'Specialized piano moving service', 'moving', 240, 150.00, 'USA', 'Houston'),

-- PERSONAL SERVICES
('40001-0000-0000-0000-000000000000', 'Haircut & Styling', 'Professional haircut', 'beauty', 45, 30.00, 'USA', 'New York'),
('40002-0000-0000-0000-000000000000', 'Full Body Massage', 'Relaxing therapeutic massage', 'wellness', 60, 80.00, 'USA', 'Los Angeles'),
('40003-0000-0000-0000-000000000000', 'Manicure & Pedicure', 'Professional nail care', 'beauty', 90, 45.00, 'USA', 'Chicago'),
('40004-0000-0000-0000-000000000000', 'Haircut for Kids', 'Kids haircut service', 'beauty', 30, 20.00, 'USA', 'Houston'),
('40005-0000-0000-0000-000000000000', 'Waxing Service', 'Hair removal waxing', 'beauty', 45, 35.00, 'USA', 'Phoenix'),

-- PET SERVICES
('50001-0000-0000-0000-000000000000', 'Dog Walking - 30 min', 'Walk your dog', 'pets', 30, 20.00, 'USA', 'New York'),
('50002-0000-0000-0000-000000000000', 'Dog Grooming', 'Full dog grooming service', 'pets', 120, 60.00, 'USA', 'Los Angeles'),
('50003-0000-0000-0000-000000000000', 'Pet Sitting - 1 Hour', 'Watch your pet while away', 'pets', 60, 25.00, 'USA', 'Chicago'),
('50004-0000-0000-0000-000000000000', 'Dog Training Session', 'One-on-one dog training', 'pets', 60, 55.00, 'USA', 'Houston'),
('50005-0000-0000-0000-000000000000', 'Pet Boarding - Per Night', 'Overnight pet care', 'pets', 1440, 45.00, 'USA', 'Phoenix'),

-- TUTORING & EDUCATION
('60001-0000-0000-0000-000000000000', 'Math Tutoring - 1 Hour', 'One-on-one math lessons', 'education', 60, 40.00, 'USA', 'New York'),
('60002-0000-0000-0000-000000000000', 'English Tutoring - 1 Hour', 'ESL or writing lessons', 'education', 60, 38.00, 'USA', 'Los Angeles'),
('60003-0000-0000-0000-000000000000', 'Programming Lesson', 'Learn coding basics', 'education', 60, 55.00, 'USA', 'Chicago'),
('60004-0000-0000-0000-000000000000', 'SAT Prep - 2 Hours', 'College entrance exam prep', 'education', 120, 70.00, 'USA', 'Houston'),
('60005-0000-0000-0000-000000000000', 'Music Lessons - Piano', 'One-on-one piano instruction', 'education', 60, 50.00, 'USA', 'Phoenix'),

-- FITNESS & WELLNESS
('70001-0000-0000-0000-000000000000', 'Personal Training Session', '1-on-1 fitness training', 'fitness', 60, 65.00, 'USA', 'New York'),
('70002-0000-0000-0000-000000000000', 'Yoga Class', 'Group or private yoga', 'fitness', 60, 30.00, 'USA', 'Los Angeles'),
('70003-0000-0000-0000-000000000000', 'HIIT Training', 'High-intensity interval training', 'fitness', 45, 50.00, 'USA', 'Chicago'),
('70004-0000-0000-0000-000000000000', 'Pilates Class', 'Core strengthening class', 'fitness', 60, 35.00, 'USA', 'Houston'),
('70005-0000-0000-0000-000000000000', 'Boxing Training', 'One-on-one boxing lessons', 'fitness', 60, 60.00, 'USA', 'Phoenix'),

-- PHOTOGRAPHY
('80001-0000-0000-0000-000000000000', 'Professional Photo Shoot - 1 Hour', 'Portrait or event photography', 'photography', 60, 120.00, 'USA', 'New York'),
('80002-0000-0000-0000-000000000000', 'Photo Editing Service', 'Edit and enhance your photos', 'photography', 120, 50.00, 'USA', 'Los Angeles'),
('80003-0000-0000-0000-000000000000', 'Headshot Photography', 'Professional headshots', 'photography', 60, 100.00, 'USA', 'Chicago'),
('80004-0000-0000-0000-000000000000', 'Family Photo Session - 2 Hours', 'Family portrait session', 'photography', 120, 150.00, 'USA', 'Houston'),

-- TECH & SERVICES
('90001-0000-0000-0000-000000000000', 'Computer Repair', 'Fix slow/broken computers', 'tech', 120, 70.00, 'USA', 'New York'),
('90002-0000-0000-0000-000000000000', 'Website Design', 'Custom website creation', 'tech', 480, 250.00, 'USA', 'Los Angeles'),
('90003-0000-0000-0000-000000000000', 'Social Media Management - Monthly', 'Manage business social media', 'tech', 2880, 200.00, 'USA', 'Chicago'),
('90004-0000-0000-0000-000000000000', 'Logo Design', 'Custom business logo', 'tech', 240, 100.00, 'USA', 'Houston'),
('90005-0000-0000-0000-000000000000', 'Video Editing - Per Hour', 'Professional video editing', 'tech', 60, 80.00, 'USA', 'Phoenix'),

-- ITALY SERVICES
('it001-0000-0000-0000-000000000000', 'Home Cleaning - Roma', 'Professional cleaning in Rome', 'cleaning', 120, 35.00, 'Italy', 'Rome'),
('it002-0000-0000-0000-000000000000', 'Cooking Class - Pasta Making', 'Learn traditional Italian pasta', 'food', 120, 70.00, 'Italy', 'Bologna'),
('it003-0000-0000-0000-000000000000', 'Wine Tasting Tour', 'Tuscan wine experience', 'tour', 180, 90.00, 'Italy', 'Florence'),
('it004-0000-0000-0000-000000000000', 'Plumbing Service - Milano', 'Emergency plumbing repair', 'repairs', 120, 65.00, 'Italy', 'Milan'),
('it005-0000-0000-0000-000000000000', 'Massage Therapy - Venezia', 'Relaxing massage in Venice', 'wellness', 60, 70.00, 'Italy', 'Venice'),

-- FRANCE SERVICES
('fr001-0000-0000-0000-000000000000', 'French Cooking Class', 'Learn French cuisine', 'food', 150, 100.00, 'France', 'Paris'),
('fr002-0000-0000-0000-000000000000', 'Seine River Tour', 'Guided Paris boat tour', 'tour', 120, 50.00, 'France', 'Paris'),
('fr003-0000-0000-0000-000000000000', 'Wine Sommelier Session', 'Wine pairing experience', 'food', 90, 110.00, 'France', 'Bordeaux'),
('fr004-0000-0000-0000-000000000000', 'Home Cleaning - Paris', 'Professional apartment cleaning', 'cleaning', 120, 50.00, 'France', 'Paris'),

-- SPAIN SERVICES
('es001-0000-0000-0000-000000000000', 'Flamenco Dancing Lessons', 'Traditional Spanish dance', 'dance', 90, 60.00, 'Spain', 'Madrid'),
('es002-0000-0000-0000-000000000000', 'Spanish Guitar Lessons', 'Guitar instruction', 'music', 60, 50.00, 'Spain', 'Barcelona'),
('es003-0000-0000-0000-000000000000', 'Paella Cooking Class', 'Learn traditional paella', 'food', 120, 75.00, 'Spain', 'Valencia'),
('es004-0000-0000-0000-000000000000', 'Home Cleaning - Barcelona', 'Professional cleaning', 'cleaning', 120, 40.00, 'Spain', 'Barcelona'),

-- JAPAN SERVICES
('jp001-0000-0000-0000-000000000000', 'Sushi Making Class', 'Learn authentic sushi prep', 'food', 120, 85.00, 'Japan', 'Tokyo'),
('jp002-0000-0000-0000-000000000000', 'Tea Ceremony Experience', 'Traditional Japanese tea', 'culture', 90, 60.00, 'Japan', 'Kyoto'),
('jp003-0000-0000-0000-000000000000', 'Karate Training', 'Martial arts instruction', 'fitness', 60, 50.00, 'Japan', 'Tokyo'),
('jp004-0000-0000-0000-000000000000', 'Home Cleaning - Tokyo', 'Professional apartment cleaning', 'cleaning', 120, 45.00, 'Japan', 'Tokyo');
