const { createComment, fetchApprovedComments, fetchNotApprovedComments } = require('../services/comments.service');

const postComment = async (req, res) => {
  try {
    const comment = await createComment(req.body);
    res.status(201).json({ message: 'Comentario creado correctamente.', comment });
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'No se pudo enviar tu comentario.';
    res.status(status).json({ error: message });
  }
};

const getApprovedComments = async (req, res) => {
  try {
    const comments = await fetchApprovedComments();
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve comments.' });
  }
};

const getNotApprovedComments = async (req, res) => {
  try {
    const comments = await fetchNotApprovedComments();
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve comments.' });
  }
};

module.exports = { postComment, getApprovedComments, getNotApprovedComments };
