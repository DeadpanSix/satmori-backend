const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdmin() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await pool.query(`
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
  `, ['Admin', 'admin@test.com', passwordHash, 'superadmin']);

  console.log('✅ Admin creado: admin@test.com / admin123');
  await pool.end();
}

createAdmin().catch(console.error);
