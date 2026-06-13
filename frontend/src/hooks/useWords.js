import { useState, useCallback } from 'react';
import * as api from '../api/wordsApi';

export function useWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.getWords();
      setWords(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load words.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addWord = useCallback(async (word) => {
    const { data } = await api.addWord(word);
    setWords((prev) => [data, ...prev]);
    return data;
  }, []);

  const removeWord = useCallback(async (id) => {
    await api.deleteWord(id);
    setWords((prev) => prev.filter((w) => w._id !== id));
  }, []);

  return { words, loading, error, fetchWords, addWord, removeWord };
}
