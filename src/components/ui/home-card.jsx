"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, IndianRupee, Heart } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";

function HomeCard({ property, index = 0 }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    
    // Support both old API (images/image_ids array) and new API (image string with comma-separated URLs)
    const firstImage = property?.image || property?.image_ids?.[0] || property?.images?.[0];
    
    // ✅ Main property image
    const mainImage =
        getImageUrl(firstImage) ||
        "/assets/images/detail/image4.jpg";

    const formatPrice = (price) => {
        if (!price) return "0";
        if (price >= 10000000) {
            return (price / 10000000).toFixed(2) + " Cr";
        } else if (price >= 100000) {
            return (price / 100000).toFixed(2) + " L";
        }
        return price.toLocaleString();
    };

    return (
        <div
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[380px] transition-all duration-500 hover:border-white/30 hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-visible">
                <Image
                    src={mainImage}
                    alt={property?.title || "Property"}
                    fill
                    className={`object-cover transition-all duration-700 ${
                        isHovered ? "scale-110" : "scale-100"
                    }`}
                />

                {/* Featured Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                        Featured
                    </span>
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isLiked
                            ? "bg-red-500 text-white"
                            : "bg-white/20 backdrop-blur-md text-white hover:bg-white/40"
                    }`}
                >
                    <Heart
                        className={`w-4 h-4 ${
                            isLiked ? "fill-current" : ""
                        }`}
                    />
                </button>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <IndianRupee className="w-4 h-4 text-[#171137]" />
                        <span className="text-[#171137] font-bold text-sm">
                            {formatPrice(property?.price ?? property?.expected_price)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <Link
                href={`/property-detail-dark/${
                    property?._id || property?.id
                }`}
                className="p-5 flex-1 flex flex-col justify-between"
            >
                <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                        {property?.title?.length > 20
                            ? property?.title.slice(0, 20) + "..."
                            : property?.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                            {property?.map_location || property?.city || "Location"}
                        </span>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">
                                {property?.bedrooms || "3"}
                            </p>
                            <p className="text-white/50 text-xs">Beds</p>
                        </div>

                        <div className="w-px h-8 bg-white/10"></div>

                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">
                                {property?.bathrooms || "2"}
                            </p>
                            <p className="text-white/50 text-xs">Baths</p>
                        </div>

                        <div className="w-px h-8 bg-white/10"></div>

                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">
                                {property?.area || "1200"}
                            </p>
                            <p className="text-white/50 text-xs">Sq Ft</p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* ✅ Circular Builder Logo Overlay */}
            <div className="absolute right-4 bottom-48 translate-y-1/2 z-30 
                w-16 h-16 md:w-20 md:h-20 
                rounded-full bg-white 
                flex items-center justify-center 
                border-2 border-white/30 
                shadow-xl">

                <Image
                    src={property?.overlay}
                    alt="Builder Logo"
                    width={72}
                    height={72}
                    className="object-contain rounded-full p-2"
                />
            </div>
        </div>
    );
}

export default HomeCard;
