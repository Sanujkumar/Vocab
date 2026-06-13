import { useState, useCallback } from 'react';
import * as api from '../api/wordsApi';

export function useReview(devMode) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.getDueWords();
      setQueue(data);
      setCurrent(data.length > 0 ? data[0] : null);
      setRevealed(false);
      setSessionStats({ correct: 0, incorrect: 0 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load review queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reveal = useCallback(() => setRevealed(true), []);

  const submitResult = useCallback(
    async (result) => {
      if (!current) return;
      try {
        await api.submitReview(current._id, result, devMode);
        setSessionStats((prev) => ({
          ...prev,
          correct: result === 'correct' ? prev.correct + 1 : prev.correct,
          incorrect: result === 'incorrect' ? prev.incorrect + 1 : prev.incorrect,
        }));
        // Advance to next
        const nextQueue = queue.slice(1);
        setQueue(nextQueue);
        setCurrent(nextQueue.length > 0 ? nextQueue[0] : null);
        setRevealed(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to save review.');
      }
    },
    [current, queue, devMode]
  );

  return {
    queue,
    current,
    revealed,
    loading,
    error,
    sessionStats,
    loadQueue,
    reveal,
    submitResult,
  };
}
