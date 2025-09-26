const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const port = 3000;

// Initialize Knex.js with your development configuration
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

module.exports = db;

app.use(cors({
  origin: ["http://localhost:4200", "https://www.satmori.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(bodyParser.json({ limit: '6mb' }));

// Routes
app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.post('/api/comment', async (req, res) => {
  const { name, rating, comment, photo } = req.body;

  // Validate required fields
  if (!name || !rating || !comment || !photo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: nombre, valoración, experiencia y foto.' });
  }

  const numericRating = parseInt(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 4) {
    return res.status(400).json({ error: 'Valoración debe estar entre rango 1 y 4.' });
  }

  try {
    // Extract MIME type and raw base64 from the string
    const match = photo.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      return res.status(400).json({ error: 'Formato de foto inválido.' });
    }

    const mimeType = match[1];     // e.g. "image/png", "image/jpeg", "application/pdf"
    const base64Data = match[2];   // raw base64 only

    const [newComment] = await db('comments').insert({
      user_name: name,
      rating: numericRating,
      comment_text: comment,
      photo_data: base64Data,   // store only the base64 string
      photo_type: mimeType      // ⚡ store MIME type so you can rebuild the prefix later
    }).returning('*');

    console.log(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error inserting comment:', error);
    res.status(500).json({ error: 'Failed to add comment.' });
  }
});

// GET ALL comments from the database
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await db('comments').select('*');

    const formattedComments = comments.map(comment => {
      if (comment.photo_data) {
        return {
          ...comment,
          photo_data: `data:${comment.photo_type};base64,${comment.photo_data}`
        };
      }
      return comment;
    });

    res.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to retrieve comments.' });
  }
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

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
