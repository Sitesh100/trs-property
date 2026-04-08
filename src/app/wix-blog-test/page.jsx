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
    <main className="container mx-auto px-4 py-10 text-[#F5EFE7]">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Wix Blog Test</h1>
      <p className="text-[#F5EFE7]/70 mb-6">
        Fetch sample blog posts, categories, and tags to validate API-key access.
      </p>

      <div className="max-w-2xl space-y-4">
        <label className="block">
          <span className="text-sm text-[#F5EFE7]/70">Items Per Section</span>
          <input
            value={limit}
            type="number"
            min="1"
            max="50"
            onChange={(e) => setLimit(e.target.value)}
            className="mt-2 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/20 px-3 py-2"
          />
        </label>

        <button
          onClick={runBlogTest}
          disabled={loading}
          className="rounded-md bg-[#212121] text-[#212121] px-4 py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Blog Test"}
        </button>

        {error && (
          <div className="rounded-md border border-[#C6A256]/30 bg-[#212121]/10 px-3 py-2 text-[#C6A256]">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 max-w-7xl">
            <div className="grid gap-4 md:grid-cols-2">
              {(result?.posts || []).map((post) => (
                <article
                  key={post.id}
                  className="rounded-md border border-[#F5EFE7]/20 bg-[#212121] overflow-hidden"
                >
                  {post?.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title || "Blog image"}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-44 w-full grid place-items-center text-xs text-[#F5EFE7]/60 bg-[#F5EFE7]/5 px-3 text-center">
                      No image found in API response
                    </div>
                  )}

                  <div className="p-3 space-y-1">
                    <h3 className="text-sm font-semibold line-clamp-2">{post?.title}</h3>
                    <p className="text-[11px] text-[#F5EFE7]/60 break-all">
                      imageUrl: {post?.imageUrl || "(empty)"}
                    </p>
                    {post?.imageFoundInFullPost && (
                      <p className="text-[11px] text-[#C6A256]">
                        Image found via full post fetch fallback
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <pre className="rounded-md border max-w-7xl border-[#F5EFE7]/20 bg-[#212121] p-4 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}

export default WixBlogTestPage;
