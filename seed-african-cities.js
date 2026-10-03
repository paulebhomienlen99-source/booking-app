const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.DYNO ? { rejectUnauthorized: false } : false });
const locations = {
  Algeria: ['Algiers', 'Oran', 'Constantine', 'Annaba'],
  Angola: ['Luanda', 'Huambo', 'Lobito', 'Benguela'],
  Benin: ['Porto-Novo', 'Cotonou', 'Abomey-Calavi', 'Parakou'],
  Botswana: ['Gaborone', 'Francistown', 'Maun', 'Kasane'],
  BurkinaFaso: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora'],
  Cameroon: ['Yaounde', 'Douala', 'Bamenda', 'Limbe'],
  CapeVerde: ['Praia', 'Mindelo', 'Santa Maria', 'Espargos'],
  Chad: ['N Djamena', 'Moundou', 'Sarh', 'Abéché'],
  Comoros: ['Moroni', 'Mutsamudu', 'Fomboni'],
  Congo: ['Brazzaville', 'Pointe-Noire', 'Dolisie'],
  DRC: ['Kinshasa', 'Lubumbashi', 'Goma', 'Kisangani'],
  Djibouti: ['Djibouti City', 'Ali Sabieh', 'Tadjoura'],
  Eswatini: ['Mbabane', 'Manzini', 'Lobamba'],
  Ethiopia: ['Addis Ababa', 'Dire Dawa', 'Gondar', 'Bahir Dar'],
  Gabon: ['Libreville', 'Port-Gentil', 'Franceville'],
  Gambia: ['Banjul', 'Serekunda', 'Brikama'],
  Ghana: ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  Guinea: ['Conakry', 'Nzerekore', 'Kankan'],
  IvoryCoast: ['Abidjan', 'Yamoussoukro', 'Bouake', 'San-Pedro'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
  Lesotho: ['Maseru', 'Teyateyaneng', 'Mafeteng'],
  Liberia: ['Monrovia', 'Gbarnga', 'Buchanan'],
  Libya: ['Tripoli', 'Benghazi', 'Misrata', 'Sabha'],
  Madagascar: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa'],
  Malawi: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'],
  Mali: ['Bamako', 'Sikasso', 'Mopti', 'Segou'],
  Mauritania: ['Nouakchott', 'Nouadhibou', 'Rosso'],
  Mauritius: ['Port Louis', 'Beau Bassin-Rose Hill', 'Curepipe', 'Grand Baie'],
  Mozambique: ['Maputo', 'Matola', 'Beira', 'Nampula'],
  Namibia: ['Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati'],
  Niger: ['Niamey', 'Zinder', 'Maradi', 'Agadez'],
  Nigeria: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City'],
  Rwanda: ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri'],
  SaoTome: ['Sao Tome', 'Santo Antonio', 'Neves'],
  Senegal: ['Dakar', 'Thies', 'Saint-Louis', 'Touba'],
  Seychelles: ['Victoria', 'Beau Vallon', 'Anse Royale'],
  SierraLeone: ['Freetown', 'Bo', 'Kenema', 'Makeni'],
  Somalia: ['Mogadishu', 'Hargeisa', 'Kismayo', 'Bosaso'],
  Sudan: ['Khartoum', 'Omdurman', 'Port Sudan', 'Kassala'],
  Tanzania: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar City'],
  Togo: ['Lome', 'Sokode', 'Kara', 'Atakpame'],
  Tunisia: ['Tunis', 'Sousse', 'Sfax', 'Djerba'],
  Uganda: ['Kampala', 'Entebbe', 'Jinja', 'Mbarara'],
  Zambia: ['Lusaka', 'Kitwe', 'Ndola', 'Livingstone'],
  Zimbabwe: ['Harare', 'Bulawayo', 'Victoria Falls', 'Mutare']
};
(async () => {
  await client.connect(); let added = 0;
  for (const [key, cities] of Object.entries(locations)) {
    const country = { BurkinaFaso: 'Burkina Faso', CapeVerde: 'Cape Verde', DRC: 'Democratic Republic of the Congo', IvoryCoast: "Cote d'Ivoire", SaoTome: 'Sao Tome and Principe', SierraLeone: 'Sierra Leone' }[key] || key;
    for (const name of cities) {
      const result = await client.query('INSERT INTO cities (id, name, country) VALUES ($1,$2,$3) ON CONFLICT (name) DO NOTHING', [uuidv4(), name, country]);
      added += result.rowCount;
    }
  }
  console.log(`Added ${added} African city records across ${Object.keys(locations).length} countries`);
  await client.end();
})().catch(err => { console.error(err.message); process.exit(1); });
