"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Plus, Search, MapPin, Sparkles } from "lucide-react";
import { lufga } from '@/fonts';

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

    return <span className="flex items-center font-bold">{displayValue}<Plus className="w-5 h-5 md:w-6 md:h-6" /></span>;
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
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    const [activeFilter, setActiveFilter] = useState("BUY");
    const [location, setLocation] = useState("Indore");
    const [searchQuery, setSearchQuery] = useState("");

    const filters = [
        { id: "BUY", label: "BUY" },
        { id: "RENT", label: "RENT" },
        { id: "COMMERCIAL", label: "COMMERCIAL" },
        { id: "RESIDENTIAL", label: "RESIDENTIAL" },
        { id: "FARMLAND", label: "FARMLAND" }
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
        switch(activeFilter) {
            case "BUY":
                return "Digital Platform For Agents, Builders & Customers.";
            case "RENT":
                return "Find Your Perfect Rental Property Today.";
            case "COMMERCIAL":
                return "Discover Prime Commercial Spaces.";
            case "RESIDENTIAL":
                return "Your Dream Home Awaits You.";
            case "FARMLAND":
                return "Explore Premium Farmland Properties.";
            default:
                return "Digital Platform For Agents, Builders & Customers.";
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden">
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

            <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center py-12">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="max-w-5xl text-white text-center"
                >

                    {/* Animated Title */}
                    <motion.div 
                        key={activeFilter} 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <AnimatedText 
                            text={getHeadingText()}
                            className="hero-title text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight tracking-tight"
                        />
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p 
                        variants={fadeInUp}
                        className="md:text-lg text-base mb-10 max-w-2xl mx-auto text-white/80 leading-relaxed"
                    >
                        We provide a complete service for the sale, purchase or rental of real estate.
                        Get access to exclusive network & properties that suit your needs.
                    </motion.p>

                    {/* Stats Section */}
                    <motion.div 
                        variants={fadeInUp}
                        className="flex flex-wrap gap-6 md:gap-12 mt-8 justify-center mb-14"
                    >
                        {[
                            { target: 3000, label: "PROPERTIES" },
                            { target: 100, label: "BUILDERS" },
                            { target: 800, label: "AGENTS" },
                            { target: 1000, label: "CLIENTS" },
                        ].map((stat, index) => (
                            <motion.div 
                                key={stat.label}
                                className="text-center group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <div className="relative">
                                    <h2 className="text-2xl md:text-5xl flex justify-center font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                        {inView && <AnimatedCounter target={stat.target} />}
                                    </h2>
                                    <motion.div 
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#9B59B6] to-[#171137] group-hover:w-full transition-all duration-300"
                                    />
                                </div>
                                <p className="text-xs md:text-sm font-semibold mt-3 text-white/70 tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Search Section */}
                    <motion.div
                        variants={fadeInUp}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <motion.h2 
                            className="text-xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            #FindYourDreamProperty
                        </motion.h2>

                        <motion.div 
                            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10"
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center">
                                {filters.map((filter, index) => (
                                    <motion.button
                                        key={filter.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 + index * 0.08 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`relative px-5 md:px-6 py-2 md:py-2.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 overflow-hidden ${
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
                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
                                <motion.div 
                                    className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 w-full md:w-auto shadow-lg"
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <MapPin className="w-5 h-5 text-[#171137]" />
                                    <span className="font-semibold text-gray-800">{location}</span>
                                </motion.div>

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
                                            className="w-full px-5 py-3.5 rounded-2xl border-2 border-transparent bg-white text-gray-800 focus:border-[#171137] focus:outline-none placeholder-gray-400 transition-all duration-300 shadow-lg"
                                        />
                                    </motion.div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(23, 17, 55, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#171137] to-[#2d1f5c] text-white px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg w-full md:w-auto justify-center"
                                >
                                    <Search className="w-5 h-5" />
                                    Search
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
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