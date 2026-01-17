"use client";
import { Bath, Bed, Heart, MapPin, Square, Edit, Trash, Loader } from 'lucide-react';
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

    const handleToggleFavorite = async () => {
        try {
            const response = await toogleFavorites({ property: property?.id }).unwrap();
            toast.success(response?.message || "Favourite successfully");
        } catch (err) {
            console.log("Favorites failed:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProperty(id).unwrap();
            toast.success("Customer delete successfully");
        } catch (err) {
            console.log("Delete failed:", err);
        }
    };

    const handleSendNotification = async (id, name) => {
        try {
            const response = await sendNotification({ property_id: id, property_name: name }).unwrap();
            toast.success(response?.message);
        } catch (err) {
            toast.error(err?.data?.message);
            console.log("Delete failed:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden p-4 detail-search-card-shadow"
        >
            <div className="relative">
                <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
                    <Image
                        src={mainImage}
                        alt={property?.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 z-10" />
                </div>

                {property?.possession_status && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-black text-white text-xs px-4 py-2 rounded-full">
                            {property?.possession_status?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                    </div>
                )}
                <div className="absolute top-3 right-3 cursor-pointer z-10">
                    <Heart
                        onClick={handleToggleFavorite}
                        className={`h-6 w-6 transition-colors duration-200 
                        ${property?.is_favorited ? "text-red-500 fill-red-500" : "text-white"}`}
                    />
                </div>
            </div>

            <Link href={`/property-detail-dark/${property?.id}`} className="p-4 block">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="md:text-lg font-bold text-black">
                        {property?.title?.split(' ')?.slice(0, 4)?.join(' ')}
                    </h3>
                    <p className="md:text-lg font-bold text-black text-nowrap">
                        ₹ {property?.expected_price} Cr.
                    </p>
                </div>

                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-black text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-black">
                            {property?.city?.split(' ')?.slice(0, 4)?.join(' ')}
                        </span>
                    </div>
                    {!action ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSendNotification(property?.id, property?.title);
                            }}
                            className="cursor-pointer flex justify-center items-center w-24 bg-black text-white text-xs px-4 py-2 text-nowrap rounded-full">
                            {isLoading ? (
                                <div className="animate-spin">
                                    <Loader size={16} />
                                </div>
                            ) : (
                                "CALL NOW"
                            )}
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
                                className="bg-[#08030A] text-white text-xs p-2 rounded-full cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Edit className="h-4 w-4" />
                            </Link>
                            <button
                                className="bg-red-600 text-white text-xs p-2 rounded-full cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(property?.id);
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1 text-black" />
                            <span className="text-black">{property?.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1 text-black" />
                            <span className="text-black">{property?.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1 text-black" />
                            <span className="text-black">{property?.super_area || "—"} sqft</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default DetailSearchCard;
