const express = require('express');
const router = express.Router();
const {
  addWord,
  getWords,
  deleteWord,
  getDueWords,
  submitReview,    
  advanceWord,
} = require('../controllers/wordController');

router.get('/review', getDueWords);
router.post('/', addWord);
router.get('/', getWords);
router.delete('/:id', deleteWord);
router.post('/:id/review', submitReview);
router.post('/:id/advance', advanceWord);

module.exports = router;
