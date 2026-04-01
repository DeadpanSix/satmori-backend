const { insertComment, getApprovedComments, getNotApprovedComments } = require('../db/queries/comments.queries');

const validateAndParsePhoto = (photo) => {
  const match = photo.match(/^data:(.+);base64,(.*)$/);
  if (!match) throw { status: 400, message: 'Formato de foto inválido.' };

  const mimeType = match[1].toLowerCase();
  const base64Data = match[2];

  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType))
    throw { status: 400, message: 'Solo se permiten imágenes JPEG, JPG o PNG.' };

  const maxSize = 10 * 1024 * 1024;
  if (Buffer.byteLength(base64Data, 'base64') > maxSize)
    throw { status: 400, message: 'La foto excede el tamaño máximo permitido (10 MB).' };

  return { mimeType, base64Data };
};

const validateFields = ({ name, rating, comment, photo }) => {
  if (!name) throw { status: 400, message: 'Nombre requerido.' };
  if (name.length > 50) throw { status: 400, message: 'El nombre no puede exceder 50 caracteres.' };

  const numericRating = parseInt(rating);
  if (!rating) throw { status: 400, message: 'Valoración requerida.' };
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 4)
    throw { status: 400, message: 'Valoración debe estar entre rango 1 y 4.' };

  if (!comment) throw { status: 400, message: 'Experiencia/comentario requerido.' };
  if (comment.length > 200) throw { status: 400, message: 'El comentario no puede exceder 200 caracteres.' };

  if (!photo) throw { status: 400, message: 'Foto requerida.' };

  return parseInt(rating);
};

const createComment = async ({ name, rating, comment, photo }) => {
  const numericRating = validateFields({ name, rating, comment, photo });
  const { mimeType, base64Data } = validateAndParsePhoto(photo);

  const newComment = await insertComment({ name, rating: numericRating, comment, base64Data, mimeType });

  return {
    user_name: newComment.user_name,
    rating: newComment.rating,
    comment_text: newComment.comment_text
  };
};

const fetchApprovedComments = async () => getApprovedComments();

const fetchNotApprovedComments = async () => getNotApprovedComments();

module.exports = { createComment, fetchApprovedComments, fetchNotApprovedComments };
