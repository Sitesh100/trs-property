"use client"
import { motion } from "framer-motion"
import { Bath, Bed } from "lucide-react"
import Image from "next/image"

function DetailCard({ property }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white text-black rounded-lg overflow-hidden cursor-pointer"
            >
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        fill
                        className="object-cover transition-all hover:scale-125 duration-300"
                    />
                </div>
                <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{property.type}</div>
                    <h3 className="font-medium mb-2">{property.name}</h3>
                    <p className="text-lg font-medium mb-2">₹ {property.price}</p>
                    <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">
                            {property.beds} <Bed className="h-3 w-3 inline" />
                        </span>
                        <span className="mr-2">
                            {property.baths} <Bath className="h-3 w-3 inline" />
                        </span>
                        <span>{property.area} sqft</span>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default DetailCard