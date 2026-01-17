"use client";
import { useEffect, useState } from "react";

function CitySearchInput({ filters, handleInputChange }) {
    const [allCities, setAllCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities");
                const data = await res.json();
                if (!data.error) {
                    const uniqueCities = Array.from(new Set(data.data.map(c => c.city)));
                    setAllCities(uniqueCities);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };

        fetchCities();
    }, []);

    const handleChange = (value) => {
        handleInputChange("city", value);
        if (value.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
        } else {
            const filtered = allCities.filter((city) =>
                city.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 10)); // limit suggestions
            setShowSuggestions(true);
        }
    };

    const handleSelect = (city) => {
        handleInputChange("city", city);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Search City"
                className="w-full px-2 text-sm py-2 border border-[#D0D5DD] rounded-md text-black focus:outline-none"
                value={filters.city}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onFocus={() => {
                    if (filters.city) setShowSuggestions(true);
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg max-h-40 overflow-auto">
                    {suggestions.map((city, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(city)}
                            className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CitySearchInput;
