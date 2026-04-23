const {
  createComment,
  fetchApprovedComments,
  fetchNotApprovedComments,
  fetchAllComments,
  updateToggleComment
} = require('../services/comments.service');

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

const getAllComments = async (req, res) => {
  try {
    const comments = await fetchAllComments();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
};

const toggleComment = async (req, res) => {
  const { id }       = req.params;
  const { approved } = req.body;

  try {
    const comment = await updateToggleComment(id, approved);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar comentario' });
  }
};

module.exports = {
  postComment,
  getApprovedComments,
  getNotApprovedComments,
  getAllComments,
  toggleComment
};
