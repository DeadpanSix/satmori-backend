const db = require('../index');

const findUserByEmail = async (email) => {
  const result = await db('users')
    .where({ email })
    .select('id', 'email', 'password_hash', 'role', 'created_at')
    .first();
  return result || null;
};

module.exports = { findUserByEmail };
