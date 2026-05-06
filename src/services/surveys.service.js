const surveysQueries = require('../db/queries/surveys.queries');

const getActiveQuestions = () => surveysQueries.getActiveQuestions();

const saveResponse = ({ name, email, phone, answers }) =>
  surveysQueries.saveResponse({ name, email, phone, answers });

const getAllQuestions = () => surveysQueries.getAllQuestions();

const updateQuestion = (id, fields) => surveysQueries.updateQuestion(id, fields);

const getAllResponses = () => surveysQueries.getAllResponses();

module.exports = {
  getActiveQuestions,
  saveResponse,
  getAllQuestions,
  updateQuestion,
  getAllResponses,
};
