"use client";
import { XCircle, Loader, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useGetBuyRequirementsQuery, useDeleteBuyRequirementMutation } from "@/service/buyRequirementApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import PropertySearchBar from "@/components/ui/property-search-bar";
import { useState, useEffect, useRef, useCallback } from "react";

export default function MyBuyRequirement() {
    const router = useRouter();
    const { token } = useSelector((state) => state.auth);
    const { data: buyRequirementsData, isLoading } = useGetBuyRequirementsQuery(undefined, {
        skip: !token, // Skip query if user is not logged in
    });
    const [deleteBuyRequirement] = useDeleteBuyRequirementMutation();
    const [filteredRequirements, setFilteredRequirements] = useState([]);
    const requirementsRef = useRef([]);

    const normalizeRequirements = useCallback((data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.results)) return data.results;
        if (Array.isArray(data?.items)) return data.items;
        return [];
    }, []);

    useEffect(() => {
        const nextRequirements = normalizeRequirements(buyRequirementsData);
        requirementsRef.current = nextRequirements;
        setFilteredRequirements(nextRequirements);
    }, [buyRequirementsData, normalizeRequirements]);

    const handleSearchAndFilter = (query = "", propertyType = null, activeTab = "") => {
        const requirements = requirementsRef.current;

        // PropertySearchBar emits an initial empty search callback on mount.
        // If data has not loaded yet, ignore that callback to avoid flashing empty state.
        const isEmptySearch = !query?.trim() && (!propertyType || propertyType === "Any") && !activeTab;
        if (isEmptySearch && requirements.length === 0 && !buyRequirementsData) {
            return;
        }

        if (requirements.length === 0) {
            setFilteredRequirements([]);
            return;
        }

        let result = [...requirements];

        if (query?.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((requirement) =>
                requirement?.city?.toLowerCase().includes(lowerQuery) ||
                requirement?.property_type?.toLowerCase().includes(lowerQuery)
            );
        }

        if (propertyType && propertyType !== "Any") {
            const propertyTypeMap = {
                flat_apartment: "flat",
                builder: "builder_floor",
            };
            const normalizedPropertyType = (propertyTypeMap[propertyType] || propertyType).toLowerCase();
            result = result.filter((requirement) =>
                requirement?.property_type?.toLowerCase() === normalizedPropertyType,
            );
        }

        setFilteredRequirements(result);
    };

    const handleDeleteRequirement = async (reqId, e) => {
        e.stopPropagation();
        try {
            await deleteBuyRequirement(reqId).unwrap();
            toast.success("Requirement deleted successfully");
        } catch (err) {
            console.error("Delete requirement failed:", err);
            toast.error(err?.data?.detail || "Failed to delete requirement");
        }
    };

    const handleNavigate = (id) => {
        router.push(`/property-matches/${id}`);
    };

    const handlePostRequirement = () => {
        router.push('/post-buy-requirement');
    };

    return (
        <>
            <Header />
            <div className="text-[#F5EFE7] mt-5 md:pt-10">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="min-h-screen bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[#F5EFE7] mb-2">Your Buy Requirements</h1>
                            <p className="text-[#F5EFE7]">
                                {filteredRequirements?.length || 0} requirements found
                            </p>
                        </div>
                        <button
                            onClick={handlePostRequirement}
                            className="bg-gradient-to-r w-40 from-[#C6A256] via-[#C6A256] to-[#C6A256] flex items-center gap-2 md:px-6 px-4 py-1 md:py-3 rounded-lg font-semibold"
                        ><Plus className="w-5 h-5" />
                           
                                
                                Post New
                            
                        </button>
                    </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin w-12 h-12 text-[#F5EFE7]" />
                    </div>
                ) : filteredRequirements && filteredRequirements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRequirements.map((item, index) => (
                            <motion.div
                                key={item?.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                onClick={() => handleNavigate(item?.id)}
                                className="bg-[#F5EFE7]/5 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-[#F5EFE7]/10 transition cursor-pointer group relative"
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDeleteRequirement(item?.id, e)}
                                    className="absolute top-4 right-4 text-[#C6A256] hover:text-[#C6A256] transition p-1 opacity-0 group-hover:opacity-100"
                                    title="Delete requirement"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>

                                

                                {/* Content */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-[#F5EFE7] group-hover:text-[#C6A256] transition">
                                        {item?.property_type || 'Property'}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 text-[#F5EFE7]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm">{item?.city}</span>
                                    </div>

                                    <div className="pt-2 border-t border-[#F5EFE7]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[#F5EFE7] text-sm">Price Range</span>
                                            <span className="text-[#F5EFE7] font-semibold">
                                                ₹{item?.min_price} - ₹{item?.max_price}
                                            </span>
                                        </div>

                                        {(item?.min_carpet_area || item?.max_carpet_area) && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#F5EFE7] text-sm">Carpet Area</span>
                                                <span className="text-[#F5EFE7] font-semibold">
                                                    {item?.min_carpet_area} - {item?.max_carpet_area} sq.ft
                                                </span>
                                            </div>
                                        )}

                                        {item?.possession_status && (
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[#F5EFE7] text-sm">Status</span>
                                                <span className="text-[#C6A256] font-medium text-sm">
                                                    {item?.possession_status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View Matches Button */}
                                <button className="bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] mt-4 w-full py-2 rounded-lg flex items-center justify-center gap-2 font-semibold">
                                    <span className="flex items-center gap-2">
                                        View Matches
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        
                        <h3 className="text-2xl font-bold text-[#F5EFE7] mb-3">No Requirements Yet</h3>
                        <p className="text-[#F5EFE7] text-lg max-w-md mb-8">
                            Post your first buy requirement and find matching properties that suit your needs
                        </p>
                        <button
                            onClick={handlePostRequirement}
                            className="bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] flex items-center gap-2 px-8 py-3 rounded-lg text-lg font-semibold"
                        >
                            <span className="flex items-center gap-2">
                                <Plus className="w-6 h-6" />
                                Post Your First Requirement
                            </span>
                        </button>
                    </div>
                )}
                </div>
            </div>
            <WhatsapBanner />
            <Footer />
        </>
    );
}

