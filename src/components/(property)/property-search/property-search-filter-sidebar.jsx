"use client"
import { ChevronDown, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import CitySearchInput from "../../ui/city-search-input"

function PropertySearchFilterSidebar({ showFilters, setShowFilters, onFilterChange }) {
    const [filters, setFilters] = useState({
        city: "",
        property_type: "Any",
        property_purpose: "Any",
        priceRange: [0, 100],
        bedrooms: "Any",
        bathrooms: "Any",
        possession_status: "Any",
        is_price_negotiable: "Any",
        amenities: [],
    })

    const propertyTypes = ["flat_apartment", "villa", "plot", "commercial"]
    const possessionStatuses = ["ready_to_move", "under_construction"]
    const priceNegotiableOptions = ["Yes", "No"]
    const amenitiesList = [
        "Air conditioning",
        "Assisted living",
        "Disability Access",
        "Controlled access",
        "Cable Ready",
        "Available now",
    ]

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFilterChange(filters)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [filters])

    const handleInputChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
    }

    const handlePriceRangeChange = (value) => {
        setFilters((prev) => ({ ...prev, priceRange: value }))
    }

    const handleAmenityToggle = (amenity) => {
        setFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }))
    }

    const resetFilters = () => {
        const defaultFilters = {
            city: "",
            property_type: "Any",
            property_purpose: "Any",
            priceRange: [0, 100],
            bedrooms: "Any",
            bathrooms: "Any",
            possession_status: "Any",
            is_price_negotiable: "Any",
            amenities: [],
        }
        setFilters(defaultFilters)
    }

    const formatPrice = (percentage) => {
        const price = (percentage / 100) * 10
        return `₹${price.toFixed(1)}Cr`
    }

    return (
        <div className={`w-full md:w-1/3 bg-white h-full rounded-lg p-4 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-black">Property Filter</h3>
                <div className="flex space-x-2">
                    <button className="text-xs text-black cursor-pointer hover:text-gray-600" onClick={resetFilters}>
                        Reset all
                    </button>
                    <button className="md:hidden" onClick={() => setShowFilters(false)}>
                        <X className="h-5 w-5 text-black cursor-pointer" />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">City</h4>
                <CitySearchInput filters={filters} handleInputChange={handleInputChange} />
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Property Type</h4>
                <div className="relative">
                    <select
                        value={filters.property_type}
                        onChange={(e) => handleInputChange("property_type", e.target.value)}
                        className="w-full p-2 text-sm text-[#98A0B4] border border-[#D0D5DD] rounded-md appearance-none outline-0"
                    >
                        <option value="Any">Any type</option>
                        {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                                {type
                                    .split("_")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-black pointer-events-none" />
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Possession Status</h4>
                <div className="relative">
                    <select
                        value={filters.possession_status}
                        onChange={(e) => handleInputChange("possession_status", e.target.value)}
                        className="w-full p-2 text-sm text-[#98A0B4] border border-[#D0D5DD] rounded-md appearance-none outline-0"
                    >
                        <option value="Any">Any status</option>
                        {possessionStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status
                                    .split("_")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-black pointer-events-none" />
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Price Negotiable</h4>
                <div className="relative">
                    <select
                        value={filters.is_price_negotiable}
                        onChange={(e) => handleInputChange("is_price_negotiable", e.target.value)}
                        className="w-full p-2 text-sm text-[#98A0B4] border border-[#D0D5DD] rounded-md appearance-none outline-0"
                    >
                        <option value="Any">Any</option>
                        {priceNegotiableOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-black pointer-events-none" />
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Price Range</h4>
                <div className="px-2">
                    <Slider
                        value={filters.priceRange}
                        onValueChange={handlePriceRangeChange}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>{formatPrice(filters.priceRange[0])}</span>
                        <span>{formatPrice(filters.priceRange[1])}</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Bedrooms</h4>
                <div className="grid grid-cols-6 gap-2 text-xs">
                    {["Any", "1", "2", "3", "4", "5"].map((b) => (
                        <button
                            key={b}
                            onClick={() => handleInputChange("bedrooms", b)}
                            className={`py-2 text-center rounded-3xl transition-colors ${filters.bedrooms === b ? "bg-black text-white" : "bg-[#F2F4F7] text-black hover:bg-gray-200"
                                } cursor-pointer`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Bathrooms</h4>
                <div className="grid grid-cols-6 gap-2 text-xs">
                    {["Any", "1", "2", "3", "4", "5"].map((b) => (
                        <button
                            key={b}
                            onClick={() => handleInputChange("bathrooms", b)}
                            className={`py-2 text-center rounded-3xl transition-colors ${filters.bathrooms === b ? "bg-black text-white" : "bg-[#F2F4F7] text-black hover:bg-gray-200"
                                } cursor-pointer`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm text-[#98A0B4] mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    {amenitiesList.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleAmenityToggle(item)}
                            className={`py-2 px-1 text-center rounded-3xl cursor-pointer transition-colors ${filters.amenities.includes(item) ? "bg-black text-white" : "bg-[#F2F4F7] text-black hover:bg-gray-200"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PropertySearchFilterSidebar
