// models/note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;