const Word = require('../models/Word');
const { fetchWordDefinition } = require('../services/dictionaryService');
const { computeNextReview } = require('../services/spacedRepetitionService');

const USER_ID = 'test-user';

async function addWord(req, res) {
  const { word } = req.body;
  if (!word || !word.trim()) {
    return res.status(400).json({ error: 'Word is required.' });
  }

  try {
    const data = await fetchWordDefinition(word);

    // Check duplicate
    const existing = await Word.findOne({ userId: USER_ID, word: data.word });
    if (existing) {
      return res.status(409).json({ error: `"${data.word}" is already in your vocabulary list.` });
    }

    const newWord = await Word.create({ userId: USER_ID, ...data });
    return res.status(201).json(newWord);
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
}

// GET /api/words  — list all words
async function getWords(req, res) {
  try {
    const words = await Word.find({ userId: USER_ID }).sort({ createdAt: -1 });
    return res.json(words);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch words.' });
  }
}

// DELETE /api/words/:id  — remove a word
async function deleteWord(req, res) {
  try {
    const deleted = await Word.findOneAndDelete({ _id: req.params.id, userId: USER_ID });
    if (!deleted) return res.status(404).json({ error: 'Word not found.' });
    return res.json({ message: 'Word deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete word.' });
  }
}

// GET /api/words/review  — words due for review right now
async function getDueWords(req, res) {
  try {
    const now = new Date();
    const words = await Word.find({
      userId: USER_ID,
      nextReviewAt: { $lte: now },
    }).sort({ nextReviewAt: 1 });
    return res.json(words);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch review queue.' });
  }
}

// POST /api/words/:id/review  — submit a review result
async function submitReview(req, res) {
  const { result, devMode } = req.body; // result: 'correct' | 'incorrect'
  if (!['correct', 'incorrect'].includes(result)) {
    return res.status(400).json({ error: 'result must be "correct" or "incorrect".' });
  }

  try {
    const word = await Word.findOne({ _id: req.params.id, userId: USER_ID });
    if (!word) return res.status(404).json({ error: 'Word not found.' });

    const updates = computeNextReview(word, result, !!devMode);
    Object.assign(word, updates);
    await word.save();

    return res.json(word);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save review.' });
  }
}

// POST /api/words/:id/advance  — dev mode: make word due immediately
async function advanceWord(req, res) {
  try {
    const word = await Word.findOneAndUpdate(
      { _id: req.params.id, userId: USER_ID },
      { $set: { nextReviewAt: new Date(Date.now() - 1000) } },
      { new: true }
    );
    if (!word) return res.status(404).json({ error: 'Word not found.' });
    return res.json(word);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to advance word.' });
  }
}

module.exports = { addWord, getWords, deleteWord, getDueWords, submitReview, advanceWord };
