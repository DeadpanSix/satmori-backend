const bcrypt = require('bcryptjs');

const email = process.argv[2];
const password = process.argv[3];
const role = process.argv[4] || 'admin';

if (!email || !password) {
  console.error('Uso: node scripts/hash-password.js <email> <password> <role>');
  console.error('Roles disponibles: admin, superadmin (default: admin)');
  process.exit(1);
}

if (!['admin', 'superadmin'].includes(role)) {
  console.error('Role inválido. Usa: admin o superadmin');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\n✅ Hash generado:\n');
  console.log(hash);
  console.log('\nSQL listo para copiar:\n');
  console.log(`INSERT INTO users (email, password_hash, role) VALUES ('${email}', '${hash}', '${role}');`);
  console.log('');
});

// node scripts/hash-password.js tu@email.com tu_password_aqui superadmin
