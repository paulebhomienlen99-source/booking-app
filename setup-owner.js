const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function createOwner() {
  try {
    await client.connect();
    const hash = await bcrypt.hash('Owner@BookHub2024', 10);
    
    await client.query(
      'INSERT INTO users (id, email, password_hash, name, is_provider) VALUES ($1, $2, $3, $4, true) ON CONFLICT DO NOTHING',
      [uuidv4(), 'owner.paul@bookhub.app', hash, 'Paul Ebhomieulen']
    );
    
    console.log('Owner account created: owner.paul@bookhub.app');
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createOwner();
