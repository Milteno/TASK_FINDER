const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./src/middlewares/authMiddleware');
const User = require('./src/models/user');
const Task = require('./src/models/task');
const Signup = require('./src/models/signup');

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
  console.log('Otrzymane dane użytkownika:', req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    console.log('Użytkownik zarejestrowany:', user);

    const token = jwt.sign({ id: user._id, username: user.username }, 'secret', { expiresIn: '1h' });
    res.status(201).json({ user: { username: user.username }, token });
  } catch (error) {
    console.error('Błąd przy tworzeniu użytkownika:', error);
    res.status(400).send(error.message);
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Uzytkownik nie znaleziony');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Niepoprawne dane');
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ user: { username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, city: user.city }, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Tasks routes
app.post('/tasks', authMiddleware, async (req, res) => {
  const { title, date, time, location, phoneNumber, tasks, duration, additionalInfo, hourlyRate, category } = req.body;
  const task = new Task({
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
    category
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint zwracający wszystkie notatki (nie wymaga uwierzytelnienia)
app.get('/map', async (req, res) => {
  try {
    const tasks = await Task.find().populate('userId', 'username');
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/tasks', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).send([]);
    }
    const tasks = await Task.find({ userId: req.user.id }).populate('userId', 'username');
    res.send(tasks);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('userId', 'username');
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/tasks/:id', authMiddleware, async (req, res) => {
  const { title, date, time, location, phoneNumber, tasks, duration, additionalInfo, hourlyRate, category } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, date, time, location, phoneNumber, tasks, duration, additionalInfo, hourlyRate, category },
      { new: true }
    );
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send('Task deleted');
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
app.post('/signup', authMiddleware, async (req, res) => {
  const { taskId, ...signupData } = req.body;
  try {
    const existingSignup = await Signup.findOne({ taskId, userId: req.user.id });
    if (existingSignup) {
      return res.status(400).send('Już aplikowałeś na te ogłoszenie');
    }
    const newSignup = new Signup({ taskId, userId: req.user.id, ...signupData });
    await newSignup.save();
    res.status(201).send('Aplikacja zakończona sukcesem');
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.get('/signup/check/:taskId', authMiddleware, async (req, res) => {
  const { taskId } = req.params;
  try {
    const signup = await Signup.findOne({ taskId, userId: req.user.id });
    if (signup) {
      return res.json({ hasApplied: true });
    } else {
      return res.json({ hasApplied: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/tasks/:id/applications', authMiddleware, async (req, res) => {
  try {
    const applications = await Signup.find({ taskId: req.params.id }).populate('userId', 'username firstName lastName email phoneNumber');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});