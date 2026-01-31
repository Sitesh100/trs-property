"use client";
import { Bath, Bed, Heart, MapPin, Square, Edit, Trash, Loader, Phone } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { motion } from "framer-motion";
import { basedUrl } from '@/libs/based-url';
import Link from 'next/link';
import { useDeletePropertyMutation } from '@/service/propertyApi';
import toast from 'react-hot-toast';
import { useSendNotificationMutation } from '@/service/notificationApi';
import { useToogleFavoritesMutation } from '@/service/favoriteApi';

function DetailSearchCard({ property, action = false }) {
    const mainImage = property?.images?.length > 0 ? basedUrl + property?.images[0] : "/assets/images/detail/image4.jpg";
    const [deleteProperty] = useDeletePropertyMutation();
    const [sendNotification, { isLoading }] = useSendNotificationMutation();
    const [toogleFavorites] = useToogleFavoritesMutation();

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await toogleFavorites({ property: property?.id }).unwrap();
            toast.success(response?.message || "Favourite successfully");
        } catch (err) {
            console.log("Favorites failed:", err);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await deleteProperty(id).unwrap();
            toast.success("Property deleted successfully");
        } catch (err) {
            console.log("Delete failed:", err);
        }
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
                        src={mainImage}
                        alt={property?.title || "Property"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
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

            <Link href={`/property-detail-dark/${property?.id}`} className="p-4 block">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {property?.title?.split(' ')?.slice(0, 4)?.join(' ')}
                    </h3>
                    <p className="md:text-lg font-bold text-gray-900 text-nowrap">
                        ₹ {property?.expected_price} <span className="text-sm text-gray-500">Cr.</span>
                    </p>
                </div>

                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="line-clamp-1">
                            {property?.city?.split(' ')?.slice(0, 4)?.join(' ')}
                        </span>
                    </div>
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
                        <div className="flex items-center gap-1">
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Bed className="h-3.5 w-3.5 text-amber-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{property?.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Bath className="h-3.5 w-3.5 text-amber-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{property?.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Square className="h-3.5 w-3.5 text-amber-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{property?.super_area || "—"} sqft</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default DetailSearchCard;