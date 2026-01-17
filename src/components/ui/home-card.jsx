"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, IndianRupee, ArrowUpRight, Heart } from "lucide-react";
import { useState } from "react";

function HomeCard({ property, index = 0 }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    
    // Handle both full URLs and relative paths
    const getImageUrl = () => {
        if (!property?.images?.length) return "/assets/images/detail/image4.jpg";
        const img = property.images[0];
        // If it's already a full URL, use it directly
        if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        // Otherwise, it's a relative path - use fallback
        return "/assets/images/detail/image4.jpg";
    };
    
    const mainImage = getImageUrl();

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
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={mainImage}
                    alt={property?.title || "Property"}
                    fill
                    className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                {/* Gradient Overlay */}
                {/* <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}></div> */}
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
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
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/40'}`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <IndianRupee className="w-4 h-4 text-[#171137]" />
                        <span className="text-[#171137] font-bold text-sm">{formatPrice(property?.expected_price)}</span>
                    </div>
                </div>

                {/* Hover Arrow */}
                <Link 
                    href={`/property-detail-dark/${property?.id}`}
                    className={`absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-4 opacity-0 rotate-45'}`}
                >
                    <ArrowUpRight className="w-5 h-5 text-[#171137]" />
                </Link>
            </div>

            {/* Content */}
            <Link 
                href={`/property-detail-dark/${property?.id}`}
                className="p-5 flex-1 flex flex-col justify-between"
            >
                <div>
                    <h3 className={`text-lg font-bold text-white mb-2 transition-all duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>
                        {property?.title?.length > 20 ? property?.title?.slice(0, 20) + "..." : property?.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property?.city || "Location"}</span>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">{property?.bedrooms || "3"}</p>
                            <p className="text-white/50 text-xs">Beds</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">{property?.bathrooms || "2"}</p>
                            <p className="text-white/50 text-xs">Baths</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">{property?.area || "1200"}</p>
                            <p className="text-white/50 text-xs">Sq Ft</p>
                        </div>
                    </div>
                </div>
            </Link>

        </div>
    );
}

export default HomeCard;
