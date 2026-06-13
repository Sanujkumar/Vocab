

const DAY_MS = 24 * 60 * 60 * 1000;
const DEV_UNIT_MS = 60 * 1000; // 1 minute represents "1 day" in dev mode

function getUnitMs(devMode) {
  return devMode ? DEV_UNIT_MS : DAY_MS;
}

/**
 * Returns the updated scheduling fields for a word document.
 * @param {Object} word  - Mongoose word document
 * @param {'correct'|'incorrect'} result
 * @param {boolean} devMode
 * @returns {Object} fields to $set on the document
 */
function computeNextReview(word, result, devMode) {
  const unitMs = getUnitMs(devMode);
  const isCorrect = result === 'correct';

  const intervalDays = isCorrect ? 3 : 1;
  const nextReviewAt = new Date(Date.now() + intervalDays * unitMs);

  return {
    nextReviewAt,
    interval: intervalDays,
    repetitions: (word.repetitions || 0) + 1,
    correctCount: isCorrect ? (word.correctCount || 0) + 1 : word.correctCount,
    incorrectCount: !isCorrect ? (word.incorrectCount || 0) + 1 : word.incorrectCount,
  };
}

module.exports = { computeNextReview, getUnitMs };
