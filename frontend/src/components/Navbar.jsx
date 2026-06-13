import React from 'react';

export default function Navbar({ view, setView, dueCount, devMode, onToggleDevMode }) {
  return (
    <header className="bg-white border-b border-ink-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-ink-900">Vocab</span>
          <span className="text-lg font-light text-ink-400">Builder</span>
        </div>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => setView('words')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'words'
                ? 'bg-ink-900 text-white'
                : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100'
            }`}
          >
            My Words
          </button>
          <button
            onClick={() => setView('review')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              view === 'review'
                ? 'bg-ink-900 text-white'
                : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100'
            }`}
          >
            Review
            {dueCount > 0 && (
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  view === 'review' ? 'bg-white text-ink-900' : 'bg-sage-500 text-white'
                }`}
              >
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            )}
          </button>
        </nav>

        <button
          onClick={onToggleDevMode}
          title="Toggle Dev Mode (1 day = 1 minute)"
          className={`text-xs px-2.5 py-1 rounded border font-mono transition-colors ${
            devMode
              ? 'bg-amber-100 text-amber-600 border-amber-400 font-semibold'
              : 'bg-ink-50 text-ink-400 border-ink-200 hover:border-ink-300'
          }`}
        >
          {devMode ? 'DEV ON' : 'DEV'}
        </button>
      </div>
    </header>
  );
}
