const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  tasks: { type: String, required: true, maxlength: 400 },
  duration: { type: String, required: true, maxlength: 400 },
  additionalInfo: { type: String, maxlength: 400 },
  hourlyRate: { type: Number, required: true },
  category: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;