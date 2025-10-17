const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  copies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Book', bookSchema);
