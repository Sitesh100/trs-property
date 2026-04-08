import DetailSearchCard from "../../ui/detail-search-card";
import { useState, useEffect } from "react";
import React from "react";
import { ChevronLeft, ChevronRight, Home, SlidersHorizontal } from 'lucide-react';

function PropertySearchListing({ properties, isLoading, setShowFilters }) {
    const [filter, setFilter] = useState("all");
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // 3 columns x 5 rows

    const normalizePossessionStatus = (value) => {
        if (!value) return "";
        const normalized = String(value).trim().toUpperCase();

        if (normalized === "READY_TO_MOVE" || normalized === "READY-TO-MOVE" || normalized === "EADY-TO-MOVE") {
            return "READY_TO_MOVE";
        }

        if (normalized === "UNDER_CONSTRUCTION" || normalized === "UNDER-CONSTRUCTION") {
            return "UNDER_CONSTRUCTION";
        }

        return normalized;
    };

    useEffect(() => {
        if (!properties || properties?.length === 0) {
            setFilteredProperties([]);
            return;
        }
        if (filter === "all") {
            setFilteredProperties(properties);
        } else if (filter === "ready") {
            setFilteredProperties(properties.filter(p => normalizePossessionStatus(p?.possession_status) === "READY_TO_MOVE"));
        } else if (filter === "development") {
            setFilteredProperties(properties.filter(p => normalizePossessionStatus(p?.possession_status) === "UNDER_CONSTRUCTION"));
        } else if (filter === "furnished") {
            setFilteredProperties(properties.filter(p => p.furnished === true));
        } else if (filter === "new_projects") {
            setFilteredProperties(properties.filter(p => p.is_new_project === true));
        } else {
            setFilteredProperties(properties);
        }
        // Reset to page 1 when filter changes
        setCurrentPage(1);
    }, [filter, properties]);

    const filterButtons = [
        { label: "All Properties", value: "all" },
        { label: "Ready to move", value: "ready" },
        { label: "Development", value: "development" },
        { label: "Furnished", value: "furnished" },
        { label: "New Projects", value: "new_projects" },
    ];

    // Pagination calculations
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProperties = filteredProperties.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F5EFE7]">
                        {isLoading ? "Loading..." : `${filteredProperties?.length} Properties found`}
                    </h2>
                    <p className='text-[#F5EFE7]/60 mt-2'>
                        {!isLoading && filteredProperties.length > 0 && (
                            <>Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties</>
                        )}
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden bg-[#F5EFE7]/10 border border-[#F5EFE7]/20 px-4 py-2 rounded-xl text-[#F5EFE7] flex items-center gap-2"
                        onClick={() => setShowFilters(true)}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                    </button>
                    <select className="bg-[#F5EFE7]/10 border border-[#F5EFE7]/20 rounded-xl px-4 py-2.5 text-sm font-medium text-[#F5EFE7] focus:outline-none focus:border-[#C6A256] cursor-pointer backdrop-blur-sm">
                        <option value="newest" className="bg-[#212121]">Newest First</option>
                        <option value="price_low" className="bg-[#212121]">Price: Low to High</option>
                        <option value="price_high" className="bg-[#212121]">Price: High to Low</option>
                        <option value="area" className="bg-[#212121]">Area: Largest First</option>
                    </select>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
                {filterButtons.map(btn => (
                    <button
                        key={btn.value}
                        className={`py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                            filter === btn.value 
                                ? "bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] shadow-lg" 
                                : "bg-[#F5EFE7]/10 text-[#F5EFE7] hover:bg-[#F5EFE7]/20"
                        }`}
                        onClick={() => setFilter(btn.value)}
                    >
                        {btn.label}
                    </button>
                ))}
                <button
                    className="bg-[#F5EFE7]/10 text-[#F5EFE7] hover:bg-[#F5EFE7]/20 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
                    onClick={() => setFilter("all")}
                >
                    Reset all
                </button>
            </div>

            {/* Property Grid - 3 cards per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="bg-[#F5EFE7]/10 backdrop-blur-sm p-4 rounded-2xl border border-[#F5EFE7]/10">
                            <div className="w-full h-48 bg-[#F5EFE7]/10 animate-pulse rounded-xl mb-4" />
                            <div className="space-y-3">
                                <div className="h-5 w-3/4 bg-[#F5EFE7]/10 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-[#F5EFE7]/10 animate-pulse rounded" />
                                <div className="h-px bg-[#F5EFE7]/10 my-3" />
                                <div className="flex gap-4">
                                    <div className="h-8 w-20 bg-[#F5EFE7]/10 animate-pulse rounded-lg" />
                                    <div className="h-8 w-20 bg-[#F5EFE7]/10 animate-pulse rounded-lg" />
                                    <div className="h-8 w-20 bg-[#F5EFE7]/10 animate-pulse rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : currentProperties?.length === 0 ? (
                    <div className="col-span-full">
                        <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#F5EFE7]/5 backdrop-blur-sm rounded-3xl border border-[#F5EFE7]/10">
                            <div className="w-24 h-24 bg-[#C6A256]/20 rounded-full flex items-center justify-center mb-6">
                                <Home className="w-12 h-12 text-[#C6A256]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#F5EFE7] mb-3">No Properties Found</h3>
                            <p className="text-[#F5EFE7]/60 text-center max-w-md mb-8">
                                Try adjusting your filters or search criteria to find more properties.
                            </p>
                            <button 
                                onClick={() => setFilter("all")}
                                className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] font-semibold px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(198, 162, 86, 0.5)] transition-all duration-300 cursor-pointer"
                            >
                                <span className="relative z-10">Clear All Filters</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    currentProperties.map((property, index) => (
                        <DetailSearchCard property={property} key={property?.id || index} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {!isLoading && filteredProperties.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-[#F5EFE7]/10">
                    <p className="text-[#F5EFE7]/60 text-sm">
                        Page {currentPage} of {totalPages} ({filteredProperties.length} total properties)
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                                currentPage === 1
                                    ? "bg-[#F5EFE7]/5 text-[#F5EFE7]/30 cursor-not-allowed"
                                    : "bg-[#F5EFE7]/10 text-[#F5EFE7] hover:bg-[#F5EFE7]/20 cursor-pointer"
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) => (
                                <React.Fragment key={index}>
                                    {page === '...' ? (
                                        <span className="px-3 py-2 text-[#F5EFE7]/50">...</span>
                                    ) : (
                                        <button
                                            onClick={() => handlePageChange(page)}
                                            className={`min-w-[40px] h-10 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                                currentPage === page
                                                    ? "bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] shadow-lg"
                                                    : "bg-[#F5EFE7]/10 text-[#F5EFE7] hover:bg-[#F5EFE7]/20"
                                            } cursor-pointer`}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                                currentPage === totalPages
                                    ? "bg-[#F5EFE7]/5 text-[#F5EFE7]/30 cursor-not-allowed"
                                    : "bg-[#F5EFE7]/10 text-[#F5EFE7] hover:bg-[#F5EFE7]/20 cursor-pointer"
                            }`}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[#F5EFE7]/60 text-sm">Go to:</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            placeholder={currentPage.toString()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const page = parseInt(e.target.value);
                                    if (page >= 1 && page <= totalPages) {
                                        handlePageChange(page);
                                    }
                                }
                            }}
                            className="w-16 h-10 bg-[#F5EFE7]/10 border border-[#F5EFE7]/20 rounded-xl text-center text-[#F5EFE7] font-medium focus:outline-none focus:border-[#C6A256] placeholder-[#F5EFE7]/50"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertySearchListing;