const { login } = require('../services/auth.service');

const loginController = async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error interno.' });
  }
};

module.exports = { loginController };