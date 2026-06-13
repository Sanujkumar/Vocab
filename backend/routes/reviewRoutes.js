const express = require('express');
const router = express.Router();
const {
  getDueWords,
  getDueCount,
  submitReviewResult,
  advanceTime,
} = require('../controllers/reviewController');

router.get('/due', getDueWords);
router.get('/due/count', getDueCount);
router.post('/:id/result', submitReviewResult);
router.post('/advance-time', advanceTime);

module.exports = router;
