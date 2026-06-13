import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 12000,
});

export const addWord = (word) => api.post('/words', { word });

export const getWords = () => api.get('/words');

export const deleteWord = (id) => api.delete(`/words/${id}`);

export const getDueWords = () => api.get('/words/review');

export const submitReview = (id, result, devMode) =>
  api.post(`/words/${id}/review`, { result, devMode });

export const advanceWord = (id) => api.post(`/words/${id}/advance`);
