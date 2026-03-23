import { useState } from "react";
import { useSearch } from "./useSearch";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const { results, loading, error, abortedCount } = useSearch(query);

  return (
    <div className="app">
      <header>
        <h1>AbortController Demo</h1>
        <p className="subtitle">
          Type fast and watch previous requests get cancelled automatically
        </p>
      </header>

      <div className="search-container">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder='Try typing "engineer" or "alice" quickly...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {loading && <div className="spinner" />}
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{results.length}</span>
          <span className="stat-label">Results</span>
        </div>
        <div className="stat">
          <span className="stat-value aborted">{abortedCount}</span>
          <span className="stat-label">Aborted Requests</span>
        </div>
        <div className="stat">
          <span className="stat-value">{loading ? "..." : "idle"}</span>
          <span className="stat-label">Status</span>
        </div>
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="results">
        {results.map((user) => (
          <div key={user.id} className="user-card">
            <div className="avatar">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="role">{user.role}</p>
              <p className="email">{user.email}</p>
            </div>
          </div>
        ))}
        {!loading && query && results.length === 0 && (
          <p className="no-results">No users found for "{query}"</p>
        )}
      </div>

      <div className="explanation">
        <h2>How it works</h2>
        <div className="code-block">
          <pre>{`// Each keystroke triggers a new search
useEffect(() => {
  const controller = new AbortController();

  fetchUsers(query, controller.signal)
    .then(setResults)
    .catch(err => {
      if (err.name === 'AbortError') {
        // Previous request cancelled — expected!
        return;
      }
    });

  // Cleanup: abort when query changes
  return () => controller.abort();
}, [query]);`}</pre>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <p>User types a character — a new <code>AbortController</code> is created</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <p>The <code>signal</code> is passed to the fetch/API call</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <p>User types another character — React runs the cleanup function</p>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <p><code>controller.abort()</code> cancels the previous in-flight request</p>
          </div>
          <div className="step">
            <div className="step-num">5</div>
            <p>Only the latest request resolves — no race conditions!</p>
          </div>
        </div>
      </div>

      <footer>
        <p>Open the browser console to see abort logs in real time</p>
      </footer>
    </div>
  );
}

export default App;
