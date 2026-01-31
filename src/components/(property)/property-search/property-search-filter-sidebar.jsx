"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Bed, Bath, IndianRupee, Calendar,
  ChevronDown, X, SlidersHorizontal,
  Building2, LandPlot, Store, Grid3X3, Check,
  Search, HandCoins, RotateCcw
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

function PropertySearchFilterSidebar({ showFilters, setShowFilters, onFilterChange }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    property_type: "Any",
    property_purpose: "Any",
    priceRange: [0, 100],
    bedrooms: "Any",
    bathrooms: "Any",
    possession_status: "Any",
    is_price_negotiable: "Any",
  });

  const dropdownRef = useRef(null);

  const propertyTypes = [
    { value: "Any", label: "Any Type", icon: Grid3X3 },
    { value: "flat_apartment", label: "Apartment", icon: Building2 },
    { value: "villa", label: "Villa", icon: Home },
    { value: "plot", label: "Plot", icon: LandPlot },
    { value: "commercial", label: "Commercial", icon: Store },
  ];

  const possessionStatuses = [
    { value: "Any", label: "Any Status" },
    { value: "ready_to_move", label: "Ready to Move" },
    { value: "under_construction", label: "Under Construction" },
  ];

  const priceNegotiableOptions = [
    { value: "Any", label: "Any" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      property_type: "Any",
      property_purpose: "Any",
      priceRange: [0, 100],
      bedrooms: "Any",
      bathrooms: "Any",
      possession_status: "Any",
      is_price_negotiable: "Any",
    };
    setFilters(defaultFilters);
    setActiveDropdown(null);
  };

  const formatPrice = (percentage) => {
    const price = (percentage / 100) * 10;
    return `₹${price.toFixed(1)}Cr`;
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.property_type !== "Any") count++;
    if (filters.bedrooms !== "Any") count++;
    if (filters.bathrooms !== "Any") count++;
    if (filters.possession_status !== "Any") count++;
    if (filters.is_price_negotiable !== "Any") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++;
    return count;
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  const isFilterActive = (filterName, value = null) => {
    if (filterName === "price") {
      return filters.priceRange[0] > 0 || filters.priceRange[1] < 100;
    }
    return value ? filters[filterName] === value : filters[filterName] !== "Any";
  };

  return (
    // Same width and padding as search bar
    <div ref={dropdownRef} className="relative md:mx-28 px-4 sm:px-6">
      {/* Main Horizontal Filter Bar - Same width as search bar */}
      <div className="property-gradient rounded-2xl shadow-xl border border-[#492974]/20 p-4 md:p-5">
        
        <div className="flex flex-wrap items-center justify-center gap-3">

          {/* Property Type */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDropdown("property_type")}
              className={`flex items-center gap-2 w-44 px-4 py-3 rounded-full transition-all duration-300 border-2 ${
                activeDropdown === "property_type" || isFilterActive("property_type")
                  ? "bg-amber-400/20 text-white border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/50"
              }`}
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm truncate flex-1">
                {filters.property_type === "Any" 
                  ? "Property Type" 
                  : propertyTypes.find(t => t.value === filters.property_type)?.label}
              </span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${activeDropdown === "property_type" ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {activeDropdown === "property_type" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 filter-dropdown rounded-2xl p-3 z-50"
                >
                  <div className="space-y-1">
                    {propertyTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          handleInputChange("property_type", type.value);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          filters.property_type === type.value
                            ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-md"
                            : "hover:bg-white/10 text-white/80"
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{type.label}</span>
                        {filters.property_type === type.value && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDropdown("bedrooms")}
              className={`flex items-center gap-2 min-w-[140px] px-4 py-3 rounded-full transition-all duration-300 border-2 ${
                activeDropdown === "bedrooms" || isFilterActive("bedrooms")
                  ? "bg-amber-400/20 text-white border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/50"
              }`}
            >
              <Bed className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">
                {filters.bedrooms === "Any" ? "Bedrooms" : `${filters.bedrooms} BHK`}
              </span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${activeDropdown === "bedrooms" ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {activeDropdown === "bedrooms" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 filter-dropdown rounded-2xl p-4 z-50"
                >
                  <p className="text-xs text-white/50 mb-3 font-medium uppercase tracking-wide">Select Bedrooms</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Any", "1", "2", "3", "4", "5+"].map((b) => (
                      <motion.button
                        key={b}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange("bedrooms", b)}
                        className={`py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          filters.bedrooms === b
                            ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                            : "bg-white/10 hover:bg-white/20 text-white/80"
                        }`}
                      >
                        {b}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bathrooms */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDropdown("bathrooms")}
              className={`flex items-center gap-2 min-w-[140px] px-4 py-3 rounded-full transition-all duration-300 border-2 ${
                activeDropdown === "bathrooms" || isFilterActive("bathrooms")
                  ? "bg-amber-400/20 text-white border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/50"
              }`}
            >
              <Bath className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">
                {filters.bathrooms === "Any" ? "Bathrooms" : `${filters.bathrooms} Bath`}
              </span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${activeDropdown === "bathrooms" ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {activeDropdown === "bathrooms" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 filter-dropdown rounded-2xl p-4 z-50"
                >
                  <p className="text-xs text-white/50 mb-3 font-medium uppercase tracking-wide">Select Bathrooms</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Any", "1", "2", "3", "4", "5+"].map((b) => (
                      <motion.button
                        key={b}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange("bathrooms", b)}
                        className={`py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          filters.bathrooms === b
                            ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                            : "bg-white/10 hover:bg-white/20 text-white/80"
                        }`}
                      >
                        {b}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Budget */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDropdown("price")}
              className={`flex items-center gap-2 min-w-[130px] px-4 py-3 rounded-full transition-all duration-300 border-2 ${
                activeDropdown === "price" || isFilterActive("price")
                  ? "bg-amber-400/20 text-white border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/50"
              }`}
            >
              <IndianRupee className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">
                {filters.priceRange[0] === 0 && filters.priceRange[1] === 100
                  ? "Budget"
                  : `${formatPrice(filters.priceRange[0])}-${formatPrice(filters.priceRange[1])}`}
              </span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${activeDropdown === "price" ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {activeDropdown === "price" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 filter-dropdown rounded-2xl p-5 z-50"
                >
                  <p className="text-xs text-white/50 mb-4 font-medium uppercase tracking-wide">Select Budget Range</p>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleInputChange("priceRange", value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1.5 bg-amber-400/20 text-amber-400 rounded-lg font-semibold text-sm border border-amber-400/50">
                      {formatPrice(filters.priceRange[0])}
                    </span>
                    <span className="text-white/40 text-sm">to</span>
                    <span className="px-3 py-1.5 bg-amber-400/20 text-amber-400 rounded-lg font-semibold text-sm border border-amber-400/50">
                      {formatPrice(filters.priceRange[1])}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Possession */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDropdown("possession")}
              className={`flex items-center gap-2 min-w-[120px] px-4 py-3 rounded-full transition-all duration-300 border-2 ${
                activeDropdown === "possession" || isFilterActive("possession_status")
                  ? "bg-amber-400/20 text-white border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/50"
              }`}
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">
                {filters.possession_status === "Any"
                  ? "Status"
                  : filters.possession_status === "ready_to_move" ? "Ready" : "UC"}
              </span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${activeDropdown === "possession" ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {activeDropdown === "possession" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 filter-dropdown rounded-2xl p-3 z-50"
                >
                  <div className="space-y-1">
                    {possessionStatuses.map((status) => (
                      <motion.button
                        key={status.value}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          handleInputChange("possession_status", status.value);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          filters.possession_status === status.value
                            ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-md"
                            : "hover:bg-white/10 text-white/80"
                        }`}
                      >
                        <span className="font-medium text-sm">{status.label}</span>
                        {filters.possession_status === status.value && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Negotiable */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDropdown("negotiable")}
              className={`flex items-center gap-2 min-w-[130px] px-4 py-3 rounded-full transition-all duration-300 border-2 ${
                activeDropdown === "negotiable" || isFilterActive("is_price_negotiable")
                  ? "bg-amber-400/20 text-white border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/50"
              }`}
            >
              <HandCoins className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">
                {filters.is_price_negotiable === "Any" ? "Negotiable" : filters.is_price_negotiable}
              </span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${activeDropdown === "negotiable" ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {activeDropdown === "negotiable" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 filter-dropdown rounded-2xl p-3 z-50"
                >
                  <div className="space-y-1">
                    {priceNegotiableOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          handleInputChange("is_price_negotiable", option.value);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          filters.is_price_negotiable === option.value
                            ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-md"
                            : "hover:bg-white/10 text-white/80"
                        }`}
                      >
                        <span className="font-medium text-sm">{option.label}</span>
                        {filters.is_price_negotiable === option.value && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Filters Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleDropdown("all")}
            className="group relative overflow-hidden flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full font-semibold text-sm shadow-lg border border-amber-300/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-white" />
            <span className="relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-white whitespace-nowrap">More Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="relative z-10 bg-gray-900 text-amber-400 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </motion.button>

          {/* Reset Button - Always Visible */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetFilters}
            className="group relative overflow-hidden flex items-center gap-2 px-4 py-3 border-2 border-white/20 hover:border-red-400/50 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.3)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 relative z-10 text-white/70 transition-all duration-300 group-hover:text-red-400 group-hover:rotate-[-45deg]" />
            <span className="relative z-10 text-white/70 transition-colors duration-300 group-hover:text-red-400 whitespace-nowrap">Reset</span>
          </motion.button>
        </div>
      </div>

      {/* ========== ALL FILTERS POPUP MODAL ========== */}
      <AnimatePresence>
        {activeDropdown === "all" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDropdown(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[85vh] md:mt-8 founder-gradient rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-amber-400/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-8 pb-4 border-b border-amber-400/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-xl flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Filters</h2>
                    <p className="text-sm text-white/60">Refine your property search</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDropdown(null)}
                  className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-8">
                <div className="space-y-8">

                  {/* Property Type */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Home className="w-4 h-4 text-amber-400" />
                      Property Type
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((type) => (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInputChange("property_type", type.value)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            filters.property_type === type.value
                              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Bedrooms & Bathrooms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bedrooms */}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Bed className="w-4 h-4 text-amber-400" />
                        Bedrooms
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {["Any", "1", "2", "3", "4", "5+"].map((b) => (
                          <motion.button
                            key={b}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleInputChange("bedrooms", b)}
                            className={`w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
                              filters.bedrooms === b
                                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                                : "bg-white/10 text-white/80 hover:bg-white/20"
                            }`}
                          >
                            {b}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Bath className="w-4 h-4 text-amber-400" />
                        Bathrooms
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {["Any", "1", "2", "3", "4", "5+"].map((b) => (
                          <motion.button
                            key={b}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleInputChange("bathrooms", b)}
                            className={`w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
                              filters.bathrooms === b
                                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                                : "bg-white/10 text-white/80 hover:bg-white/20"
                            }`}
                          >
                            {b}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-amber-400" />
                      Budget Range
                    </h3>
                    <div className="bg-white/5 rounded-2xl p-5 border border-amber-400/20">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleInputChange("priceRange", value)}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full mb-6"
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-xs text-white/50 mb-1">Min Budget</p>
                          <p className="text-lg font-bold text-amber-400">{formatPrice(filters.priceRange[0])}</p>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-amber-400/30 mx-4"></div>
                        <div className="text-center">
                          <p className="text-xs text-white/50 mb-1">Max Budget</p>
                          <p className="text-lg font-bold text-amber-400">{formatPrice(filters.priceRange[1])}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Possession Status */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Possession Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {possessionStatuses.map((status) => (
                        <motion.button
                          key={status.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInputChange("possession_status", status.value)}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            filters.possession_status === status.value
                              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          {status.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Price Negotiable */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <HandCoins className="w-4 h-4 text-amber-400" />
                      Price Negotiable
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {priceNegotiableOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInputChange("is_price_negotiable", option.value)}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            filters.is_price_negotiable === option.value
                              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-amber-400/20 bg-black/30">
                {/* Reset All Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                  className="group relative overflow-hidden flex items-center gap-2 px-6 py-2.5 border-2 border-red-400/50 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.3)] hover:border-red-400"
                >
                  <RotateCcw className="w-4 h-4 relative z-10 text-red-400 transition-all duration-300 group-hover:text-white group-hover:rotate-[-45deg]" />
                  <span className="relative z-10 text-red-400 transition-colors duration-300 group-hover:text-white">
                    Reset All
                  </span>
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </motion.button>

                <div className="flex items-center gap-3">
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-sm text-white/60">
                      {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                    </span>
                  )}
                  
                  {/* Show Properties Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveDropdown(null)}
                    className="group relative overflow-hidden flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full font-semibold text-sm shadow-lg border border-amber-300/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer"
                  >
                    <Search className="w-4 h-4 relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-white" />
                    <span className="relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-white">
                      Show Properties
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PropertySearchFilterSidebar;