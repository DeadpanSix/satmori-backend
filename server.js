const express = require('express');
const cors = require('cors');
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

app.use(express.json({ limit: '10mb' }));

// Routes
app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.post('/api/comment', async (req, res) => {
  const { name, rating, comment, photo } = req.body;
  const numericRating = parseInt(rating);

  // Validate required fields individually
  if (!name) {
    return res.status(400).json({ error: 'Nombre requerido.' });
  } else if (name.length > 50) {
    return res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres.' });
  }
  if (!rating) {
    return res.status(400).json({ error: 'Valoración requerida.' });
  } else if (isNaN(numericRating) || numericRating < 1 || numericRating > 4) {
    return res.status(400).json({ error: 'Valoración debe estar entre rango 1 y 4.' });
  }
  if (!comment) {
    return res.status(400).json({ error: 'Experiencia/comentario requerido.' });
  } else if (comment.length > 200) {
  return res.status(400).json({ error: 'El comentario no puede exceder 200 caracteres.' });
}
  if (!photo) {
    return res.status(400).json({ error: 'Foto requerida.' });
  }

  // Extract MIME type and raw base64 from the string
  const match = photo.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    return res.status(400).json({ error: 'Formato de foto inválido.' });
  }

  const mimeType = match[1].toLowerCase();
  const base64Data = match[2];

  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType)) {
    return res.status(400).json({ error: 'Solo se permiten imágenes JPEG, JPG o PNG.' });
  }

  const maxBase64Size = 10 * 1024 * 1024; // 10 MB
  const base64Length = Buffer.byteLength(base64Data, 'base64');
  if (base64Length > maxBase64Size) {
    return res.status(400).json({ error: 'La foto excede el tamaño máximo permitido (10 MB).' });
  }

  try {
    const [newComment] = await db('comments').insert({
      user_name: name,
      rating: numericRating,
      comment_text: comment,
      photo_data: base64Data,
      photo_type: mimeType
    }).returning('*');

    return res.status(201).json({
      message: 'Comentario creado correctamente.',
      comment: {
        user_name: newComment.user_name,
        rating: newComment.rating,
        comment_text: newComment.comment_text
      }
    });
  } catch (error) {
    console.error('Database insert failed: ', error);
    res.status(500).json({ error: 'No se pudo enviar tu comentario.' });
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
