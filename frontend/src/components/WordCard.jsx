import React, { useState } from 'react';
import * as api from '../api/wordsApi';

export default function WordCard({ word, devMode, onDelete, onAdvanced }) {
  const [advancing, setAdvancing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDue = new Date(word.nextReviewAt) <= new Date();

  async function handleAdvance() {
    setAdvancing(true);
    try {
      await api.advanceWord(word._id);
      onAdvanced && onAdvanced(word._id);
    } finally {
      setAdvancing(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Remove "${word.word}" from your list?`)) return;
    setDeleting(true);
    try {
      await onDelete(word._id);
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(d) {
    const date = new Date(d);
    const now = new Date();
    const diffMs = date - now;
    const diffMin = Math.round(diffMs / 60000);
    const diffHr = Math.round(diffMs / 3600000);
    const diffDay = Math.round(diffMs / 86400000);
    if (diffMs <= 0) return 'Due now';
    if (diffMin < 60) return `in ${diffMin}m`;
    if (diffHr < 24) return `in ${diffHr}h`;
    return `in ${diffDay}d`;
  }

  return (
    <div className="card p-4 hover:border-ink-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-ink-900 font-mono">{word.word}</span>
            {word.partOfSpeech && (
              <span className="badge bg-ink-100 text-ink-500">{word.partOfSpeech}</span>
            )}
            {word.phonetic && (
              <span className="text-xs text-ink-400 font-mono">{word.phonetic}</span>
            )}
          </div>
          <p className="text-sm text-ink-700 mt-1 leading-relaxed">{word.definition}</p>
          {word.example && (
            <p className="text-xs text-ink-500 mt-1 italic">"{word.example}"</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-ink-400">
            <span
              className={`font-medium ${isDue ? 'text-sage-600' : 'text-ink-400'}`}
            >
              {formatDate(word.nextReviewAt)}
            </span>
            {word.repetitions > 0 && (
              <span>
                {word.correctCount}✓ {word.incorrectCount}✗
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {devMode && !isDue && (
            <button
              onClick={handleAdvance}
              disabled={advancing}
              className="btn-secondary text-xs py-1 px-2"
              title="Make due now (Dev Mode)"
            >
              {advancing ? '…' : 'Skip'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-ink-400 hover:text-rose-500 rounded transition-colors"
            title="Remove word"
          >
            {deleting ? (
              <span className="text-xs">…</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
