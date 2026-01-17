"use client";
import { Dialog } from "@headlessui/react";
import { XCircle, Heart, X, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { basedUrl } from "@/libs/based-url";
import { toggleFavorite } from "@/redux/favoriteSlice";
import { useGetPropertyQuery } from "@/service/propertyApi";
import { useRouter } from "next/navigation";

export default function FavouriteDrawer() {
    const router = useRouter();
    const { data } = useGetPropertyQuery();
    const { favorites } = useSelector((state) => state.favorite);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const filterFavourite = data?.data?.filter((property) => favorites?.includes(property.id));

    const handleRemoveFavorite = (id, e) => {
        e.stopPropagation();
        dispatch(toggleFavorite(id));
    };

    const handleNavigate = (id) => {
        router.push(`/property-detail-dark/${id}`);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                title="View Favorites"
                className="relative p-1 group"
            >
                <Heart className="h-6 w-6 text-red-500 fill-red-500 cursor-pointer transition-transform group-hover:scale-110" />
                {favorites?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {favorites?.length}
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
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                                className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-[#3F2464] via-[#2b1748] to-black p-5 z-50 overflow-y-auto shadow-xl"
                            >
                                <div className="flex items-center justify-between mb-6 sticky top-0  pt-4 pb-2 z-10">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Your Favorites</h2>
                                        <p className="text-sm text-gray-300">
                                            {filterFavourite?.length || 0} items
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-4 right-4 text-white hover:text-red-500 transition
                                        cursor-pointer"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {filterFavourite?.length > 0 ? (
                                    <ul className="space-y-3">
                                        {filterFavourite?.map((item) => {
                                            const imageUrl = item?.images?.length
                                                ? basedUrl + item?.images[0]
                                                : "/assets/images/detail/image4.jpg";

                                            return (
                                                <motion.li
                                                    key={item?.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ duration: 0.2 }}
                                                    onClick={() => handleNavigate(item?.id)}
                                                    className="flex items-center gap-3 bg-white/5 p-3 rounded-lg shadow-sm hover:bg-white/10 transition cursor-pointer group"
                                                >
                                                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 relative">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={item?.title}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-semibold truncate">{item?.title}</p>
                                                        <p className="text-gray-300 text-xs truncate">{item?.city}</p>
                                                        <p className="text-white text-sm font-medium mt-1">
                                                            ₹{item?.expected_price}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => handleRemoveFavorite(item?.id, e)}
                                                            className="text-red-500 cursor-pointer transition p-1"
                                                            title="Remove from favorites"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                                                    </div>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Heart className="h-12 w-12 text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-white mb-2">No favorites yet</h3>
                                        <p className="text-gray-300 text-sm max-w-xs">
                                            Click the heart icon on properties to add them here
                                        </p>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                                        >
                                            Browse Properties
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

