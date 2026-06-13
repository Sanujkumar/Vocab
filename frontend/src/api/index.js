import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vocab-upzp.onrender.com/api',   
  timeout: 12000,
});

// ── Words ──────────────────────────────────────────────────────────────
export const fetchWords = () => api.get('/words').then((r) => r.data);

export const addWord = (word) =>
  api.post('/words', { word }).then((r) => r.data);

export const deleteWord = (id) =>
  api.delete(`/words/${id}`).then((r) => r.data);

// ── Reviews ────────────────────────────────────────────────────────────
export const fetchDueWords = () => api.get('/reviews/due').then((r) => r.data);

export const fetchDueCount = () => api.get('/reviews/due/count').then((r) => r.data);

export const submitResult = (id, correct, devMode) =>
  api.post(`/reviews/${id}/result`, { correct, devMode }).then((r) => r.data);

export const advanceTime = (minutes) =>
  api.post('/reviews/advance-time', { minutes }).then((r) => r.data);
