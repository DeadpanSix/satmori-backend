const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const commentsRoutes = require('./src/routes/comments.routes');
const surveysRoutes = require('./src/routes/surveys.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'https://www.satmori.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: '10mb' }));

app.get('/api', (req, res) => res.send('Hello World'));
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/surveys', surveysRoutes);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
