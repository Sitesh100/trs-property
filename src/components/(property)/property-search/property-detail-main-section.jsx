"use client"
import { useEffect, useState } from "react"
import PropertySearchFilterSidebar from "./property-search-filter-sidebar"
import PropertySearchListing from "./property-search-listing"
import { useLazySearchPropertiesQuery } from "@/service/propertyApi"
import PropertySearchBar from "../../ui/property-search-bar"

function PropertyDetailMainSection() {
    const [showFilters, setShowFilters] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    
    // Lazy search query - manually trigger API calls
    const [triggerSearch, { data, isLoading }] = useLazySearchPropertiesQuery()
    
    const [filteredProperties, setFilteredProperties] = useState([])
    const [clientFilters, setClientFilters] = useState({})

    const normalizePossessionStatus = (value) => {
        if (!value || value === "Any") return "Any";
        const normalized = String(value).trim().toUpperCase();

        if (normalized === "READY_TO_MOVE" || normalized === "READY-TO-MOVE" || normalized === "EADY-TO-MOVE") {
            return "READY_TO_MOVE";
        }

        if (normalized === "UNDER_CONSTRUCTION" || normalized === "UNDER-CONSTRUCTION") {
            return "UNDER_CONSTRUCTION";
        }

        return normalized;
    }

    // Initial load - fetch all properties
    useEffect(() => {
        console.log('🔄 Initial load - fetching all properties');
        triggerSearch({ skip: 0, limit: 1000 });
    }, []);

    useEffect(() => {
        if (data?.data?.properties) {
            console.log('📦 Received properties:', data.data.properties.length);
            // Apply client-side filters if needed (for advanced filters not supported by API)
            applyClientSideFilters(data?.data?.properties, clientFilters)
        }
    }, [data, clientFilters]);

    function applyClientSideFilters(properties, filters) {
        let result = [...properties];

        // Apply possession status filter (client-side only)
        if (filters.possession_status && filters.possession_status !== "Any") {
            const selectedStatus = normalizePossessionStatus(filters.possession_status);
            result = result.filter(
                (property) => normalizePossessionStatus(property?.possession_status) === selectedStatus
            );
        }

        // Apply price negotiable filter (client-side only)
        if (filters.is_price_negotiable && filters.is_price_negotiable !== "Any") {
            const negotiable = filters.is_price_negotiable === "Yes";
            result = result.filter((property) => property?.is_price_negotiable === negotiable);
        }

        // Apply amenities filter (client-side only)
        if (filters.amenities && filters.amenities.length > 0) {
            result = result.filter((property) =>
                filters.amenities.every((amenity) => property?.amenities?.includes(amenity))
            );
        }

        // Apply property post status filter (client-side only)
        if (filters.activeTab && filters.activeTab !== "reset") {
            result = result.filter((property) => property?.property_post_status === filters.activeTab);
        }

        setFilteredProperties(result);
    }

    function applyFilters(filters, searchText = searchQuery, activeTab = "") {
        console.log('🔍 applyFilters called with:', { filters, searchText, activeTab });
        
        // Prepare API filters
        const apiFilters = {
            skip: 0,
            limit: 1000
        };

        // City filter - combine with search text
        if (filters.city && filters.city.trim() !== "") {
            apiFilters.city = filters.city.trim();
        } else if (searchText && searchText.trim() !== "") {
            apiFilters.city = searchText.trim();
        }

        // Property type filter
        if (filters.property_type && filters.property_type !== "Any") {
            apiFilters.property_type = filters.property_type;
        }

        // Price range filter
        if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 100)) {
            apiFilters.min_price = (filters.priceRange[0] / 100) * 10; // Convert to Cr
            apiFilters.max_price = (filters.priceRange[1] / 100) * 10; // Convert to Cr
        }

        // Bedrooms filter
        if (filters.bedrooms && filters.bedrooms !== "Any") {
            apiFilters.bedrooms = Number.parseInt(filters.bedrooms);
        }

        // Bathrooms filter
        if (filters.bathrooms && filters.bathrooms !== "Any") {
            apiFilters.bathrooms = Number.parseInt(filters.bathrooms);
        }

        // Possession status filter
        if (filters.possession_status && filters.possession_status !== "Any") {
            apiFilters.possession_status = normalizePossessionStatus(filters.possession_status);
        }

        // Price negotiable filter
        if (filters.is_price_negotiable && filters.is_price_negotiable !== "Any") {
            apiFilters.is_price_negotiable = filters.is_price_negotiable === "Yes";
        }

        // Listing status (Sell/Rent)
        if (activeTab && activeTab !== "reset") {
            apiFilters.status = activeTab;
        }

        console.log('🚀 Triggering search API with:', apiFilters);

        // Store client-side filters for additional filtering
        setClientFilters({
            possession_status: normalizePossessionStatus(filters.possession_status),
            is_price_negotiable: filters.is_price_negotiable,
            amenities: filters.amenities,
            activeTab: activeTab
        });

        // Always trigger the search API with current filters
        triggerSearch(apiFilters)
            .unwrap()
            .then((result) => {
                console.log('✅ Search API success:', result);
            })
            .catch((error) => {
                console.error('❌ Search API error:', error);
            });
    }

    function handleSearch(query, propertyType, activeTab = "") {
        setSearchQuery(query);
        applyFilters({
            city: query,
            property_type: propertyType === "Any" ? "Any" : propertyType.toLowerCase().replace(" ", "_"),
            property_purpose: "Any",
            priceRange: [0, 100],
            bedrooms: "Any",
            bathrooms: "Any",
            possession_status: "Any",
            is_price_negotiable: "Any",
            amenities: [],
        }, query, activeTab);
    }

    return (
        <>
            {/* Search Bar - Already has correct width */}
            <PropertySearchBar onSearch={handleSearch} />
            
            {/* Filter Sidebar - Now outside of container, matching search bar width */}
            <PropertySearchFilterSidebar
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                onFilterChange={applyFilters} 
            />
            
            {/* Property Listing Section - Same width as search bar */}
            <div className="relative md:mx-28 px-4 sm:px-6 py-10">
                <PropertySearchListing
                    properties={filteredProperties}
                    isLoading={isLoading}
                    setShowFilters={setShowFilters}
                />
            </div>
        </>
    )
}

export default PropertyDetailMainSection