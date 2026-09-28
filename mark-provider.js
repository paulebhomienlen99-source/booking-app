const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(() => {
  client.query("UPDATE users SET is_provider = true WHERE email = 'paul.test@bookhub.app'")
    .then(() => { console.log('User marked as provider'); client.end(); })
    .catch(err => { console.error(err); client.end(); });
}).catch(err => console.error(err));
