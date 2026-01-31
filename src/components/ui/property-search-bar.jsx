"use client";
import { ChevronDown, Search, X, ShoppingBag, Key, Layers, RotateCcw, Grid3X3 } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

function PropertySearchBar({ onSearch }) {
    const router = useRouter();
    const [propertyType, setPropertyType] = useState("Any");
    const [activeTab, setActiveTab] = useState(""); // Default to empty (ALL)
    const [searchQuery, setSearchQuery] = useState("");
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Tab configuration - Added "ALL" as first option
    const tabs = [
        { value: "", label: "ALL", icon: Grid3X3 },
        { value: "buy", label: "BUY", icon: ShoppingBag },
        { value: "rent", label: "RENT", icon: Key },
        { value: "project", label: "PROJECT", icon: Layers },
        { value: "reset", label: "RESET", icon: RotateCcw },
    ];

    // Fetch city suggestions from API
    const fetchCities = async (query) => {
        if (!query || query.length < 2) {
            setCitySuggestions([]);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/cities?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            setCitySuggestions(data?.cities || data?.data || data || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error fetching cities:", error);
            setCitySuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced city search
    const debouncedCitySearch = useMemo(() => 
        debounce((query) => {
            fetchCities(query);
        }, 300), 
    []);

    // Debounced main search
    const debouncedSearch = useMemo(() =>
        debounce((query, type, tab) => {
            if (onSearch) {
                onSearch(query, type, tab);
            }
        }, 500), [onSearch]);

    useEffect(() => {
        debouncedSearch(searchQuery, propertyType, activeTab);
        return () => debouncedSearch.cancel();
    }, [searchQuery, propertyType, activeTab]);

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedCitySearch(value);
    };

    // Handle city selection
    const handleCitySelect = (city) => {
        const cityName = typeof city === 'string' ? city : city?.name || city?.city || city?.label;
        setSearchQuery(cityName);
        setShowSuggestions(false);
        setCitySuggestions([]);
    };

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current && 
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery, propertyType, activeTab);
            router.push("/property-search");
        }
        setShowSuggestions(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
        if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        setPropertyType("Any");
        setActiveTab(""); // Reset to ALL
        setCitySuggestions([]);
        setShowSuggestions(false);
        if (onSearch) {
            onSearch("", "Any", "");
        }
    };

    const handleTabClick = (tabValue) => {
        if (tabValue === "reset") {
            handleClear();
        } else {
            setActiveTab(tabValue);
        }
    };

    const hasActiveFilters = searchQuery || propertyType !== "Any" || (activeTab !== "" && activeTab !== "reset");

    return (
        <div className="relative md:mx-28 md:bottom-[40px] md:py-0 py-5 px-4 sm:px-6 mt-[-3px]">
            <div className="h-full flex flex-col">
                <div className="max-w-7xl w-full">
                    {/* Tabs */}
                    <div className="flex w-full md:justify-start justify-between md:flex-nowrap flex-nowrap">
                        {tabs.map((tab, index) => {
                            const isActive = tab.value === "reset" ? false : activeTab === tab.value;
                            const isReset = tab.value === "reset";
                            const Icon = tab.icon;
                            
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabClick(tab.value)}
                                    className={`
                                        group relative z-20 flex items-center justify-center gap-2
                                        px-2 py-2 md:px-6 md:py-3
                                        flex-1 md:flex-none md:w-28 
                                        text-[9px] md:text-sm font-bold 
                                        transition-all duration-300 cursor-pointer
                                        overflow-hidden
                                        ${index === 0 ? "rounded-tl-2xl" : ""}
                                        ${index === tabs.length - 1 ? "rounded-tr-2xl" : ""}
                                        ${isActive 
                                            ? "bg-gray-900 text-white shadow-lg" 
                                            : isReset
                                                ? "bg-white text-red-500"
                                                : "bg-white text-gray-700"
                                        }
                                    `}
                                >
                                    {/* Gradient Hover Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? "hidden" : ""}`}></div>
                                    
                                    {/* Icon - Desktop only */}
                                    <Icon className={`hidden md:block w-4 h-4 relative z-10 transition-transform duration-300 ${isReset ? "group-hover:rotate-[-45deg]" : ""} ${!isActive ? "group-hover:text-gray-900" : ""}`} />
                                    
                                    {/* Text - Always visible */}
                                    <span className={`relative z-10 whitespace-nowrap ${!isActive ? "group-hover:text-gray-900" : ""}`}>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Search Bar Section - WHITE BACKGROUND */}
            <div className="bg-white md:py-6 py-4 rounded-b-2xl rounded-tl-none rounded-tr-none shadow-xl border border-gray-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-5">
                    <div className="flex flex-row gap-4 items-stretch">
                        
                        {/* Property Type Dropdown */}
                        <div className="w-full md:w-1/4 md:block hidden">
                            <div className="relative border-r-2 border-gray-200">
                                <select
                                    className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 outline-0 rounded-xl appearance-none cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 focus:bg-gray-100 focus:border-amber-400"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    <option value="Any" className="bg-white text-gray-900">Choose Property Type</option>
                                    <option value="flat_apartment" className="bg-white text-gray-900">Flat Apartment</option>
                                    <option value="villa" className="bg-white text-gray-900">House Villa</option>
                                    <option value="builder" className="bg-white text-gray-900">Builder Floor</option>
                                    <option value="plot" className="bg-white text-gray-900">Plot</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-600 pointer-events-none" />
                            </div>
                        </div>

                        {/* Main Search Input */}
                        <div className="md:w-2/3 w-full relative">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search by title, city, project name or builder name"
                                    className="w-full p-4 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-2xl border border-gray-200 outline-none shadow-sm focus:border-amber-400 focus:bg-white transition-all duration-300"
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyPress}
                                    onFocus={() => {
                                        if (citySuggestions.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                />
                                
                                {/* Loading indicator */}
                                {isLoading && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-400 rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            {/* City Suggestions Dropdown */}
                            {showSuggestions && citySuggestions.length > 0 && (
                                <div 
                                    ref={suggestionsRef}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-64 overflow-y-auto z-50"
                                >
                                    {citySuggestions.map((city, index) => {
                                        const cityName = typeof city === 'string' ? city : city?.name || city?.city || city?.label;
                                        const cityState = typeof city === 'object' ? city?.state || city?.region : '';
                                        
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleCitySelect(city)}
                                                className="group w-full px-4 py-3 text-left transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0 relative overflow-hidden"
                                            >
                                                {/* Gradient Hover Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                                
                                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                                                    <span className="text-amber-600 text-sm">📍</span>
                                                </div>
                                                <div className="relative z-10">
                                                    <p className="text-gray-900 font-medium">{cityName}</p>
                                                    {cityState && (
                                                        <p className="text-gray-500 text-sm">{cityState}</p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Search Button with Gradient Hover */}
                        <div className="w-auto flex-shrink-0">
                            <button
                                onClick={handleSearch}
                                className="group relative overflow-hidden w-14 h-14 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-105"
                            >
                                <Search className="h-6 w-6 relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-white" />
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </button>
                        </div>

                        {/* Reset Button with Gradient Hover */}
                        <div className="w-auto flex-shrink-0">
                            <button
                                onClick={handleClear}
                                className={`group relative overflow-hidden w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer border-2 ${
                                    hasActiveFilters 
                                        ? "border-red-400 bg-red-50" 
                                        : "border-gray-200 bg-gray-50"
                                }`}
                            >
                                {/* Gradient Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <RotateCcw className={`h-5 w-5 relative z-10 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:text-gray-900 ${
                                    hasActiveFilters ? "text-red-500" : "text-gray-600"
                                }`} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Filter Tags with Gradient Hover */}
                    <div className="flex flex-wrap gap-2 mt-4 md:pl-2">
                        {["Apartment", "Villa", "Plot", "Commercial"].map((tag) => {
                            const isActive = propertyType === tag.toLowerCase().replace(" ", "_");
                            return (
                                <button
                                    key={tag}
                                    onClick={() => setPropertyType(tag.toLowerCase().replace(" ", "_"))}
                                    className={`group relative overflow-hidden px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                                        isActive
                                            ? "bg-amber-400 text-gray-900 border-amber-400"
                                            : "bg-white text-gray-700 border-gray-200"
                                    }`}
                                >
                                    {/* Gradient Hover Overlay */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                                    )}
                                    
                                    <span className={`relative z-10 ${!isActive ? "group-hover:text-gray-900" : ""}`}>{tag}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertySearchBar;