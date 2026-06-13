const Word = require('../models/Word');
const { scheduleNextReview, buildDueQuery } = require('../services/spacedRepetitionService');

const USER_ID = 'test-user';


async function getDueWords(req, res, next) {
  try {
    const dueWords = await Word.find(buildDueQuery(USER_ID)).sort({ nextReviewAt: 1 });
    return res.json(dueWords);
  } catch (err) {
    next(err);
  }
}


async function getDueCount(req, res, next) {
  try {
    const count = await Word.countDocuments(buildDueQuery(USER_ID));
    return res.json({ count });
  } catch (err) {
    next(err);
  }
}

async function submitReviewResult(req, res, next) {
  try {
    const { id } = req.params;
    const { correct, devMode = false } = req.body;

    if (typeof correct !== 'boolean') {
      return res.status(400).json({ error: '"correct" must be a boolean.' });
    }

    const word = await Word.findOne({ _id: id, userId: USER_ID });
    if (!word) {
      return res.status(404).json({ error: 'Word not found.' });
    }

    const { nextReviewAt, intervalDays } = scheduleNextReview(correct, devMode);

    word.nextReviewAt = nextReviewAt;
    word.intervalDays = intervalDays;
    word.lastReviewedAt = new Date();
    if (correct) {
      word.correctCount += 1;
    } else {
      word.incorrectCount += 1;
    }

    await word.save();

    return res.json(word);
  } catch (err) {
    next(err);
  }
}

async function advanceTime(req, res, next) {
  try {
    const { minutes = 5 } = req.body;

    if (typeof minutes !== 'number' || minutes <= 0) {
      return res.status(400).json({ error: '"minutes" must be a positive number.' });
    }

    const msToSubtract = minutes * 60 * 1000;
    const now = new Date();

    const result = await Word.updateMany(
      { userId: USER_ID, nextReviewAt: { $gt: now } },
      [
        {
          $set: {
            nextReviewAt: {
              $subtract: ['$nextReviewAt', msToSubtract],
            },
          },
        },
      ]
    );

    const newCount = await Word.countDocuments(buildDueQuery(USER_ID));

    return res.json({
      message: `Simulated ${minutes} minute(s) forward.`,
      wordsAffected: result.modifiedCount,
      nowDueCount: newCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDueWords, getDueCount, submitReviewResult, advanceTime };
