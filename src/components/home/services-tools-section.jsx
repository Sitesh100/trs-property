"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

// Service data with all 6 items
const servicesData = [
    {
        id: 1,
        title: "Best Loan Offers",
        description: "Access competitive home loan options tailored to your property and financial profile.",
        image: "/assets/images/service/service-two.avif",
        href: "/services/loan-offers"
    },
    {
        id: 2,
        title: "Professional Legal Services",
        description: "Ensure every transaction is legally sound, compliant, and risk-free.",
        image: "/assets/images/detail/detail2.jpg",
        href: "/services/property-valuation"
    },
    {
        id: 3,
        title: "EMI & Eligibility Calculator",
        description: "Instantly estimate EMIs and plan your purchase with clarity and confidence.",
        image: "/assets/images/service/service-three.avif",
        href: "/services/emi-calculator"
    },
    {
        id: 4,
        title: "Property Valuation",
        description: "Get accurate, data-backed property valuations to make informed decisions.",
        image: "/assets/images/property/square1.jpg",
        href: "/services/property-valuation"
    },
    {
        id: 5,
        title: "Property Management",
        description: "End-to-end management to protect your asset and maximize returns.",
        image: "/assets/images/detail/detail3.jpg",
        href: "/services/property-management"
    },
    {
        id: 6,
        title: "Research & Advisory",
        description: "Insight-driven guidance to help you invest, buy, or sell smarter.",
        image: "/assets/images/project/project2.webp",
        href: "/services/research-advisory"
    },
]

const ServicesToolsSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#212121]/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#212121]/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-0 w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-[#212121]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5EFE7] tracking-wide px-4">
                        CURATED TOOLS & SERVICES
                    </h2>
                    <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-[#212121] to-[#C6A256] mx-auto mt-3 sm:mt-4"></div>
                </motion.div>

                {/* Services Grid - 3 columns, 2 rows */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto"
                >
                    {servicesData.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            className="group"
                        >
                            <Link href={service.href}>
                                <div className="flex items-stretch bg-[#212121] rounded-xl sm:rounded-2xl overflow-hidden border border-[#F5EFE7]/5 hover:border-[#212121]/30 transition-all duration-300 h-full cursor-pointer min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
                                    {/* Image Section - Left */}
                                    <div className="relative w-28 xs:w-32 sm:w-36 md:w-40 lg:w-48 flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#212121]/50"></div>
                                    </div>
                                    
                                    {/* Content Section - Right */}
                                    <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-center">
                                        <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-[#F5EFE7] font-semibold text-base sm:text-lg md:text-xl leading-tight mb-1.5 sm:mb-2 group-hover:text-[#C6A256] transition-colors duration-300">
                                                    {service.title}
                                                </h3>
                                                <p className="text-[#F5EFE7]/50 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                                                    {service.description}
                                                </p>
                                            </div>
                                            
                                            {/* Arrow Button */}
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-[#212121] border border-[#F5EFE7]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#212121] group-hover:border-[#212121] transition-all duration-300"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5EFE7]" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default ServicesToolsSection