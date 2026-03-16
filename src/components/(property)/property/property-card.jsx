"use client"
import React, { useEffect, useRef, useState } from 'react'
import DetailSearchCard from '../../ui/detail-search-card'
import { useGetAllPropertiesQuery, useLazySearchPropertiesQuery } from '@/service/propertyApi';
import PropertySearchBar from '../../ui/property-search-bar';
import PropertySearchFilterSidebar from '../property-search/property-search-filter-sidebar'
import SquareCard from './square-card';
import { Home, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const PropertyCard = ({ cards }) => {
    const searchParams = useSearchParams();
    const skipInitialEmptySearchRef = useRef(false);
    // Get all properties initially (no filters)
    const { data: allPropertiesData, isLoading: isLoadingAll } = useGetAllPropertiesQuery({ limit: 1000 });
    
    // Search API for when filters are applied
    const [triggerSearch, { data: searchData, isLoading: isSearching }] = useLazySearchPropertiesQuery();
    
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const itemsPerPage = 50; // Show 50 properties per page

    const [searchFilters, setSearchFilters] = useState({
        query: "",
        propertyType: "Any",
        activeTab: ""
    });
    const [sidebarFilters, setSidebarFilters] = useState({
        property_type: "Any",
        priceRange: [0, 100],
        bedrooms: "Any",
        bathrooms: "Any",
        possession_status: "Any",
        is_price_negotiable: "Any",
    });

    // Hydrate initial filters from hero-page redirect query params.
    useEffect(() => {
        const query = searchParams.get('query') || searchParams.get('location') || "";
        const paramPropertyType = searchParams.get('propertyType') || "Any";
        const paramActiveTab = searchParams.get('activeTab') || "";

        if (!query && paramPropertyType === "Any" && !paramActiveTab) return;

        // PropertySearchBar emits an initial empty onSearch on mount.
        // Preserve URL-applied filters by skipping that first empty callback.
        skipInitialEmptySearchRef.current = true;

        setSearchFilters((prev) => ({
            ...prev,
            query,
            propertyType: paramPropertyType,
            activeTab: paramActiveTab,
        }));

        if (paramPropertyType && paramPropertyType !== "Any") {
            setSidebarFilters((prev) => ({
                ...prev,
                property_type: paramPropertyType,
            }));
        }
    }, [searchParams]);

    // Determine which data to use based on whether filters are active
    const currentData = hasActiveFilters ? searchData : allPropertiesData;
    const isLoading = hasActiveFilters ? isSearching : isLoadingAll;

    // Apply filters when data arrives or filters change
    useEffect(() => {
        if (currentData?.data?.properties) {
            console.log("📦 Properties received:", currentData.data.properties.length, "| Has filters:", hasActiveFilters);
            applyClientSideFilters();
        }
    }, [currentData, searchFilters, sidebarFilters, hasActiveFilters]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchFilters, sidebarFilters]);

    // Check if filters should trigger API call
    useEffect(() => {
        checkAndApplyFilters();
    }, [searchFilters, sidebarFilters]);

    // Check if we have any filters that require API call
    const checkAndApplyFilters = () => {
        const apiFilters = {
            skip: 0,
            limit: 1000
        };

        let hasAPIFilters = false;

        // City filter from search query
        if (searchFilters.query?.trim()) {
            apiFilters.city = searchFilters.query.trim();
            hasAPIFilters = true;
        }

        // Property type - prioritize sidebar filter over search bar filter
        const propertyType = sidebarFilters.property_type !== "Any" 
            ? sidebarFilters.property_type 
            : searchFilters.propertyType !== "Any" 
            ? searchFilters.propertyType 
            : null;

        if (propertyType) {
            apiFilters.property_type = propertyType;
            hasAPIFilters = true;
        }

        // Price range filter - Convert from slider (0-100) to Crores, then to Rupees
        if (sidebarFilters.priceRange[0] > 0 || sidebarFilters.priceRange[1] < 100) {
            const minPriceCr = (sidebarFilters.priceRange[0] / 100) * 10; // Convert to Crores
            const maxPriceCr = (sidebarFilters.priceRange[1] / 100) * 10; // Convert to Crores
            
            // Convert Crores to Rupees (1 Cr = 10,000,000)
            apiFilters.min_price = minPriceCr * 10000000;
            apiFilters.max_price = maxPriceCr * 10000000;
            hasAPIFilters = true;
        }

        // Bedrooms filter
        if (sidebarFilters.bedrooms && sidebarFilters.bedrooms !== "Any") {
            const bedroomValue = sidebarFilters.bedrooms === "5+" ? 5 : parseInt(sidebarFilters.bedrooms);
            apiFilters.bedrooms = bedroomValue;
            hasAPIFilters = true;
        }

        // Bathrooms filter
        if (sidebarFilters.bathrooms && sidebarFilters.bathrooms !== "Any") {
            const bathroomValue = sidebarFilters.bathrooms === "5+" ? 5 : parseInt(sidebarFilters.bathrooms);
            apiFilters.bathrooms = bathroomValue;
            hasAPIFilters = true;
        }

        // Possession status filter
        if (sidebarFilters.possession_status && sidebarFilters.possession_status !== "Any") {
            apiFilters.possession_status = sidebarFilters.possession_status;
            hasAPIFilters = true;
        }

        // Price negotiable filter
        if (sidebarFilters.is_price_negotiable && sidebarFilters.is_price_negotiable !== "Any") {
            apiFilters.is_price_negotiable = sidebarFilters.is_price_negotiable === "Yes";
            hasAPIFilters = true;
        }

        // Listing status (Sell/Rent)
        if (searchFilters.activeTab && searchFilters.activeTab !== "reset") {
            apiFilters.status = searchFilters.activeTab;
            hasAPIFilters = true;
        }

        // Update state and trigger API if needed
        setHasActiveFilters(hasAPIFilters);

        if (hasAPIFilters) {
            console.log("🚀 API Filters Active - Calling /properties/search with:", apiFilters);
            
            triggerSearch(apiFilters)
                .unwrap()
                .then((result) => {
                    console.log("✅ Search API Response:", result?.data?.properties?.length, "properties");
                })
                .catch((error) => {
                    console.error("❌ Search API Error:", error);
                });
        } else {
            console.log("📋 No API filters - Using /current-properties data");
        }
    };

    // Apply client-side filters (for filters not supported by API)
    const applyClientSideFilters = () => {
        if (!currentData?.data?.properties) return;
        
        let result = [...currentData.data.properties];
        console.log("📊 Starting with:", result.length, "properties");

        // Active tab (buy/rent/project) - client-side only
        if (searchFilters.activeTab && searchFilters.activeTab !== "" && searchFilters.activeTab !== "reset") {
            result = result.filter((property) => property?.property_post_status === searchFilters.activeTab);
            console.log("After activeTab filter:", result.length, "| Tab:", searchFilters.activeTab);
        }

        // Apply 5+ filter logic for bedrooms (API gives >=5, we need to show all)
        if (sidebarFilters.bedrooms === "5+") {
            result = result.filter((property) => property?.bedrooms >= 5);
            console.log("After 5+ bedrooms filter:", result.length);
        }

        // Apply 5+ filter logic for bathrooms
        if (sidebarFilters.bathrooms === "5+") {
            result = result.filter((property) => property?.bathrooms >= 5);
            console.log("After 5+ bathrooms filter:", result.length);
        }

        // Possession status filter - client-side only
        if (sidebarFilters.possession_status && sidebarFilters.possession_status !== "Any") {
            result = result.filter((property) => property?.possession_status === sidebarFilters.possession_status);
            console.log("After possession status filter:", result.length);
        }

        // Price negotiable filter - client-side only
        if (sidebarFilters.is_price_negotiable && sidebarFilters.is_price_negotiable !== "Any") {
            const isNegotiable = sidebarFilters.is_price_negotiable === "Yes";
            result = result.filter((property) => property?.is_price_negotiable === isNegotiable);
            console.log("After negotiable filter:", result.length);
        }

        // Additional search query matching (title, project, builder) - since API only searches city
        if (searchFilters.query?.trim()) {
            const lowerQuery = searchFilters.query.toLowerCase();
            result = result.filter((property) =>
                property?.title?.toLowerCase().includes(lowerQuery) ||
                property?.city?.toLowerCase().includes(lowerQuery) ||
                property?.map_location?.toLowerCase().includes(lowerQuery) ||
                property?.map_address?.toLowerCase().includes(lowerQuery) ||
                property?.project_name?.toLowerCase().includes(lowerQuery) ||
                property?.builder_name?.toLowerCase().includes(lowerQuery)
            );
            console.log("After additional search filter:", result.length);
        }

        console.log("✨ Final filtered count:", result.length);
        setFilteredProperties(result);
    };

    // Handle search bar filters
    const handleSearchAndFilter = (query = "", propertyType = "Any", activeTab = "") => {
        if (
            skipInitialEmptySearchRef.current &&
            !query?.trim() &&
            propertyType === "Any" &&
            !activeTab
        ) {
            skipInitialEmptySearchRef.current = false;
            return;
        }

        skipInitialEmptySearchRef.current = false;

        setSearchFilters({
            query,
            propertyType,
            activeTab
        });
    };

    // Handle sidebar filter changes
    const handleSidebarFilterChange = (filters) => {
        setSidebarFilters(filters);
    };

    // Get active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (searchFilters.query) count++;
        if (searchFilters.propertyType !== "Any") count++;
        if (searchFilters.activeTab && searchFilters.activeTab !== "" && searchFilters.activeTab !== "reset") count++;
        if (sidebarFilters.property_type !== "Any") count++;
        if (sidebarFilters.bedrooms !== "Any") count++;
        if (sidebarFilters.bathrooms !== "Any") count++;
        if (sidebarFilters.possession_status !== "Any") count++;
        if (sidebarFilters.is_price_negotiable !== "Any") count++;
        if (sidebarFilters.priceRange[0] > 0 || sidebarFilters.priceRange[1] < 100) count++;
        return count;
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchFilters({ query: "", propertyType: "Any", activeTab: "" });
        setSidebarFilters({
            property_type: "Any",
            priceRange: [0, 100],
            bedrooms: "Any",
            bathrooms: "Any",
            possession_status: "Any",
            is_price_negotiable: "Any",
        });
        setCurrentPage(1);
    };

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
        <div className="property-search-gradient min-h-screen text-white md:pt-15">
            {/* Search Bar Section */}
            <PropertySearchBar onSearch={handleSearchAndFilter} />
            
            {/* Square Cards */}
            <SquareCard cards={cards} />
            
            {/* Filter Sidebar */}
            <PropertySearchFilterSidebar onFilterChange={handleSidebarFilterChange} />

            {/* Property Listing Section */}
            <div className="relative md:mx-28 px-4 sm:px-6 py-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold text-white'>All Properties on TRS</h1>
                        <p className='text-white/60 mt-2'>
                            {isLoading ? (
                                <span className="inline-block w-32 h-4 bg-white/10 animate-pulse rounded"></span>
                            ) : (
                                <>
                                    {filteredProperties.length > 0 ? (
                                        <>
                                            Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
                                        </>
                                    ) : (
                                        "No properties found"
                                    )}
                                    {getActiveFilterCount() > 0 && (
                                        <span className='ml-2 text-amber-400 font-medium'>
                                            ({getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied)
                                        </span>
                                    )}
                                </>
                            )}
                        </p>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-3">
                        <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-amber-400 cursor-pointer backdrop-blur-sm">
                            <option value="newest" className="bg-gray-900">Newest First</option>
                            <option value="price_low" className="bg-gray-900">Price: Low to High</option>
                            <option value="price_high" className="bg-gray-900">Price: High to Low</option>
                            <option value="area" className="bg-gray-900">Area: Largest First</option>
                        </select>
                    </div>
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <div className="w-full h-48 bg-white/10 animate-pulse rounded-xl mb-4" />
                                <div className="space-y-3">
                                    <div className="h-5 w-3/4 bg-white/10 animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-white/10 animate-pulse rounded" />
                                    <div className="h-px bg-white/10 my-3" />
                                    <div className="flex gap-4">
                                        <div className="h-8 w-20 bg-white/10 animate-pulse rounded-lg" />
                                        <div className="h-8 w-20 bg-white/10 animate-pulse rounded-lg" />
                                        <div className="h-8 w-20 bg-white/10 animate-pulse rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : currentProperties?.length === 0 ? (
                        <div className="col-span-full">
                            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                                <div className="w-24 h-24 bg-amber-400/20 rounded-full flex items-center justify-center mb-6">
                                    <Home className="w-12 h-12 text-amber-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No Properties Found</h3>
                                <p className="text-white/60 text-center max-w-md mb-8">
                                    We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                                </p>
                                <button 
                                    onClick={clearAllFilters}
                                    className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 font-semibold px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300 cursor-pointer"
                                >
                                    <SlidersHorizontal className="w-4 h-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Clear All Filters</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-white/10">
                        <p className="text-white/60 text-sm">
                            Page {currentPage} of {totalPages} ({filteredProperties.length} total properties)
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                                    currentPage === 1
                                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                                        : "bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>

                            <div className="flex items-center gap-1">
                                {getPageNumbers().map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page === '...' ? (
                                            <span className="px-3 py-2 text-white/50">...</span>
                                        ) : (
                                            <button
                                                onClick={() => handlePageChange(page)}
                                                className={`min-w-[40px] h-10 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                                    currentPage === page
                                                        ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 shadow-lg"
                                                        : "bg-white/10 text-white hover:bg-white/20"
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
                                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                                        : "bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                                }`}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-white/60 text-sm">Go to:</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                placeholder={currentPage}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= totalPages) {
                                            handlePageChange(page);
                                        }
                                    }
                                }}
                                className="w-16 h-10 bg-white/10 border border-white/20 rounded-xl text-center text-white font-medium focus:outline-none focus:border-amber-400 placeholder-white/50"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PropertyCard