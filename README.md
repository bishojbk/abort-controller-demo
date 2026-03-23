# AbortController Demo — Search with Request Cancellation

A practical React demo showing how to use the **AbortController API** to cancel in-flight HTTP requests when a user types in a search box. No more race conditions, no stale results.

## The Problem

When a user types fast in a search box, each keystroke fires a new API call. Without cancellation:

- Multiple requests fly out in parallel
- Slower requests can resolve **after** newer ones
- You get **stale results** flickering on screen — a classic race condition

## The Solution

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetchUsers(query, controller.signal)
    .then(setResults)
    .catch((err) => {
      if (err.name === "AbortError") return; // Expected — previous request cancelled
    });

  // Cleanup: abort when query changes or component unmounts
  return () => controller.abort();
}, [query]);
```

Each keystroke:
1. Creates a new `AbortController`
2. Passes its `signal` to the API call
3. React's cleanup function calls `controller.abort()` when the query changes
4. The previous in-flight request is cancelled instantly
5. Only the **latest** request resolves — no race conditions

## Demo

Type fast in the search box and watch:

- **Aborted Requests** counter goes up in real time
- Console logs show which requests were cancelled
- Only the final result renders — no flickering

## Project Structure

```
src/
├── fakeApi.ts      # Fake user API with random 200-2000ms delay
├── useSearch.ts    # Custom hook with AbortController logic
├── App.tsx         # Search UI with stats dashboard
└── App.css         # Dark theme styles
```

### Key Files

**`fakeApi.ts`** — Simulates a real API with random latency. Accepts an `AbortSignal` and rejects with `AbortError` when cancelled.

**`useSearch.ts`** — The core pattern. Creates an `AbortController` per effect run, passes the signal to the fake API, and aborts on cleanup. Tracks aborted request count for the demo.

**`App.tsx`** — Search input with live stats (results count, aborted requests, loading state) and a "How it works" explainer section.

## Run Locally

```bash
git clone https://github.com/bishojbk/abort-controller-demo.git
cd abort-controller-demo
npm install
npm run dev
```

Open http://localhost:5173 and start typing.

## When to Use AbortController

- Search-as-you-type / autocomplete
- Filtering data on every keystroke
- Tab switching that triggers API calls
- Component unmounting during pending requests
- Any scenario where a newer request makes an older one irrelevant

## Built With

- React 19
- TypeScript
- Vite

## License

MIT
