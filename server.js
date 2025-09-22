const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS (for Angular localhost:4200)
app.use(cors());
app.use(bodyParser.json());

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
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/comments', (req, res) => {
  if (!req.body.name || !req.body.stars || !req.body.comment) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // You could also add more specific validation, like for the 'stars' field
  if (isNaN(req.body.stars) || req.body.stars < 1 || req.body.stars > 4) {
    return res.status(400).json({ error: 'Stars must be a number between 1 and 4.' });
  }

  const newComment= {
    name : req.body.name,
    stars : req.body.stars,
    comment : req.body.comment,
    date : Date.now()
  };

  comment.push(newComment);
  res.status(201).json(comment);
});

// GET ALL
app.get('/api/comments', (req, res) => {
  res.json(comments);
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
