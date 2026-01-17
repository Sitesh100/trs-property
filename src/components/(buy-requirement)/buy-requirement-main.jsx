"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Building2, Home, Building, MapPin, Store, Warehouse } from "lucide-react"
import { useGetBuyRequirementQuery } from "@/service/buyRequirementApi"

const propertyCategories = [
    {
        title: "RESIDENTIAL",
        items: [
            {
                icon: <Building2 className="h-8 w-8" />,
                title: "Flat Apartment",
                desc: "Multi-unit residential buildings",
                href: "/post-buy-requirement/residential/apartment",
            },
            {
                icon: <Home className="h-8 w-8" />,
                title: "House/Villa",
                desc: "Independent residential properties",
                href: "/post-buy-requirement/residential/house-villa",
            },
            {
                icon: <Building className="h-8 w-8" />,
                title: "Builder Floor",
                desc: "Single floor units in low-rise buildings",
                href: "/post-buy-requirement/residential/builder-floor",
            },
            {
                icon: <MapPin className="h-8 w-8" />,
                title: "Plot",
                desc: "Land for residential construction",
                href: "/post-buy-requirement/residential/plot",
            },
        ],
    },
    {
        title: "COMMERCIAL",
        items: [
            {
                icon: <Building2 className="h-8 w-8" />,
                title: "Office Space",
                desc: "Commercial spaces for business",
                href: "/post-buy-requirement/commercial/office-space",
            },
            {
                icon: <Store className="h-8 w-8" />,
                title: "Shop",
                desc: "Retail spaces for business",
                href: "/post-buy-requirement/commercial/shop",
            },
            {
                icon: <Store className="h-8 w-8" />,
                title: "Showroom",
                desc: "Display spaces for products",
                href: "/post-buy-requirement/commercial/showroom",
            },
            {
                icon: <Warehouse className="h-8 w-8" />,
                title: "Warehouse",
                desc: "Storage and distribution spaces",
                href: "/post-buy-requirement/commercial/warehouse",
            },
        ],
    },
]

export default function BuyRequirementMain() {

    const { data } = useGetBuyRequirementQuery();

    console.log(data, 'datadatadata')

    return (
        <div className="bg-[#0d0a1a] text-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Select Property Type</h2>

                    {propertyCategories?.map((section) => (
                        <div key={section?.title} className="mb-12">
                            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45]">
                                {section?.title}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {section?.items?.map((item) => (
                                    <Link key={item?.title} href={item?.href}>
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            className="bg-gradient-to-b from-[#1a1333] to-[#0d0a1a] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border transition-all"
                                        >
                                            <div className="bg-[#2a1f45] p-4 rounded-full mb-4">{item?.icon}</div>
                                            <h4 className="font-bold">{item?.title}</h4>
                                            <p className="text-xs text-gray-400 mt-2">{item?.desc}</p>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


