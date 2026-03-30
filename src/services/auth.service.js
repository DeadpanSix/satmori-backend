const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../db/queries/users.queries');

const login = async ({ email, password }) => {
  if (!email) throw { status: 400, message: 'Email requerido.' };
  if (!password) throw { status: 400, message: 'Contraseña requerida.' };

  const user = await findUserByEmail(email);
  if (!user) throw { status: 401, message: 'Credenciales inválidas.' };

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) throw { status: 401, message: 'Credenciales inválidas.' };

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token };
};

module.exports = { login };