"use client";

import { useState } from "react";

const DEFAULT_COLLECTION = "Members/FullData";

function WixTestPage() {
  const [collection, setCollection] = useState(DEFAULT_COLLECTION);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runTest = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/wix-data-test?collection=${encodeURIComponent(collection)}`
      );
      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Wix test failed");
      }

      setResult(data);
    } catch (err) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 text-[#F5EFE7]">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Wix Data Test</h1>
      <p className="text-[#F5EFE7]/70 mb-6">
        Run a quick query against Wix CMS and inspect the IDs and first item.
      </p>

      <div className="max-w-2xl space-y-4">
        <label className="block">
          <span className="text-sm text-[#F5EFE7]/70">Collection Name</span>
          <input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="mt-2 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/20 px-3 py-2"
            placeholder="Members/FullData"
          />
        </label>

        <button
          onClick={runTest}
          disabled={loading}
          className="rounded-md bg-[#212121] text-[#212121] px-4 py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Wix Query"}
        </button>

        {error && (
          <div className="rounded-md border border-[#C6A256]/30 bg-[#212121]/10 px-3 py-2 text-[#C6A256]">
            {error}
          </div>
        )}

        {result && (
          <pre className="rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 p-4 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}

export default WixTestPage;
