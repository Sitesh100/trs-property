"use client";
import { Dialog } from "@headlessui/react";
import { XCircle, ShoppingBag, X, ChevronRight, Loader } from "lucide-react";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetBuyRequirementsQuery, useDeleteBuyRequirementMutation } from "@/service/buyRequirementApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function BuyRequirementDrawer() {
    const router = useRouter();
    const { token } = useSelector((state) => state.auth);
    const { data: buyRequirementsData, isLoading } = useGetBuyRequirementsQuery(undefined, {
        skip: !token, // Skip query if user is not logged in
    });
    const [deleteBuyRequirement] = useDeleteBuyRequirementMutation();
    const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                title="View Buy Requirements"
                className="relative p-1 group"
            >
                <ShoppingBag className="h-6 w-6 text-[#C6A256] fill-[#C6A256] cursor-pointer transition-transform group-hover:scale-110" />
                {buyRequirementsData && buyRequirementsData.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#F5EFE7] text-[#C6A256] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {buyRequirementsData.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Dialog as={Fragment} open={isOpen} onClose={() => setIsOpen(false)}>
                        <div className="fixed inset-0 z-50">
                            <motion.div
                                onClick={() => setIsOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-[#212121]/70 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                                className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] p-5 z-50 overflow-y-auto shadow-xl"
                            >
                                <div className="flex items-center justify-between mb-6 sticky top-0  pt-4 pb-2 z-10">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#F5EFE7]">Your Buy Requirements</h2>
                                        <p className="text-sm text-[#F5EFE7]">
                                            {buyRequirementsData?.length || 0} items
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-4 right-4 text-[#F5EFE7] hover:text-[#C6A256] transition
                                        cursor-pointer"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader className="animate-spin w-8 h-8 text-[#F5EFE7]" />
                                    </div>
                                ) : buyRequirementsData && buyRequirementsData.length > 0 ? (
                                    <ul className="space-y-3">
                                        {buyRequirementsData.map((item) => {
                                            return (
                                                <motion.li
                                                    key={item?.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ duration: 0.2 }}
                                                    onClick={() => handleNavigate(item?.id)}
                                                    className="flex items-center gap-3 bg-[#F5EFE7]/5 p-3 rounded-lg shadow-sm hover:bg-[#F5EFE7]/10 transition cursor-pointer group"
                                                >
                                                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 relative bg-gradient-to-br from-[#212121] to-[#212121] flex items-center justify-center">
                                                        <ShoppingBag className="w-8 h-8 text-[#F5EFE7]" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[#F5EFE7] text-sm font-semibold truncate">
                                                            {item?.property_type || 'Property'}
                                                        </p>
                                                        <p className="text-[#F5EFE7] text-xs truncate">{item?.city}</p>
                                                        <p className="text-[#F5EFE7] text-sm font-medium mt-1">
                                                            ₹{item?.min_price} - ₹{item?.max_price}
                                                        </p>
                                                        {(item?.min_carpet_area || item?.max_carpet_area) && (
                                                            <p className="text-[#F5EFE7] text-xs">
                                                                {item?.min_carpet_area} - {item?.max_carpet_area} sq.ft
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => handleDeleteRequirement(item?.id, e)}
                                                            className="text-[#C6A256] cursor-pointer transition p-1"
                                                            title="Delete requirement"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <ChevronRight className="w-4 h-4 text-[#F5EFE7] group-hover:text-[#F5EFE7] transition" />
                                                    </div>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <ShoppingBag className="h-12 w-12 text-[#F5EFE7] mb-4" />
                                        <h3 className="text-lg font-medium text-[#F5EFE7] mb-2">No requirements yet</h3>
                                        <p className="text-[#F5EFE7] text-sm max-w-xs">
                                            Post your buy requirements to find matching properties
                                        </p>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                router.push('/post-buy-requirement');
                                            }}
                                            className="mt-6 px-4 py-2 bg-[#F5EFE7]/10 hover:bg-[#F5EFE7]/20 text-[#F5EFE7] rounded-lg transition"
                                        >
                                            Post Requirement
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
}
