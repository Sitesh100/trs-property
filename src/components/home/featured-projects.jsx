"use client";
import { motion } from "framer-motion";
import HomeCard from "../ui/home-card";
import { useGetPropertyQuery } from "@/service/propertyApi";
import { Sparkles, Building2, ArrowRight } from "lucide-react";
import { lufga } from '@/fonts';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

function FeaturedProjects() {
    const { data, isLoading } = useGetPropertyQuery();

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
                    {isLoading ? (
                        <div className="max-w-[95rem] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[...Array(7)].map((_, i) => (
                                <motion.div 
                                    key={i} 
                                    variants={itemVariants}
                                    className="h-[380px] bg-white/5 animate-pulse rounded-3xl backdrop-blur-sm border border-white/10" 
                                />
                            ))}
                        </div>
                    ) : (
                        <Carousel
                            opts={{
                                align: "start",
                                slidesToScroll: 1,
                                loop: true,
                            }}
                            className="max-w-[95rem] mx-auto px-4"
                        >
                            <CarouselContent className="-ml-4 md:-ml-6">
                                {data?.data?.slice(0, 10).map((property, index) => (
                                    <CarouselItem 
                                        key={index} 
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
                    )}
                </motion.div>

            </div>
        </section>
    );
}

export default FeaturedProjects;


