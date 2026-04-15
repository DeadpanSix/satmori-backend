const surveysService = require('../services/surveys.service');

// ─── PUBLIC ────────────────────────────────────────────
async function getActiveQuestions(req, res) {
  try {
    const questions = await surveysService.getActiveQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener preguntas' });
  }
}

async function submitResponse(req, res) {
  const { name, email, phone, answers } = req.body;

  if (!name || !email || !phone || !answers?.length) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const responseId = await surveysService.saveResponse({ name, email, phone, answers });
    res.status(201).json({ message: 'Respuestas guardadas correctamente', id: responseId });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar respuestas' });
  }
}

// ─── ADMIN ───────────────────────────────────────────
async function getAllQuestions(req, res) {
  try {
    const questions = await surveysService.getAllQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener preguntas' });
  }
}

async function updateQuestion(req, res) {
  const { id } = req.params;
  const { text, active } = req.body;

  try {
    const question = await surveysService.updateQuestion(id, { text, active });

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar pregunta' });
  }
}

async function getAllResponses(req, res) {
  try {
    const responses = await surveysService.getAllResponses();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener respuestas' });
  }
}

module.exports = {
  getActiveQuestions,
  submitResponse,
  getAllQuestions,
  updateQuestion,
  getAllResponses,
};
