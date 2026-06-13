const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'test-user',
      index: true,
    },
    word: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    definition: {
      type: String,
      required: true,
    },
    example: {
      type: String,
      default: '',
    },
    partOfSpeech: {
      type: String,
      default: '',
    },
    phonetic: {
      type: String,
      default: '',
    },
    nextReviewAt: {
      type: Date,
      default: Date.now,
    },
    interval: {
      type: Number,
      default: 0,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

wordSchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('Word', wordSchema);
