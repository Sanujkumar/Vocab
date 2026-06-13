import React from 'react';

export default function ReviewCard({ word, revealed, onReveal, onResult, queueLength }) {
  return (
    <div className="card p-6 sm:p-8 text-center max-w-lg mx-auto w-full">
      {/* Progress indicator */}
      <p className="text-xs text-ink-400 mb-6">
        {queueLength} word{queueLength !== 1 ? 's' : ''} remaining in this session
      </p>

      {/* The word */}
      <div className="mb-2">
        <span className="font-mono text-3xl font-semibold text-ink-900">{word.word}</span>
      </div>
      {word.phonetic && (
        <p className="text-sm font-mono text-ink-400 mb-6">{word.phonetic}</p>
      )}
      {!word.phonetic && <div className="mb-6" />}

      {/* Hidden/revealed definition */}
      {!revealed ? (
        <div>
          <div className="bg-ink-50 border border-ink-200 rounded-lg py-8 px-4 mb-6 select-none">
            <p className="text-ink-300 text-sm">Definition hidden — try to recall it</p>
          </div>
          <button onClick={onReveal} className="btn-primary w-full py-3 text-base">
            Reveal Definition
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-ink-50 border border-ink-200 rounded-lg p-4 mb-2 text-left">
            {word.partOfSpeech && (
              <span className="badge bg-ink-200 text-ink-500 mb-2 inline-block">
                {word.partOfSpeech}
              </span>
            )}
            <p className="text-sm text-ink-800 leading-relaxed">{word.definition}</p>
            {word.example && (
              <p className="text-xs text-ink-500 mt-2 italic border-t border-ink-200 pt-2">
                "{word.example}"
              </p>
            )}
          </div>

          <p className="text-xs text-ink-400 mb-4">How did you do?</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onResult('incorrect')}
              className="btn-danger py-3 text-sm flex flex-col items-center gap-0.5"
            >
              <span className="text-base">✗</span>
              <span>Needs Work</span>
              <span className="text-xs opacity-75">review in 1 day</span>
            </button>
            <button
              onClick={() => onResult('correct')}
              className="btn-success py-3 text-sm flex flex-col items-center gap-0.5"
            >
              <span className="text-base">✓</span>
              <span>Got It Right</span>
              <span className="text-xs opacity-75">review in 3 days</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
