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
import { useState, useEffect } from "react";

export default function MyBuyRequirement() {
    const router = useRouter();
    const { token } = useSelector((state) => state.auth);
    const { data: buyRequirementsData, isLoading } = useGetBuyRequirementsQuery(undefined, {
        skip: !token, // Skip query if user is not logged in
    });
    const [deleteBuyRequirement] = useDeleteBuyRequirementMutation();
    const [filteredRequirements, setFilteredRequirements] = useState([]);

    useEffect(() => {
        if (buyRequirementsData) {
            setFilteredRequirements(buyRequirementsData);
        }
    }, [buyRequirementsData]);

    const handleSearchAndFilter = (query = "", propertyType = null, activeTab = "") => {
        if (!buyRequirementsData || buyRequirementsData.length === 0) {
            setFilteredRequirements([]);
            return;
        }

        let result = [...buyRequirementsData];

        if (query?.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((requirement) =>
                requirement?.city?.toLowerCase().includes(lowerQuery) ||
                requirement?.property_type?.toLowerCase().includes(lowerQuery)
            );
        }

        if (propertyType && propertyType !== "Any") {
            result = result.filter((requirement) => requirement?.property_type === propertyType);
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
            <div className="text-white mt-5 md:pt-10">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="min-h-screen bg-gradient-to-b from-[#3F2464] via-[#2b1748] to-black py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Your Buy Requirements</h1>
                            <p className="text-gray-300">
                                {filteredRequirements?.length || 0} requirements found
                            </p>
                        </div>
                        <button
                            onClick={handlePostRequirement}
                            className="golden-button flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition shadow-lg font-semibold"
                        >
                            <span className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Post New
                            </span>
                        </button>
                    </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin w-12 h-12 text-white" />
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
                                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/10 transition cursor-pointer group relative"
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDeleteRequirement(item?.id, e)}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition p-1 opacity-0 group-hover:opacity-100"
                                    title="Delete requirement"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>

                                

                                {/* Content */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                                        {item?.property_type || 'Property'}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm">{item?.city}</span>
                                    </div>

                                    <div className="pt-2 border-t border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400 text-sm">Price Range</span>
                                            <span className="text-white font-semibold">
                                                ₹{item?.min_price} - ₹{item?.max_price}
                                            </span>
                                        </div>

                                        {(item?.min_carpet_area || item?.max_carpet_area) && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">Carpet Area</span>
                                                <span className="text-white font-semibold">
                                                    {item?.min_carpet_area} - {item?.max_carpet_area} sq.ft
                                                </span>
                                            </div>
                                        )}

                                        {item?.possession_status && (
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-gray-400 text-sm">Status</span>
                                                <span className="text-blue-400 font-medium text-sm">
                                                    {item?.possession_status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View Matches Button */}
                                <button className="golden-button mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold">
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
                        
                        <h3 className="text-2xl font-bold text-white mb-3">No Requirements Yet</h3>
                        <p className="text-gray-300 text-lg max-w-md mb-8">
                            Post your first buy requirement and find matching properties that suit your needs
                        </p>
                        <button
                            onClick={handlePostRequirement}
                            className="golden-button flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg transition shadow-lg text-lg font-semibold"
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

