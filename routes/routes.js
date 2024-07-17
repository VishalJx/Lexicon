const express = require('express');
const Word = require('../models/word');

const router = express.Router();

// Receive formatted word data from frontend and save to database
router.post('/fetch', async (req, res) => {
  const { word, definitions } = req.body;

  try {
    // Check if the word already exists in the database
    let existingWord = await Word.findOne({ word: word });

    if (existingWord) {
      // If the word exists, update its definitions
      existingWord.definitions = definitions;
      const updatedWord = await existingWord.save();
      res.status(200).json(updatedWord);
    } else {
      // If the word doesn't exist, create a new entry
      const newWord = new Word({ word, definitions });
      const savedWord = await newWord.save();
      res.status(201).json(savedWord);
    }
  } catch (error) {
    console.error('Error saving word:', error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch words starting with a specific letter
router.get('/:letter', async (req, res) => {
  const { letter } = req.params;

  try {
    // Query the database for words starting with the specified letter
    const words = await Word.find({ word: new RegExp(`^${letter}`, 'i') });
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/search/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm.toLowerCase();
    const word = await Word.findOne({ word: searchTerm });

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json(word);
  } catch (error) {
    console.error('Error searching for word:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
