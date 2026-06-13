import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import WordsPage from './pages/WordsPage';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  const [view, setView] = useState('words');
  const [devMode, setDevMode] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  const handleDueCountChange = useCallback((count) => {
    setDueCount(count);
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar
        view={view}
        setView={setView}
        dueCount={dueCount}
        devMode={devMode}
        onToggleDevMode={() => setDevMode((d) => !d)}
      />
      <main>
        {view === 'words' ? (
          <WordsPage devMode={devMode} onDueCountChange={handleDueCountChange} />
        ) : (
          <ReviewPage
            devMode={devMode}
            onDueCountChange={handleDueCountChange}
            onGoToWords={() => setView('words')}
          />
        )}
      </main>
    </div>
  );
}
