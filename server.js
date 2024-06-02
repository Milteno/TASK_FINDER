const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./src/middlewares/authMiddleware'); // Importuj middleware
const User = require('./src/models/user'); // Importuj model User
const Note = require('./src/models/note'); // Importuj model Note

const app = express();
const port = 5000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/auth-demo'; // Użyj 127.0.0.1 zamiast localhost

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Ustawienie limitu czasu połączenia
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received registration data:', req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    console.log('User registered:', user);

    const token = jwt.sign({ id: user._id, username: user.username }, 'secret', { expiresIn: '1h' });
    res.status(201).json({ user: { username: user.username }, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send(error.message);
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, username: user.username }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ user: { username: user.username }, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Notes routes
app.post('/notes', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const note = new Note({
    userId: req.user.id,
    content,
  });
  try {
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/notes', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.send(notes);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/notes/:id', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content },
      { new: true }
    );
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.send(note);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/notes/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.send('Note deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});