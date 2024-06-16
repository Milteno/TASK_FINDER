const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  tasks: {
    type: String,
    required: true,
    maxlength: 400,
  },
  duration: {
    type: String,
    required: true,
    maxlength: 400,
  },
  additionalInfo: {
    type: String,
    maxlength: 400,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Note', NoteSchema);