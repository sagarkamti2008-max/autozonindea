import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BackendAPI } from '../services/backendAPI';

/**
 * LiveSearchView – a minimal real‑time search UI that displays matching product names.
 * It queries the in‑memory store via BackendAPI.searchProducts and updates the list as
 * the user types. Designed for fast UX with debounced input.
 */
export default function LiveSearchView() {
  const { products, setSearchQuery } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Simple debounce to avoid excessive calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query) {
        setResults([]);
        return;
      }
      // Directly use BackendAPI – it works on the current StoreState
      const response = BackendAPI.searchProducts?.(query, { products }) || { success: false };
      if (response.success) {
        setResults(response.data.results);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query, products]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 flex flex-col items-center px-4">
      <h1 className="text-3xl font-bold mb-6">Live Product Search</h1>
      <input
        type="text"
        placeholder="Start typing a product name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-xl bg-slate-800 border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      {results.length > 0 && (
        <ul className="w-full max-w-xl mt-4 space-y-2">
          {results.map((name, idx) => (
            <li
              key={idx}
              className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer"
              onClick={() => {
                setSearchQuery(name);
                // Optionally navigate to catalog view
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
      {query && results.length === 0 && (
        <p className="mt-4 text-slate-400">No matching products found.</p>
      )}
    </div>
  );
}
