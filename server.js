const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const commentsRoutes = require('./src/routes/comments.routes');
const surveysRoutes = require('./src/routes/surveys.routes')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'https://www.satmori.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: '10mb' }));

app.get('/api', (req, res) => res.send('Hello World'));
app.use('/api', authRoutes);
app.use('/api', commentsRoutes);
app.use('/api/surveys', surveysRoutes);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

// GET by ID
// app.get('/api/comments/:id', (req, res) => {
//   const comment = comments.find(u => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ error: 'User not found' });
//   res.json(comment);
// });

// PUT
// app.put('/api/comments/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const i = comments.findIndex(u => u.id === id);
//   if (i === -1) return res.status(404).json({ error: 'User not found' });

//   comments[i] = { ...comments[i], ...req.body };
//   res.json(comments[i]);
// });

// DELETE
// app.delete('/api/comments/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const initialLength = comments.length;
//   comments = comments.filter(u => u.id !== id);
//   if (comments.length === initialLength) {
//     return res.status(404).json({ error: 'Comment not found' });
//   }
//   res.status(204).send();
// });
