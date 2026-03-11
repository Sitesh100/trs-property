"use client";
import { Bath, Bed, Heart, MapPin, Square, Edit, Trash, Loader, Phone } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { motion } from "framer-motion";
import { getImageUrl } from '@/utils/getImageUrl';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSendNotificationMutation } from '@/service/notificationApi';
import { useToggleFavoriteMutation } from '@/service/favoriteApi';

function DetailSearchCard({ property, action = false }) {
    // Support both old API (images/image_ids array) and new API (image string with comma-separated URLs)
    const firstImage = property?.image || property?.image_ids?.[0] || property?.images?.[0];
    const mainImage = getImageUrl(firstImage);
    const [sendNotification, { isLoading }] = useSendNotificationMutation();
    const [toggleFavorite, { isLoading: isFavoriteLoading }] = useToggleFavoriteMutation();
    const [imgSrc, setImgSrc] = React.useState(mainImage);

    // Reset image source when property changes
    React.useEffect(() => {
        setImgSrc(mainImage);
    }, [mainImage]);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await toggleFavorite(property?.id).unwrap();
            toast.success(property?.is_favorited ? "Removed from favorites" : "Added to favorites");
        } catch (err) {
            console.error("Toggle favorite failed:", err);
            toast.error(err?.data?.detail || "Failed to update favorite");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Delete endpoint not available in new API yet
        // Implement when backend adds DELETE /properties/{id}
        toast.error("Delete functionality will be available soon");
    };

    const handleSendNotification = async (e, id, name) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await sendNotification({ property_id: id, property_name: name }).unwrap();
            toast.success(response?.message);
        } catch (err) {
            toast.error(err?.data?.message);
            console.log("Notification failed:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-200"
        >
            <div className="relative">
                <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={property?.title || "Property"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImgSrc("/assets/images/detail/image4.jpg")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                </div>

                {property?.possession_status && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                            {property?.possession_status?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                    </div>
                )}

                <button 
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 cursor-pointer z-20 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
                >
                    <Heart
                        className={`h-5 w-5 transition-colors duration-200 
                        ${property?.is_favorited ? "text-red-500 fill-red-500" : "text-white hover:text-red-400"}`}
                    />
                </button>
            </div>

            <div className="p-4">
                <Link href={`/property-detail-dark/${property?._id || property?.id}`} className="block">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {property?.title?.split(' ')?.slice(0, 4)?.join(' ')}
                        </h3>
                        <p className="md:text-lg font-bold text-gray-900 text-nowrap">
                            ₹ {property?.expected_price ?? property?.price} <span className="text-sm text-gray-500"></span>
                        </p>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="line-clamp-1">
                            {(property?.map_address || property?.map_location || property?.city)?.split(' ')?.slice(0, 4)?.join(' ')}
                        </span>
                    </div>
                </Link>

                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1"></div>
                    {!action ? (
                        <button
                            onClick={(e) => handleSendNotification(e, property?.id, property?.title)}
                            disabled={isLoading}
                            className="group/btn cursor-pointer relative overflow-hidden flex justify-center items-center gap-1.5 min-w-24 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 text-xs font-semibold px-4 py-2 text-nowrap rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                        >
                            {isLoading ? (
                                <Loader size={16} className="animate-spin relative z-10" />
                            ) : (
                                <>
                                    <Phone size={14} className="relative z-10 transition-colors duration-300 group-hover/btn:text-white" />
                                    <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">CALL NOW</span>
                                </>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-full"></div>
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <Link
                                href={{
                                    pathname: "/post-property/residential/apartment",
                                    query: {
                                        edit: "true",
                                        id: property?.id,
                                    },
                                }}
                                className="bg-gray-900 hover:bg-gray-800 text-white text-xs p-2.5 rounded-full cursor-pointer transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Edit className="h-4 w-4" />
                            </Link>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white text-xs p-2.5 rounded-full cursor-pointer transition-colors"
                                onClick={(e) => handleDelete(e, property?.id)}
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-3 mt-1">
                    <div className="flex items-center space-x-4 text-sm">
                        {(property?.bedrooms !== null && property?.bedrooms !== undefined) && (
                            <div className="flex items-center gap-1">
                                <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <Bed className="h-3.5 w-3.5 text-amber-600" />
                                </div>
                                <span className="text-gray-700 font-medium">{property?.bedrooms} Beds</span>
                            </div>
                        )}
                        {(property?.bathrooms !== null && property?.bathrooms !== undefined) && (
                            <div className="flex items-center gap-1">
                                <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <Bath className="h-3.5 w-3.5 text-amber-600" />
                                </div>
                                <span className="text-gray-700 font-medium">{property?.bathrooms} Baths</span>
                            </div>
                        )}
                        {(property?.super_area || property?.carpet_area) && (
                            <div className="flex items-center gap-1">
                                <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <Square className="h-3.5 w-3.5 text-amber-600" />
                                </div>
                                <span className="text-gray-700 font-medium">{property?.super_area || property?.carpet_area} sqft</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default DetailSearchCard;