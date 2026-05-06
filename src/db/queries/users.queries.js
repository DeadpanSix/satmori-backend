const db = require('../index');

const findUserByEmail = async (email) => {
  try {
    const result = await db.raw('SELECT * FROM get_user_by_email(?)', [email]);
    console.log('raw result:', JSON.stringify(result));  // log to see actual structure
    return result.rows?.[0] || result[0]?.[0] || null;
  } catch (err) {
    console.error('findUserByEmail error:', err.message);
    throw err;
  }
};

module.exports = { findUserByEmail };
