"use client";

import { useState } from "react";

function WixBlogTestPage() {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runBlogTest = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/wix-blog-test?limit=${encodeURIComponent(limit)}`
      );
      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Wix blog test failed");
      }

      setResult(data);
    } catch (err) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Wix Blog Test</h1>
      <p className="text-white/70 mb-6">
        Fetch sample blog posts, categories, and tags to validate API-key access.
      </p>

      <div className="max-w-2xl space-y-4">
        <label className="block">
          <span className="text-sm text-white/70">Items Per Section</span>
          <input
            value={limit}
            type="number"
            min="1"
            max="50"
            onChange={(e) => setLimit(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/20 bg-black/20 px-3 py-2"
          />
        </label>

        <button
          onClick={runBlogTest}
          disabled={loading}
          className="rounded-md bg-amber-500 text-black px-4 py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Blog Test"}
        </button>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-200">
            {error}
          </div>
        )}

        {result && (
          <pre className="rounded-md border border-white/20 bg-black/30 p-4 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}

export default WixBlogTestPage;
