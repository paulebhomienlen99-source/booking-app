const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DYNO ? { rejectUnauthorized: false } : false });
const locations = {
  Argentina: ['Buenos Aires', 'Cordoba', 'Mendoza', 'Rosario'],
  Austria: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz'],
  Belgium: ['Brussels', 'Antwerp', 'Bruges', 'Ghent'],
  Chile: ['Santiago', 'Valparaiso', 'Concepcion', 'Puerto Montt'],
  China: ['Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Chengdu'],
  Colombia: ['Bogota', 'Medellin', 'Cartagena', 'Cali'],
  Croatia: ['Zagreb', 'Split', 'Dubrovnik', 'Zadar'],
  Czechia: ['Prague', 'Brno', 'Ostrava', 'Cesky Krumlov'],
  Denmark: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'],
  Egypt: ['Cairo', 'Alexandria', 'Giza', 'Luxor'],
  Greece: ['Athens', 'Thessaloniki', 'Heraklion', 'Rhodes'],
  Indonesia: ['Jakarta', 'Bali', 'Bandung', 'Surabaya'],
  Ireland: ['Dublin', 'Cork', 'Galway', 'Limerick'],
  Israel: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Eilat'],
  Malaysia: ['Kuala Lumpur', 'George Town', 'Malacca', 'Johor Bahru'],
  Morocco: ['Marrakesh', 'Casablanca', 'Rabat', 'Fes'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  'New Zealand': ['Auckland', 'Wellington', 'Queenstown', 'Christchurch'],
  Norway: ['Oslo', 'Bergen', 'Tromso', 'Trondheim'],
  Philippines: ['Manila', 'Cebu City', 'Davao City', 'Boracay'],
  Poland: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina'],
  Singapore: ['Singapore'],
  SouthAfrica: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'],
  SouthKorea: ['Seoul', 'Busan', 'Jeju City', 'Incheon'],
  Sweden: ['Stockholm', 'Gothenburg', 'Malmo', 'Uppsala'],
  Switzerland: ['Zurich', 'Geneva', 'Lucerne', 'Interlaken'],
  Taiwan: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan'],
  Turkey: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
  Vietnam: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An']
};
(async () => {
  await client.connect();
  let added = 0;
  for (const [countryKey, cities] of Object.entries(locations)) {
    const country = countryKey === 'SouthAfrica' ? 'South Africa' : countryKey === 'SouthKorea' ? 'South Korea' : countryKey;
    for (const name of cities) {
      const result = await client.query('INSERT INTO cities (id, name, country) VALUES ($1,$2,$3) ON CONFLICT (name) DO NOTHING', [uuidv4(), name, country]);
      added += result.rowCount;
    }
  }
  console.log(`Added ${added} city records across ${Object.keys(locations).length} countries`);
  await client.end();
})().catch(err => { console.error(err.message); process.exit(1); });
