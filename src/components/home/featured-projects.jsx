"use client";
import { motion } from "framer-motion";
import HomeCard from "../ui/home-card";
import { Sparkles, Building2, ArrowRight } from "lucide-react";
import { lufga } from '@/fonts';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

// Static property data with Unsplash images
const staticProperties = [
    {
        id: 1,
        title: "Kalpataru Grandeur",
        city: "Lantern Square, Indore",
        expected_price: 4000000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"],
    },
    {
        id: 2,
        title: "Skye Luxuria",
        city: "Nipania, Indore",
        expected_price: 25000000,
        bedrooms: 3,
        bathrooms: 3,
        area: 1800,
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    },
    {
        id: 3,
        title: "Emerald Kingsvilla",
        city: "Scheme No 140, Indore",
        expected_price: 3200000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
    },
    {
        id: 4,
        title: "Godrej Indore",
        city: "Ujjain Road, Indore",
        expected_price: 5000000,
        bedrooms: 3,
        bathrooms: 3,
        area: 1500,
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    },
    {
        id: 5,
        title: "NRK Luxe",
        city: "Nipania, Indore",
        expected_price: 7000000,
        bedrooms: 4,
        bathrooms: 4,
        area: 2000,
        images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
    },
    {
        id: 6,
        title: "Phoenix Heights",
        city: "Vijay Nagar, Indore",
        expected_price: 8500000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2200,
        images: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80"],
    },
    {
        id: 7,
        title: "Royal Orchid",
        city: "AB Road, Indore",
        expected_price: 6500000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1650,
        images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"],
    },
    {
        id: 8,
        title: "The Millennium",
        city: "Palasia, Indore",
        expected_price: 12000000,
        bedrooms: 5,
        bathrooms: 4,
        area: 3000,
        images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"],
    },
    {
        id: 9,
        title: "Green Valley Villas",
        city: "Rau, Indore",
        expected_price: 4500000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1400,
        images: ["https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80"],
    },
    {
        id: 10,
        title: "Sapphire Residency",
        city: "MR 10, Indore",
        expected_price: 9500000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
    },
];

function FeaturedProjects() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-[#0a0a0a] via-[#110f1f] to-[#0a0a0a] overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#9B59B6]/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#171137]/40 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#9B59B6]/5 to-[#171137]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-center mb-16"
                >
                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-white">
                        Handpicked Featured Projects
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg">
                        Discover our exclusive selection of premium properties, carefully chosen to match your lifestyle and investment goals.
                    </p>
                </motion.div>

                {/* Carousel Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                    variants={containerVariants}
                >
                    <Carousel
                        opts={{
                            align: "start",
                            slidesToScroll: 1,
                            loop: true,
                        }}
                        className="max-w-[95rem] mx-auto px-4"
                    >
                        <CarouselContent className="-ml-4 md:-ml-6">
                            {staticProperties.map((property, index) => (
                                <CarouselItem 
                                    key={property.id} 
                                    className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                                >
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <HomeCard property={property} index={index} />
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        
                        {/* Custom Navigation */}
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-[#171137] transition-all duration-300" />
                            <div className="flex items-center gap-2 px-4">
                                <Building2 className="w-5 h-5 text-white/50" />
                                <span className="text-white/50 text-sm font-medium">Swipe to explore</span>
                            </div>
                            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-[#171137] transition-all duration-300" />
                        </div>
                    </Carousel>
                </motion.div>

            </div>
        </section>
    );
}

export default FeaturedProjects;


