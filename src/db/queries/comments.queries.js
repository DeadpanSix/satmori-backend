const db = require('../index');

const insertComment = async ({ name, rating, comment, base64Data, mimeType }) => {
  const [newComment] = await db('comments').insert({
    user_name: name,
    rating,
    comment_text: comment,
    photo_data: base64Data,
    photo_type: mimeType
  }).returning('*');

  return newComment;
};

const getApprovedComments = async () => {
  const result = await db.raw('SELECT * FROM get_approved_comments()');
  return result.rows;
};

const getNotApprovedComments = async () => {
  const result = await db.raw('SELECT * FROM get_not_approved_comments()');
  return result.rows;
};

const getAllComments = async () => {
  const result = await db.raw('SELECT * FROM get_all_comments()');
  return result.rows;
};

const toggleComment = async (id, approved) => {
  const [updated] = await db('comments')
    .where({ id })
    .update({ approved })
    .returning('*');
  return updated ?? null;
};

module.exports = {
  insertComment,
  getApprovedComments,
  getNotApprovedComments,
  getAllComments,
  toggleComment
};