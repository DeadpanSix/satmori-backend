const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const port = 3000;

// Initialize Knex.js with your development configuration
const db = knex(knexConfig.development);

// Enable CORS (for Angular localhost:4200)
app.use(cors());
app.use(bodyParser.json({ limit: '6mb' }));

//  In-memory DB
let comments = [
    { id: 1, name: 'Laura Palmer', rating: 4, photo: 'assets/images/pulso-22-sep.jpg', comment: 'first comment. Lorem ipsum dolor sit amet, consectetuer adipscing elit, sedd diam onumy nibh.' },
    { id: 2, name: 'Laura Palmer', rating: 3, photo: 'assets/images/pulso-22-sep.jpg', comment: 'second comment. Lorem ipsum dolor sit amet, consectetuer adipscing elit, sedd diam onumy nibh.' },
    { id: 3, name: 'Laura Palmer', rating: 4, photo: 'assets/images/pulso-22-sep.jpg', comment: 'third comment. Lorem ipsum dolor sit amet, consectetuer adipscing elit, sedd diam onumy nibh.' },
    { id: 4, name: 'Laura Palmer', rating: 2, photo: 'assets/images/pulso-22-sep.jpg', comment: 'fourth comment. Lorem ipsum dolor sit amet, consectetuer adipscing elit, sedd diam onumy nibh.' },
    { id: 5, name: 'Laura Palmer', rating: 4, photo: 'assets/images/pulso-22-sep.jpg', comment: 'fifth comment. Lorem ipsum dolor sit amet, consectetuer adipscing elit, sedd diam onumy nibh.' },
    { id: 6, name: 'Laura Palmer', rating: 4, photo: 'assets/images/pulso-22-sep.jpg', comment: 'sixth comment. Lorem ipsum dolor sit amet, consectetuer adipscing elit, sedd diam onumy nibh.' }
]

// Routes
app.post('/api/comments', async (req, res) => {
    // Validate that all required fields are present
  if (!req.body.name || !req.body.rating || !req.body.comment || !req.body.photo) {
    return res.status(400).json({ error: 'All fields are required: name, rating, comment, and photo.' });
  }

  // Validate the rating field
  const rating = parseInt(req.body.rating);
  if (isNaN(rating) || rating < 1 || rating > 4) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 4.' });
  }

  try {
    const [newComment] = await db('comments').insert({
      user_name: req.body.name,
      rating: parseInt(req.body.rating),
      comment_text: req.body.comment,
      photo_data: req.body.photo
    }).returning('*');

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
    res.json(comments);
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
