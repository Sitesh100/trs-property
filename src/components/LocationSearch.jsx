"use client";

import { useEffect, useRef, useState } from "react";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export default function LocationSearch({
  value = "",
  onSelect,
  onQueryChange,
  placeholder = "Search address",
  className = "",
  inputClassName = "",
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || trimmedQuery.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const url = `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(trimmedQuery)}&format=json&addressdetails=1&limit=5`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch location suggestions");
        }

        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (suggestion) => {
    const selectedAddress = suggestion?.display_name || "";
    const latitude = suggestion?.lat ? Number.parseFloat(suggestion.lat) : null;
    const longitude = suggestion?.lon ? Number.parseFloat(suggestion.lon) : null;

    setQuery(selectedAddress);
    setShowSuggestions(false);
    setSuggestions([]);

    if (onSelect) {
      onSelect({
        address: selectedAddress,
        latitude,
        longitude,
        raw: suggestion,
      });
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          if (onQueryChange) {
            onQueryChange(nextValue);
          }
        }}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={inputClassName}
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#F5EFE7]">
          Searching...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded border border-[#212121] bg-[#212121] shadow-lg">
          {suggestions.map((item) => (
            <li key={item.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2 text-left text-sm text-[#F5EFE7]/80 hover:bg-[#212121]"
              >
                {item.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
