"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, IndianRupee, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";

function HomeCard({ property, index = 0 }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(property?.is_favorited === true || property?.is_favorite === true);

    useEffect(() => {
        setIsLiked(property?.is_favorited === true || property?.is_favorite === true);
    }, [property?.is_favorited, property?.is_favorite]);
    
    // Support both old API (images/image_ids array) and new API (image string with comma-separated URLs)
    const firstImage = property?.image || property?.image_ids?.[0] || property?.images?.[0];
    
    // ✅ Main property image
    const mainImage =
        getImageUrl(firstImage) ||
        "/assets/images/detail/image4.jpg";

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") return "0";
        const numericValue = Number(String(price).replace(/,/g, "").trim());
        if (!Number.isFinite(numericValue)) return String(price);

        const hasDecimals = numericValue % 1 !== 0;
        return numericValue.toLocaleString("en-IN", {
            minimumFractionDigits: hasDecimals ? 2 : 0,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div
            className="group relative bg-gradient-to-br from-[#F5EFE7]/10 to-[#F5EFE7]/5 backdrop-blur-md border border-[#F5EFE7]/10 rounded-3xl overflow-hidden flex flex-col h-78 md:h-85 transition-all duration-500 hover:border-[#F5EFE7]/30 hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative h-40 md:h-48 w-full overflow-visible">
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
                    <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-[#F5EFE7]/20 backdrop-blur-md text-[#F5EFE7] text-[11px] md:text-xs font-semibold rounded-full border border-[#F5EFE7]/20">
                        Featured
                    </span>
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={`absolute top-3.5 right-3.5 md:top-4 md:right-4 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isLiked
                            ? "bg-[#212121] text-[#F5EFE7]"
                            : "bg-[#F5EFE7]/20 backdrop-blur-md text-[#F5EFE7] hover:bg-[#F5EFE7]/40"
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
                    <div className="flex items-center gap-1 bg-[#F5EFE7]/95 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded-full">
                        <IndianRupee className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#212121]" />
                        <span className="text-[#212121] font-bold text-xs md:text-sm">
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
                className="p-4 md:p-5 flex-1 flex flex-col justify-between"
            >
                <div>
                    <h3 className="text-base md:text-lg font-bold text-[#F5EFE7] mb-1.5 md:mb-2">
                        {property?.title?.length > 20
                            ? property?.title.slice(0, 20) + "..."
                            : property?.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[#F5EFE7]/60">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">
                            {property?.map_location || property?.city || "Location"}
                        </span>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#F5EFE7]/10">
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-[#F5EFE7] font-semibold text-xs md:text-sm">
                                {property?.bedrooms || "3"}
                            </p>
                            <p className="text-[#F5EFE7]/50 text-xs">Beds</p>
                        </div>

                        <div className="w-px h-7 md:h-8 bg-[#F5EFE7]/10"></div>

                        <div className="text-center">
                            <p className="text-[#F5EFE7] font-semibold text-xs md:text-sm">
                                {property?.bathrooms || "2"}
                            </p>
                            <p className="text-[#F5EFE7]/50 text-xs">Baths</p>
                        </div>

                        <div className="w-px h-7 md:h-8 bg-[#F5EFE7]/10"></div>

                        <div className="text-center">
                            <p className="text-[#F5EFE7] font-semibold text-xs md:text-sm">
                                {property?.area || "1200"}
                            </p>
                            <p className="text-[#F5EFE7]/50 text-xs">Sq Ft</p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* ✅ Circular Builder Logo Overlay */}
            <div className="absolute right-4 bottom-48 translate-y-1/2 z-30 
                w-14 h-14 md:w-20 md:h-20 
                rounded-full bg-[#F5EFE7] 
                flex items-center justify-center 
                border-2 border-[#F5EFE7]/30 
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
