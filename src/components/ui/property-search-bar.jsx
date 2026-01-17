"use client";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

function PropertySearchBar({ onSearch }) {
    const router = useRouter();
    const [propertyType, setPropertyType] = useState("Any");
    const [activeTab, setActiveTab] = useState("buy");
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery, propertyType, activeTab);
            router.push("/property-search")
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="relative md:mx-28 md:bottom-[40px] md:py-0 py-5 px-4 sm:px-6">
            <div className="h-full flex flex-col">
                <div className="max-w-7xl">
                    <div className="flex flex-wrap md:justify-start">
                        {["buy", "rent", "project", "reset"].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 text-shadow-lg relative z-20 sm:px-6 cursor-pointer w-20 md:w-40 text-sm sm:text-base font-bold rounded-t-2xl text-white transition-colors ${activeTab === tab ? "bg-black" : "bg-transparent hover:bg-gray-800"}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab?.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white md:py-6 py-3 rounded-b-2xl rounded-tr-2xl shadow-md">
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    <div className="flex flex-row gap-4 items-stretch">
                        <div className="w-full md:w-1/4 md:block hidden">
                            <div className="relative border-r-2 border-[#8F90A6]">
                                <select
                                    className="w-full p-3 bg-white text-gray-800 border-0 outline-0 rounded appearance-none outline-none"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    <option value="Any">Choose Property Type</option>
                                    <option value="flat_apartment">Flat Apartment</option>
                                    <option value="villa">House Villa</option>
                                    <option value="builder">Builder Floor</option>
                                    <option value="plot">Plot</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="md:w-2/3 w-[400%]">
                            <input
                                type="text"
                                placeholder="Search by title, city, project name or builder name"
                                className="w-full p-4 bg-white text-gray-800 rounded-2xl border border-gray-300 outline-none shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={handleSearch}
                                className="w-full md:w-16 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                <Search className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertySearchBar;
