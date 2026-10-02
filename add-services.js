const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DYNO ? { rejectUnauthorized: false } : false
});

const newServices = [
  // Japan Services
  { name: 'Sushi Making Class', desc: 'Learn authentic sushi preparation', cat: 'food', dur: 120, price: 75, country: 'Japan', city: 'Tokyo' },
  { name: 'Tea Ceremony', desc: 'Traditional Japanese tea ceremony', cat: 'cultural', dur: 90, price: 60, country: 'Japan', city: 'Kyoto' },
  { name: 'Karate Lessons', desc: 'Traditional karate training', cat: 'fitness', dur: 60, price: 50, country: 'Japan', city: 'Tokyo' },
  
  // France Services
  { name: 'French Cooking Class', desc: 'Learn French cuisine techniques', cat: 'food', dur: 180, price: 120, country: 'France', city: 'Paris' },
  { name: 'Wine Tasting', desc: 'French wine tasting experience', cat: 'beverage', dur: 120, price: 80, country: 'France', city: 'Bordeaux' },
  { name: 'Ballet Lessons', desc: 'Classical ballet instruction', cat: 'dance', dur: 60, price: 55, country: 'France', city: 'Paris' },
  
  // Germany Services
  { name: 'Oktoberfest Tour', desc: 'Munich Oktoberfest experience', cat: 'tour', dur: 240, price: 100, country: 'Germany', city: 'Munich' },
  { name: 'Beer Brewery Tour', desc: 'German brewery tour and tasting', cat: 'tour', dur: 180, price: 75, country: 'Germany', city: 'Munich' },
  { name: 'Lederhosen Fitting', desc: 'Traditional Bavarian outfit', cat: 'fashion', dur: 45, price: 40, country: 'Germany', city: 'Munich' },
  
  // Spain Services
  { name: 'Flamenco Dancing', desc: 'Learn traditional flamenco', cat: 'dance', dur: 90, price: 65, country: 'Spain', city: 'Madrid' },
  { name: 'Paella Cooking Class', desc: 'Learn to cook authentic paella', cat: 'food', dur: 120, price: 85, country: 'Spain', city: 'Barcelona' },
  { name: 'Flamenco Show', desc: 'Professional flamenco performance', cat: 'entertainment', dur: 120, price: 95, country: 'Spain', city: 'Seville' },
  
  // UK Services
  { name: 'Afternoon Tea', desc: 'Traditional British afternoon tea', cat: 'food', dur: 90, price: 70, country: 'United Kingdom', city: 'London' },
  { name: 'Royal Palace Tour', desc: 'Guided tour of royal palaces', cat: 'tour', dur: 180, price: 85, country: 'United Kingdom', city: 'London' },
  { name: 'Fish & Chips Making', desc: 'Learn to make British fish and chips', cat: 'food', dur: 60, price: 45, country: 'United Kingdom', city: 'London' },
  
  // Canada Services
  { name: 'Niagara Falls Tour', desc: 'Guided Niagara Falls tour', cat: 'tour', dur: 240, price: 120, country: 'Canada', city: 'Toronto' },
  { name: 'Ice Hockey Training', desc: 'Canadian ice hockey lessons', cat: 'sports', dur: 90, price: 70, country: 'Canada', city: 'Vancouver' },
  { name: 'Maple Syrup Farm Visit', desc: 'Visit and taste maple syrup', cat: 'tour', dur: 120, price: 65, country: 'Canada', city: 'Montreal' },
  
  // Australia Services
  { name: 'Surfing Lessons', desc: 'Learn to surf on Australian beaches', cat: 'sports', dur: 120, price: 80, country: 'Australia', city: 'Sydney' },
  { name: 'Aboriginal Art Workshop', desc: 'Learn aboriginal art painting', cat: 'art', dur: 90, price: 60, country: 'Australia', city: 'Melbourne' },
  { name: 'Didgeridoo Lessons', desc: 'Learn traditional didgeridoo', cat: 'music', dur: 60, price: 50, country: 'Australia', city: 'Sydney' },
  
  // Mexico Services
  { name: 'Tequila Tasting', desc: 'Mexican tequila tasting tour', cat: 'beverage', dur: 120, price: 75, country: 'Mexico', city: 'Mexico City' },
  { name: 'Salsa Dancing', desc: 'Learn traditional salsa dancing', cat: 'dance', dur: 90, price: 55, country: 'Mexico', city: 'Cancun' },
  { name: 'Tacos & Guacamole Making', desc: 'Learn Mexican cooking', cat: 'food', dur: 120, price: 70, country: 'Mexico', city: 'Mexico City' },
  
  // India Services
  { name: 'Yoga & Meditation', desc: 'Traditional yoga and meditation', cat: 'wellness', dur: 90, price: 40, country: 'India', city: 'New Delhi' },
  { name: 'Indian Cooking Class', desc: 'Learn authentic Indian cuisine', cat: 'food', dur: 120, price: 65, country: 'India', city: 'Mumbai' },
  { name: 'Taj Mahal Tour', desc: 'Guided Taj Mahal tour', cat: 'tour', dur: 180, price: 85, country: 'India', city: 'Agra' },
  
  // Thailand Services
  { name: 'Thai Massage Training', desc: 'Learn traditional Thai massage', cat: 'wellness', dur: 120, price: 60, country: 'Thailand', city: 'Bangkok' },
  { name: 'Thai Cooking Class', desc: 'Learn Thai cuisine', cat: 'food', dur: 120, price: 70, country: 'Thailand', city: 'Phuket' },
  { name: 'Muay Thai Boxing', desc: 'Learn Thai boxing', cat: 'sports', dur: 90, price: 55, country: 'Thailand', city: 'Bangkok' },
  
  // Brazil Services
  { name: 'Samba Dancing', desc: 'Learn Brazilian samba dancing', cat: 'dance', dur: 90, price: 60, country: 'Brazil', city: 'Rio de Janeiro' },
  { name: 'Capoeira Training', desc: 'Learn Brazilian capoeira', cat: 'sports', dur: 90, price: 65, country: 'Brazil', city: 'Salvador' },
  { name: 'Brazilian Jiu-Jitsu', desc: 'Learn Brazilian Jiu-Jitsu', cat: 'sports', dur: 90, price: 70, country: 'Brazil', city: 'Sao Paulo' },
  
  // USA Additional Services
  { name: 'New York Food Tour', desc: 'NYC street food tour', cat: 'tour', dur: 180, price: 90, country: 'USA', city: 'New York' },
  { name: 'Las Vegas Show Tickets', desc: 'Premium Vegas show tickets', cat: 'entertainment', dur: 180, price: 150, country: 'USA', city: 'Las Vegas' },
  { name: 'Grand Canyon Tour', desc: 'Guided Grand Canyon helicopter tour', cat: 'tour', dur: 240, price: 250, country: 'USA', city: 'Phoenix' },
  
  // Italy Additional Services
  { name: 'Gelato Making Class', desc: 'Learn to make Italian gelato', cat: 'food', dur: 120, price: 75, country: 'Italy', city: 'Rome' },
  { name: 'Venetian Mask Making', desc: 'Create traditional Venetian masks', cat: 'art', dur: 90, price: 65, country: 'Italy', city: 'Venice' },
  { name: 'Italian Fashion Workshop', desc: 'Learn Italian fashion design', cat: 'fashion', dur: 120, price: 80, country: 'Italy', city: 'Milan' }
];

async function addServices() {
  try {
    await client.connect();
    let added = 0;
    
    for (const service of newServices) {
      await client.query(
        `INSERT INTO services (id, name, description, category, duration_minutes, price, country, city)
       SELECT $1, $2, $3, $4, $5, $6, $7, $8
       WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = $2 AND country = $7 AND city = $8)`,
        [uuidv4(), service.name, service.desc, service.cat, service.dur, service.price, service.country, service.city]
      );
      added++;
    }
    
    console.log(`✓ Added ${added} new services and countries!`);
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

addServices();
