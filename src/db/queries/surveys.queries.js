const db = require('../index');

// ─── PUBLIC ────────────────────────────────────────────
const getActiveQuestions = () => {
  return db('questions')
    .where({ active: true })
    .orderBy('order', 'asc')
    .select('id', 'text', 'order');
};

const saveResponse = ({ name, email, phone, answers }) => {
  return db.transaction(async trx => {
    const [response] = await trx('survey_responses')
      .insert({ name, email, phone })
      .returning('id');

    const responseId = response.id;

    await trx('response_answers').insert(
      answers.map(({ question_id, answer }) => ({
        response_id: responseId,
        question_id,
        answer,
      }))
    );

    return responseId;
  });
};

// ─── ADMIN ───────────────────────────────────────────
const getAllQuestions = () => {
  return db('questions')
    .orderBy('order', 'asc')
    .select('id', 'text', 'active', 'order', 'created_at');
};

const updateQuestion = async (id, { text, active }) => {
  const [updated] = await db('questions')
    .where({ id })
    .update({
      ...(text   !== undefined && { text }),
      ...(active !== undefined && { active }),
    })
    .returning('*');

  return updated ?? null;
};

const getAllResponses = () => {
  return db.raw(`
    SELECT
      sr.id,
      sr.name,
      sr.email,
      sr.phone,
      sr.created_at,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'question', q.text,
          'answer',   ra.answer
        ) ORDER BY q.order
      ) AS answers
    FROM survey_responses sr
    JOIN response_answers ra ON ra.response_id = sr.id
    JOIN questions q         ON q.id = ra.question_id
    GROUP BY sr.id
    ORDER BY sr.created_at DESC
  `).then(result => result.rows);
};

module.exports = {
  getActiveQuestions,
  saveResponse,
  getAllQuestions,
  updateQuestion,
  getAllResponses,
};
