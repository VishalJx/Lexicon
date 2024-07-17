// models/Word.js
const mongoose = require('mongoose');

const definitionSchema = new mongoose.Schema({
  definition: String,
  partOfSpeech: String,
});

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
  },
  definitions: [definitionSchema],
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
