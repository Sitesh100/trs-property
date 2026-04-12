"use client"
import { motion } from "framer-motion"
import { Bath, Bed, MapPin, Square } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/utils/getImageUrl"
import Link from "next/link"

function DetailCard({ property }) {
    const imageSrc = getImageUrl(property?.image || property?.images?.[0]);
    const title = property?.name || property?.title || "Untitled Property";
    const location = property?.city || property?.map_address || "Location unavailable";
    const propertyType = property?.property_type || property?.type || "Property";

    const formatPrice = (value) => {
        if (value === null || value === undefined || value === "") return "On Request";
        const numericValue = Number(String(value).replace(/,/g, "").trim());
        if (!Number.isFinite(numericValue)) return String(value);

        return numericValue.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                viewport={{ once: true }}
                className="group"
            >
                <Link
                    href={property?.id ? `/property-detail-dark/${property.id}` : "#"}
                    className="block bg-[#F5EFE7] text-[#212121] rounded-2xl overflow-hidden border border-[#C6A256]/20 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.28)] group-hover:border-[#C6A256]/45"
                >
                    <div className="relative h-52 overflow-hidden">
                        <Image
                            src={imageSrc}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                        <div className="absolute top-3 left-3 rounded-full bg-[#C6A256] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#212121]">
                            {String(propertyType).replace(/_/g, " ")}
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-[22px] font-semibold leading-tight line-clamp-1">{title}</h3>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#212121]/70 line-clamp-1">
                            <MapPin className="h-4 w-4 text-[#C6A256] shrink-0" />
                            <span>{location}</span>
                        </div>

                        <p className="mt-3 text-2xl font-bold text-[#212121]">₹ {formatPrice(property?.price)}</p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-[#212121]/80">
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-2.5 py-1">
                                <Bed className="h-3.5 w-3.5 text-[#C6A256]" />
                                {property?.beds ?? "N/A"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-2.5 py-1">
                                <Bath className="h-3.5 w-3.5 text-[#C6A256]" />
                                {property?.baths ?? "N/A"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-2.5 py-1">
                                <Square className="h-3.5 w-3.5 text-[#C6A256]" />
                                {property?.area ?? "N/A"} sqft
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </>
    )
}

export default DetailCard