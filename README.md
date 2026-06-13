# Smart Spaced-Repetition Vocab Builder

A full-stack MERN application for building vocabulary through spaced repetition. Add words, get automatic definitions from a free dictionary API, and review them on an adaptive schedule.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| MongoDB | 6+ (local) or a MongoDB Atlas URI |

---

## Quick Start

### 1. Clone and configure

```bash
git clone My ropo
cd vocab-builder
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env if you want a different MongoDB URI or port
npm install
npm run dev        # starts on http://localhost:5000
```

The server will log `Connected to MongoDB` and `Server running on port 5000`.

### 3. Frontend setup (in a new terminal)

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/vocab-builder` | MongoDB connection string |
| `PORT` | `5000` | Express port |

---

## Testing the Full Lifecycle in 5 Minutes

1. **Add a few words** — type "ephemeral", "serendipity", "ubiquitous" and click *Add Word*. Definitions are fetched automatically.
2. **Enable Dev Mode** — click the **DEV** button in the top-right navbar. It turns amber. In Dev Mode, the 1-day interval becomes 1 minute and the 3-day interval becomes 3 minutes.
3. **Do your first review** — newly added words are immediately due. Click *Review* in the nav. Work through the queue by clicking *Reveal* then choosing *Got It Right* or *Needs Work*.
4. **Watch the schedule** — back on *My Words* you'll see a "in 1m" or "in 3m" timestamp on each card.
5. **Advance a word manually** — in Dev Mode, each word card shows a **Skip** button that sets `nextReviewAt` to right now. Click it to force a word back into the review queue without waiting.
6. **Return to Review** after ~1 minute and the "Needs Work" words will be back in the queue.

---

## Architecture & Key Decisions

### Separation of Concerns

```
backend/
├── models/          # Mongoose schemas (Word.js)
├── services/
│   ├── dictionaryService.js      # All external API calls isolated here
│   └── spacedRepetitionService.js # Pure scheduling logic, no DB calls
├── controllers/
│   └── wordController.js         # Orchestrates service calls + DB
└── routes/
    └── wordRoutes.js             # Express route declarations only
```

Route handlers never touch the dictionary API directly — the controller calls `dictionaryService.fetchWordDefinition()`, which is independently testable and replaceable.

### Dev Mode Implementation

I chose **1 day = 1 minute** mapping over per-word "Skip" buttons alone, because it lets the full scheduler run with real intervals. The `devMode` boolean is passed from the React frontend in the review POST body, so the server applies the correct unit without a restart. A separate `/advance` endpoint also lets you push any individual card to "due now" for spot-testing.

### Spaced Repetition Schema

Each `Word` document stores:
- `nextReviewAt` — MongoDB `Date`; queried with `$lte: now` to find due cards
- `interval` — last interval in days (1 or 3)
- `repetitions`, `correctCount`, `incorrectCount` — for future SM-2 extension

The review queue endpoint is a simple `find({ nextReviewAt: { $lte: new Date() } })` — no in-memory filtering needed.

### State Management

React state is kept flat and co-located with the pages that own it (`useWords`, `useReview`). There is no global store — the app is small enough that prop drilling one level (from App → Page → Component) is cleaner than Context or Redux. The `dueCount` bubble in the Navbar is the only cross-page concern and is lifted to App via a stable `useCallback`.

### Error Handling

- `dictionaryService` distinguishes 404 (word not found) from network errors and sets a `statusCode` on the thrown error so the controller can respond with the right HTTP status.
- The frontend displays inline feedback per-component (add form, review card) rather than a global toast, keeping context close to the action.
- Duplicate words return 409 with a readable message.

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/words` | List all words |
| `POST` | `/api/words` | Add word (fetches definition) |
| `DELETE` | `/api/words/:id` | Remove word |
| `GET` | `/api/words/review` | Get words due now |
| `POST` | `/api/words/:id/review` | Submit result `{ result, devMode }` |
| `POST` | `/api/words/:id/advance` | Force word due immediately (dev) |
| `GET` | `/api/health` | Health check |
