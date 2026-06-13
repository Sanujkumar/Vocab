import React, { useEffect } from 'react';
import { useReview } from '../hooks/useReview';
import ReviewCard from '../components/ReviewCard';
import SessionComplete from '../components/SessionComplete';

export default function ReviewPage({ devMode, onDueCountChange, onGoToWords }) {
  const {
    queue,
    current,
    revealed,
    loading,
    error,
    sessionStats,
    loadQueue,
    reveal,
    submitResult,
  } = useReview(devMode);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    onDueCountChange(queue.length);
  }, [queue, onDueCountChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-ink-400 text-sm">
        Loading review queue…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="card p-4 bg-rose-50 border-rose-200 text-rose-700 text-sm">{error}</div>
        <button onClick={loadQueue} className="btn-secondary mt-3 w-full">
          Retry
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="max-w-sm mx-auto px-4 py-8">
        <SessionComplete
          stats={sessionStats}
          onRestart={loadQueue}
          onGoToWords={onGoToWords}
        />
        {devMode && (
          <p className="text-center text-xs text-amber-600 mt-4 font-mono">
            DEV MODE — intervals are 1 min per day
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      {devMode && (
        <div className="text-center mb-4">
          <span className="badge bg-amber-100 text-amber-700 border border-amber-300 font-mono text-xs">
            DEV MODE · 1 day = 1 minute
          </span>
        </div>
      )}
      <ReviewCard
        word={current}
        revealed={revealed}
        onReveal={reveal}
        onResult={submitResult}
        queueLength={queue.length}
      />
    </div>
  );
}
