const db = require('../index');

const findUserByEmail = async (email) => {
  const result = await db.raw('SELECT * FROM get_user_by_email(:email)', { email });
  return result.rows[0] || null;
};

module.exports = { findUserByEmail };
