import React from 'react';

export default function SessionComplete({ stats, onRestart, onGoToWords }) {
  const total = stats.correct + stats.incorrect;
  const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  return (
    <div className="card p-8 text-center max-w-sm mx-auto w-full">
      <div className="text-4xl mb-3">
        {pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}
      </div>
      <h2 className="text-lg font-semibold text-ink-900 mb-1">Session Complete</h2>
      <p className="text-sm text-ink-500 mb-6">You reviewed all due words for now.</p>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Stat label="Reviewed" value={total} />
          <Stat label="Correct" value={stats.correct} color="sage" />
          <Stat label="Needs Work" value={stats.incorrect} color="rose" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={onRestart} className="btn-primary w-full">
          Check Again
        </button>
        <button onClick={onGoToWords} className="btn-secondary w-full">
          Back to My Words
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colorMap = {
    sage: 'text-sage-600',
    rose: 'text-rose-500',
  };
  return (
    <div className="bg-ink-50 rounded-lg p-3">
      <p className={`text-xl font-semibold ${colorMap[color] || 'text-ink-900'}`}>{value}</p>
      <p className="text-xs text-ink-500 mt-0.5">{label}</p>
    </div>
  );
}
