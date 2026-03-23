import { useState, useEffect, useRef } from "react";
import { searchUsers, type User } from "./fakeApi";

interface SearchState {
  results: User[];
  loading: boolean;
  error: string | null;
  abortedCount: number;
}

export function useSearch(query: string) {
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    abortedCount: 0,
  });

  // Track how many requests were aborted for the demo
  const abortedCountRef = useRef(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    // Don't search for empty queries
    if (!query.trim()) {
      setState((s) => ({ ...s, results: [], loading: false, error: null }));
      return;
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    setState((s) => ({ ...s, loading: true, error: null }));

    searchUsers(query, controller.signal)
      .then((results) => {
        // Only update state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setState((s) => ({ ...s, results, loading: false }));
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          // Request was aborted — this is expected, not an error
          abortedCountRef.current++;
          setState((s) => ({
            ...s,
            abortedCount: abortedCountRef.current,
          }));
          console.log(
            `[AbortController] Request for "${query}" was aborted (total aborted: ${abortedCountRef.current})`
          );
        } else {
          setState((s) => ({
            ...s,
            error: err.message,
            loading: false,
          }));
        }
      });

    // Cleanup: abort the request when query changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [query]);

  return state;
}
