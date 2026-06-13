const axios = require('axios');

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * Fetches definition data for a given word from the free dictionary API.
 * Returns { word, definition, example, partOfSpeech, phonetic }
 * Throws an error with a user-friendly message if not found.
 */
async function fetchWordDefinition(word) {
  const normalised = word.trim().toLowerCase();

  let response;
  try {
    response = await axios.get(`${DICTIONARY_API_BASE}/${encodeURIComponent(normalised)}`, {
      timeout: 8000,
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const notFound = new Error(`The word "${word}" was not found in the dictionary.`);
      notFound.statusCode = 404;
      throw notFound;
    }
    const networkErr = new Error('Could not reach the dictionary service. Please check your connection and try again.');
    networkErr.statusCode = 503;
    throw networkErr;
  }

  const entries = response.data;
  if (!entries || entries.length === 0) {
    const notFound = new Error(`No definition found for "${word}".`);
    notFound.statusCode = 404;
    throw notFound;
  }

  const entry = entries[0];
  const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics.find(p => p.text)?.text) || '';

  // Walk meanings to find the first good definition + example
  let definition = '';
  let example = '';
  let partOfSpeech = '';

  for (const meaning of entry.meanings || []) {
    for (const def of meaning.definitions || []) {
      if (!definition && def.definition) {
        definition = def.definition;
        partOfSpeech = meaning.partOfSpeech || '';
      }
      if (!example && def.example) {
        example = def.example;
      }
      if (definition && example) break;
    }
    if (definition && example) break;
  }

  if (!definition) {
    const noDefErr = new Error(`No readable definition found for "${word}".`);
    noDefErr.statusCode = 422;
    throw noDefErr;
  }

  return { word: normalised, definition, example, partOfSpeech, phonetic };
}

module.exports = { fetchWordDefinition };
     