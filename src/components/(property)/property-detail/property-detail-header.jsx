"use client";
import { Heart, Share2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyDetailSocialModal from "./property-detail-social-modal";
import { useToggleFavoriteMutation } from "@/service/favoriteApi";
import toast from "react-hot-toast";

function PropertyDetailHeader({ property }) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [toggleFavorite, { isLoading }] = useToggleFavoriteMutation();
    const router = useRouter();

    const handleToggleFavorite = async () => {
        try {
            await toggleFavorite(property?.id).unwrap();
            toast.success(property?.is_favorited ? "Removed from favorites" : "Added to favorites");
        } catch (err) {
            console.error("Toggle favorite failed:", err);
            toast.error(err?.data?.detail || "Failed to update favorite");
        }
    };

    return (
        <div className="container mx-auto px-4 mt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/70 hover:text-amber-400 mb-4 cursor-pointer transition-all duration-300 group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                        <span className="text-sm font-semibold">Back</span>
                    </button>
                    <h1 className="text-2xl md:text-4xl font-bold">{property?.title || 'Property Details'}</h1>
                    <p className="text-xl font-medium mt-2">{property?.map_location || property?.location || property?.city}</p>
                    {property?.property_type && (
                        <p className="text-lg mt-1 text-amber-400 capitalize">
                            {property?.property_type} {property?.status && `• ${property?.status}`}
                        </p>
                    )}
                </div>
                <div className="flex items-center mt-2 md:mt-0 space-x-4">
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center cursor-pointer text-white border-2 border-white bg-[#1a1333] hover:bg-[#2a1f45] px-3 py-1.5 rounded-lg"
                    >
                        <Share2 className="h-4 w-4 mr-1" />
                        <span>Share</span>
                    </button>
                    <button 
                        onClick={handleToggleFavorite}
                        disabled={isLoading}
                        className="flex items-center cursor-pointer text-white border-2 border-white bg-[#1a1333] hover:bg-[#2a1f45] px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Heart className={`h-4 w-4 mr-1 ${
                            property?.is_favorited ? 'fill-red-500 text-red-500' : ''
                        }`} />
                        <span>{property?.is_favorited ? 'Unfavorite' : 'Favorite'}</span>
                    </button>
                </div>
            </div>
            <PropertyDetailSocialModal
                showShareModal={showShareModal}
                setShowShareModal={setShowShareModal}
                property={property}
            />
        </div>
    );
}

export default PropertyDetailHeader;