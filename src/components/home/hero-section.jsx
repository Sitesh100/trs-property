"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { lufga } from '@/fonts';
import { useRouter } from "next/navigation";

function AnimatedCounter({ target }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.floor(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, target, {
            duration: 2.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        });

        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [count, target, rounded]);

    // Format number with commas
    const formattedValue = displayValue.toLocaleString();

    return (
        <span className="flex items-center font-bold">
            {formattedValue}
            <span className="text-white ml-0.5">+</span>
        </span>
    );
}

// Staggered text animation component
function AnimatedText({ text, className }) {
    const words = text.split(" ");
    
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.h1
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    className="inline-block mr-2 md:mr-4"
                >
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    );
}

function HeroSection() {
    const router = useRouter();
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    const [activeFilter, setActiveFilter] = useState("any");
    const [searchQuery, setSearchQuery] = useState("");

    const filters = [
        { id: "any", label: "ALL" },
        { id: "flat", label: "flat" },
        { id: "villa", label: "villa" },
        { id: "plot", label: "Plot" },
        { id: "commercial", label: "COMMERCIAL" },
        // { id: "FARMLAND", label: "FARMLAND" },
    ];

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            }
        },
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            }
        },
    };

    const getHeadingText = () => {
        const headingByType = {
            any: "Digital Platform For Agents, Builders & Customers.",
            flat: "Find Premium Apartments That Match Your Lifestyle.",
            villa: "Explore Luxury Villas Designed For Comfortable Living.",
            plot: "Discover Plots In Prime Locations For Your Future Home.",
            commercial: "Discover Prime Commercial Spaces.",
        };

        return headingByType[activeFilter] || headingByType.any;
    };

    const handleHeroSearch = () => {
        const params = new URLSearchParams();
        const trimmedQuery = searchQuery.trim();
        const propertyTypeByFilter = {
            any: "Any",
            flat: "flat",
            villa: "villa",
            plot: "plot",
            commercial: "commercial",
        };

        if (trimmedQuery) {
            params.set("query", trimmedQuery);
        }

        params.set("propertyType", propertyTypeByFilter[activeFilter] || "Any");

        router.push(`/property${params.toString() ? `?${params.toString()}` : ""}`);
    };

    return (
        <section className="relative min-h-screen md:h-[80vh] overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    className="w-full h-full object-cover scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/assets/video/bg_new_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div> */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-[#171137]/60 to-transparent"></div> */}
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-screen md:h-[90vh] flex flex-col justify-center items-center py-18 md:py-0">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="max-w-5xl text-white text-center w-full"
                >

                    {/* Animated Title */}
                    <motion.h1
                        key={activeFilter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="hero-title text-white text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 leading-tight tracking-tight md:px-2"
                    >
                        {getHeadingText()}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p 
                        variants={fadeInUp}
                        className="text-sm sm:text-base md:text-xl font-medium md:font-semibold mb-8 md:mb-10 max-w-2xl mx-auto text-white/90 leading-tight px-4"
                    >
                        We provide a complete service for the sale, purchase or rental of real estate.
                        Get access to exclusive network & properties that suit your needs.
                    </motion.p>

                    {/* Stats Section */}
                    <motion.div 
                        variants={fadeInUp}
                        className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-4 sm:gap-6 md:gap-0 mt-4 justify-center mb-6 md:mb-8 px-2"
                    >
                        {[
                            { target: 3000, label: "PROPERTIES" },
                            { target: 100, label: "BUILDERS" },
                            { target: 800, label: "AGENTS" },
                            { target: 1000, label: "CLIENTS" },
                        ].map((stat, index, arr) => (
                            <div key={stat.label} className="flex items-center justify-center">
                                <motion.div 
                                    className="text-center group px-3 sm:px-4 md:px-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <div className="relative">
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl flex justify-center font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                            {inView && <AnimatedCounter target={stat.target} />}
                                        </h2>
                                        <motion.div 
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#9B59B6] to-[#171137] group-hover:w-full transition-all duration-300"
                                        />
                                    </div>
                                    <p className="text-xs sm:text-xs md:text-sm font-semibold mt-2 md:mt-3 text-white/80 tracking-wider">{stat.label}</p>
                                </motion.div>
                                {index < arr.length - 1 && (
                                    <div className="hidden md:block w-px h-12 bg-white/30"></div>
                                )}
                            </div>
                        ))}
                    </motion.div>

                    {/* Search Section */}
                    <motion.div
                        variants={fadeInUp}
                        className="w-full max-w-4xl mx-auto px-2"
                    >
                        <motion.h2 
                            className="text-lg sm:text-xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            #FindYourDreamProperty
                        </motion.h2>

                        <motion.div 
                            className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/10"
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6 justify-center">
                                {filters.map((filter, index) => (
                                    <motion.button
                                        key={filter.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 + index * 0.08 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`relative px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 overflow-hidden ${
                                            activeFilter === filter.id
                                                ? "bg-white text-gray-900 shadow-lg shadow-white/25"
                                                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                        }`}
                                    >
                                        {activeFilter === filter.id && (
                                            <motion.div
                                                layoutId="activeFilter"
                                                className="absolute inset-0 bg-white rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{filter.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch md:items-center">
                                <div className="flex-1 w-full">
                                    <motion.div 
                                        className="relative"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search by project or builder name"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl md:rounded-2xl border-2 border-transparent bg-white text-sm sm:text-base text-gray-800 focus:border-[#171137] focus:outline-none placeholder-gray-400 placeholder:text-xs sm:placeholder:text-sm transition-all duration-300 shadow-lg"
                                        />
                                    </motion.div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(23, 17, 55, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleHeroSearch}
                                    className="bg-gradient-to-r from-[#171137] to-[#2d1f5c] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl md:rounded-2xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all duration-300 shadow-lg w-full md:w-auto justify-center"
                                >
                                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Search
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div 
                    className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    <motion.div
                        className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <motion.div 
                            className="w-1.5 h-1.5 bg-white rounded-full"
                            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;