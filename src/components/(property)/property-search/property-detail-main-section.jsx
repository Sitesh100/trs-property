"use client"
import { useEffect, useState } from "react"
import PropertySearchFilterSidebar from "./property-search-filter-sidebar"
import PropertySearchListing from "./property-search-listing"
import { useGetPropertyQuery } from "@/service/propertyApi"
import PropertySearchBar from "../../ui/property-search-bar"

function PropertyDetailMainSection() {
    const [showFilters, setShowFilters] = useState(false)
    const { data, isLoading } = useGetPropertyQuery()
    const [filteredProperties, setFilteredProperties] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (data?.data) {
            setFilteredProperties(data?.data)
        }
    }, [data]);


    function applyFilters(filters, searchText = searchQuery, activeTab = "") {
        let result = [...data?.data];

        if (searchText.trim()) {
            result = result?.filter(
                (property) =>
                    property?.title?.toLowerCase().includes(searchText?.toLowerCase()) ||
                    property?.city?.toLowerCase().includes(searchText?.toLowerCase()) ||
                    property?.project_name?.toLowerCase().includes(searchText?.toLowerCase()) ||
                    property?.builder_name?.toLowerCase().includes(searchText?.toLowerCase())
            );
        }

        if (filters.city && filters.city.trim() !== "") {
            result = result.filter((property) =>
                property?.city?.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.property_type && filters.property_type !== "Any") {
            result = result.filter((property) => property?.property_type === filters.property_type);
        }

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
            const minPrice = (filters.priceRange[0] / 100) * 10;
            const maxPrice = (filters.priceRange[1] / 100) * 10;

            result = result.filter((property) => {
                const price = Number.parseFloat(property?.expected_price || "0");
                return price >= minPrice && price <= maxPrice;
            });
        }

        if (filters.bedrooms && filters.bedrooms !== "Any") {
            const bedroomCount = Number.parseInt(filters.bedrooms);
            result = result.filter((property) => {
                const propBedrooms = property?.bedrooms || 0;
                return propBedrooms === bedroomCount;
            });
        }

        if (filters.bathrooms && filters.bathrooms !== "Any") {
            const bathroomCount = Number.parseInt(filters.bathrooms);
            result = result.filter((property) => {
                const propBathrooms = property?.bathrooms || 0;
                return propBathrooms === bathroomCount;
            });
        }

        if (filters.possession_status && filters.possession_status !== "Any") {
            result = result.filter(
                (property) => property?.possession_status === filters.possession_status
            );
        }

        if (filters.is_price_negotiable && filters.is_price_negotiable !== "Any") {
            const negotiable = filters.is_price_negotiable === "Yes";
            result = result.filter((property) => property?.is_price_negotiable === negotiable);
        }

        if (filters.amenities && filters.amenities.length > 0) {
            result = result.filter((property) =>
                filters.amenities.every((amenity) => property?.amenities?.includes(amenity))
            );
        }

       if (activeTab && activeTab !== "reset") {
            result = result.filter((property) => property?.property_post_status === activeTab);
        }

        setFilteredProperties(result);
    }

    function handleSearch(query, propertyType, activeTab = "") {
        setSearchQuery(query);
        applyFilters({
            city: "",
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
            <PropertySearchBar onSearch={handleSearch} />
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    <PropertySearchFilterSidebar
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        onFilterChange={applyFilters}
                    />
                    <PropertySearchListing
                        properties={filteredProperties}
                        isLoading={isLoading}
                        setShowFilters={setShowFilters}
                    />
                </div>
            </div>
        </>
    )
}

export default PropertyDetailMainSection
