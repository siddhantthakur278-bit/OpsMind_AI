require('dotenv').config({ path: '/Users/siddhant/Desktop/zalima2/OpsMind-AI/server/.env' });
const { getTursoClient } = require('/Users/siddhant/Desktop/zalima2/OpsMind-AI/server/lib/turso');

async function run() {
  const turso = getTursoClient();
  const res = await turso.execute('SELECT email, password, pendingPassword, otp FROM users');
  console.log(res.rows);
}

run().catch(console.error);
