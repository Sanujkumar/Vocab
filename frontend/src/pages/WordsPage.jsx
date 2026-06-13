import React, { useEffect, useState } from 'react';
import { useWords } from '../hooks/useWords';
import AddWordForm from '../components/AddWordForm';
import WordCard from '../components/WordCard';

export default function WordsPage({ devMode, onDueCountChange }) {
  const { words, loading, error, fetchWords, addWord, removeWord } = useWords();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  useEffect(() => {
    const dueCount = words.filter((w) => new Date(w.nextReviewAt) <= new Date()).length;
    onDueCountChange(dueCount);
  }, [words, onDueCountChange]);

  function handleAdvanced() {
    fetchWords();
  }

  const now = new Date();
  const displayed =
    filter === 'due' ? words.filter((w) => new Date(w.nextReviewAt) <= now) : words;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      <AddWordForm onAdd={addWord} />

      {words.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-500">
            {words.length} word{words.length !== 1 ? 's' : ''} total
          </p>
          <div className="flex gap-1">
            {['all', 'due'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  filter === f
                    ? 'bg-ink-900 text-white'
                    : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-300'
                }`}
              >
                {f === 'all' ? 'All' : 'Due now'}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-ink-400 text-sm">Loading your words…</div>
      )}

      {error && (
        <div className="card p-4 border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>
      )}

      {!loading && !error && words.length === 0 && (
        <div className="card py-14 px-6 text-center">
          <p className="text-ink-400 text-sm">No words yet.</p>
          <p className="text-ink-400 text-sm mt-1">
            Add your first word above to start building your vocabulary.
          </p>
        </div>
      )}

      {!loading && !error && words.length > 0 && displayed.length === 0 && (
        <div className="card py-10 px-6 text-center">
          <p className="text-ink-400 text-sm">No words due for review right now.</p>
          <p className="text-ink-400 text-sm mt-1">
            {devMode
              ? 'Use the "Skip" button on a card to make it due immediately.'
              : 'Check back later — keep learning!'}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {displayed.map((word) => (
          <WordCard
            key={word._id}
            word={word}
            devMode={devMode}
            onDelete={removeWord}
            onAdvanced={handleAdvanced}
          />
        ))}
      </div>
    </div>
  );
}
