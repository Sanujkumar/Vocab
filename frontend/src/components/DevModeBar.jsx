export default function DevModeBar({ devMode, onToggle }) {
  return (
    <div
      className={`border-b text-sm transition-colors ${
        devMode
          ? 'bg-amber-50 border-amber-200 text-amber-800'
          : 'bg-ink-50 border-ink-200 text-ink-500'
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <span className="text-xs">
          {devMode
            ? '⚡ Dev Mode active — 1 day = 1 minute. Use "Advance Time" to trigger reviews.'
            : 'Dev Mode off — normal scheduling (1 day / 3 days).'}
        </span>
        <button
          onClick={onToggle}
          className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded border transition-colors ${
            devMode
              ? 'border-amber-400 text-amber-700 hover:bg-amber-100'
              : 'border-ink-300 text-ink-600 hover:bg-ink-100'
          }`}
        >
          {devMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
        </button>
      </div>
    </div>
  );
}
