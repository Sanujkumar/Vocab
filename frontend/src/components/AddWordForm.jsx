import React, { useState } from 'react';

export default function AddWordForm({ onAdd }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message }

  async function handleSubmit(e) {
    e.preventDefault();
    const word = input.trim();
    if (!word) return;

    setLoading(true);
    setFeedback(null);
    try {
      const added = await onAdd(word);
      setFeedback({ type: 'success', message: `"${added.word}" added successfully.` });
      setInput('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">
        Add a New Word
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="input"
          placeholder="Please enter a single valid word: e.g. ephemeral"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (feedback) setFeedback(null);
          }}
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Spinner />
              Looking up…
            </span>
          ) : (
            'Add Word'
          )}
        </button>
      </form>

      {feedback && (
        <p
          className={`mt-2 text-sm ${
            feedback.type === 'success' ? 'text-sage-600' : 'text-rose-600'
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
