"use client";
import { motion } from "framer-motion";
import HomeCard from "../ui/home-card";
import { Building2 } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetFeaturedPropertiesQuery } from "@/service/propertyApi";
import WhatsappStrip from "../whatsapp-strip";

function FeaturedProjects() {
    const { data: featuredProperties = [], isLoading, isError } = useGetFeaturedPropertiesQuery();

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
        <section className="pt-10 md:pt-20 bg-gradient-to-br from-[#212121] via-[#212121] to-[#212121] overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#212121]/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#212121]/40 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#212121]/5 to-[#212121]/10 rounded-full blur-3xl"></div>
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
                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-[#F5EFE7]">
                        Featured Projects
                    </h2>
                    <p className="text-[#F5EFE7]/60 max-w-2xl mx-auto text-base md:text-lg">
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
                    {isLoading && featuredProperties.length === 0 ? (
                        <div className="max-w-[95rem] mx-auto px-4 text-center text-[#F5EFE7]/70">
                            Loading featured properties...
                        </div>
                    ) : isError ? (
                        <div className="max-w-[95rem] mx-auto px-4 text-center text-[#F5EFE7]/70">
                            Unable to load featured properties right now.
                        </div>
                    ) : featuredProperties.length === 0 ? (
                        <div className="max-w-[95rem] mx-auto px-4 text-center text-[#F5EFE7]/70">
                            No featured properties available right now.
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
                                {(featuredProperties || []).map((property, index) => (
                                    <CarouselItem
                                        key={property.id || property._id || `${property.title}-${index}`}
                                        className="pl-4 md:pl-6 basis-[88%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                                    >
                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ y: -8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <HomeCard property={property} />
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Custom Navigation */}
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 rounded-full bg-[#F5EFE7]/10 backdrop-blur-sm border border-[#F5EFE7]/20 text-[#F5EFE7] hover:bg-[#F5EFE7] hover:text-[#212121] transition-all duration-300" />
                                <div className="flex items-center gap-2 px-4">
                                    <Building2 className="w-5 h-5 text-[#F5EFE7]/50" />
                                    <span className="text-[#F5EFE7]/50 text-sm font-medium">
                                        {isLoading ? "Loading featured properties..." : "Swipe to explore"}
                                    </span>
                                </div>
                                <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 rounded-full bg-[#F5EFE7]/10 backdrop-blur-sm border border-[#F5EFE7]/20 text-[#F5EFE7] hover:bg-[#F5EFE7] hover:text-[#212121] transition-all duration-300" />
                            </div>
                        </Carousel>
                    )}
                </motion.div>

            </div>
            <div className="mt-10">
                  <WhatsappStrip />
            </div>
            
        </section>
    );
}

export default FeaturedProjects;


