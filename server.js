const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./src/middlewares/authMiddleware');
const User = require('./src/models/user');
const Note = require('./src/models/note');

const app = express();
const port = 5000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/auth-demo';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
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

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ user: { username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, city: user.city }, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Notes routes
app.post('/notes', authMiddleware, async (req, res) => {
  const { title, date, time, location, phoneNumber, tasks, duration, additionalInfo, hourlyRate } = req.body;
  const note = new Note({
    userId: req.user.id,
    title,
    date,
    time,
    location,
    phoneNumber,
    tasks,
    duration,
    additionalInfo,
    hourlyRate,
  });
  try {
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint zwracający wszystkie notatki (nie wymaga uwierzytelnienia)
app.get('/map', async (req, res) => {
  try {
    const notes = await Note.find().populate('userId', 'username');
    res.send(notes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint zwracający notatki zalogowanego użytkownika
app.get('/notes', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).send([]);
    }
    const notes = await Note.find({ userId: req.user.id }).populate('userId', 'username');
    res.send(notes);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('userId', 'username');
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.send(note);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/notes/:id', authMiddleware, async (req, res) => {
  const { title, date, time, location, phoneNumber, tasks, duration, additionalInfo, hourlyRate } = req.body;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, date, time, location, phoneNumber, tasks, duration, additionalInfo, hourlyRate },
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
app.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/verify-token', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/update-user', authMiddleware, async (req, res) => {
  const { email, password, username, firstName, lastName, city } = req.body;
  try {
    const updatedFields = {};
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);
    if (username) updatedFields.username = username;
    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (city) updatedFields.city = city;

    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, 'secret', { expiresIn: '1h' });
    res.send({ user: { username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, city: user.city }, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});