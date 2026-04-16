"use client";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Bed, IndianRupee, Loader, MapPin, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

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
            <span className="text-[#F5EFE7] ml-0.5">+</span>
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
    const { token } = useSelector((state) => state.auth);
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    const [activeFilter, setActiveFilter] = useState("any");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [heroFilters, setHeroFilters] = useState({
        property_type: "Any",
        priceRange: [0, 100],
        bedrooms: "Any",
        super_area: "Any",
        possession_status: "Any",
        is_price_negotiable: "Any",
    });
    const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
    const [isSubmittingLead, setIsSubmittingLead] = useState(false);
    const [pendingHeroSearch, setPendingHeroSearch] = useState(false);
    const [leadForm, setLeadForm] = useState({
        customerName: "",
        customerEmail: "",
        customerNumber: "",
        notes: "",
    });

    const filters = [
       
        { id: "buy", label: "BUY" },
        { id: "any", label: "ALL" },
        { id: "flat", label: "FLAT" },
        { id: "villa", label: "VILLA" },
        { id: "plot", label: "PLOT" },
        { id: "showroom", label: "SHOWROOM" },
        { id: "office", label: "OFFICE" },
        {id: "project land", label: "PROJECT LAND"},
        { id: "farmhouse", label: "FARMHOUSE" },
        { id: "rent", label: "RENT" },
    ];

    const areaBudgetOnlyFilters = ["plot", "showroom", "office", "farmhouse"];
    const isAreaBudgetOnlySelected = areaBudgetOnlyFilters.includes(activeFilter);
    const isProjectLandSelected = activeFilter === "project land";
    const propertyTypeFilters = ["flat", "villa", "plot", "showroom", "office", "farmhouse", "commercial"];

    useEffect(() => {
        if (isProjectLandSelected) {
            setShowAdvancedFilters(false);
        }
    }, [isProjectLandSelected]);

    useEffect(() => {
        if (propertyTypeFilters.includes(activeFilter)) {
            setHeroFilters((prev) => ({ ...prev, property_type: activeFilter }));
            return;
        }

        if (activeFilter === "any") {
            setHeroFilters((prev) => ({ ...prev, property_type: "Any" }));
        }
    }, [activeFilter]);

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
            any: "Digital Platform For Agents, Builders & Customers in Indore.",
            flat: "Find Premium Apartments That Match Your Lifestyle in Indore.",
            villa: "Explore Luxury Villas Designed For Comfortable Living in Indore.",
            plot: "Discover Plots In Prime Locations For Your Future Home in Indore.",
            "project land": "Discover Project Land In Prime Locations in Indore.",
            commercial: "Discover Prime Commercial Spaces.",
        };

        return headingByType[activeFilter] || headingByType.any;
    };

    const updateHeroFilter = (field, value) => {
        setHeroFilters((prev) => ({ ...prev, [field]: value }));
    };

    const formatPrice = (percentage) => {
        const valueInCr = (percentage / 100) * 10;
        return `Rs ${valueInCr.toFixed(1)}Cr`;
    };

    const runHeroSearch = () => {
        const params = new URLSearchParams();
        const trimmedQuery = searchQuery.trim();

        const selectedPropertyType = propertyTypeFilters.includes(activeFilter)
            ? activeFilter
            : heroFilters.property_type;
        const selectedStatus = ["buy", "rent"].includes(activeFilter) ? activeFilter : "";

        if (trimmedQuery) {
            params.set("query", trimmedQuery);
        }

        params.set("propertyType", selectedPropertyType || "Any");

        if (selectedPropertyType && selectedPropertyType !== "Any") {
            params.set("property_type", selectedPropertyType);
        }

        if (selectedStatus) {
            params.set("activeTab", selectedStatus);
            params.set("status", selectedStatus);
        }

        params.set("priceMinPct", `${heroFilters.priceRange[0]}`);
        params.set("priceMaxPct", `${heroFilters.priceRange[1]}`);

        if (!isAreaBudgetOnlySelected && heroFilters.bedrooms !== "Any") {
            params.set("bedrooms", heroFilters.bedrooms);
        }

        if (heroFilters.super_area !== "Any") params.set("super_area", heroFilters.super_area);
        if (heroFilters.possession_status !== "Any") params.set("possession_status", heroFilters.possession_status);
        if (heroFilters.is_price_negotiable !== "Any") params.set("is_price_negotiable", heroFilters.is_price_negotiable);

        router.push(`/property${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const closeLeadPopupAndContinue = () => {
        setIsLeadPopupOpen(false);

        if (pendingHeroSearch) {
            setPendingHeroSearch(false);
            runHeroSearch();
        }
    };

    const handleHeroSearch = () => {
        if (!token) {
            setPendingHeroSearch(true);
            setIsLeadPopupOpen(true);
            return;
        }

        runHeroSearch();
    };

    const updateLeadForm = (field, value) => {
        setLeadForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleLeadSubmit = async (event) => {
        event.preventDefault();

        if (
            !leadForm.customerName.trim() ||
            !leadForm.customerNumber.trim()
        ) {
            toast.error("Please fill all required details.");
            return;
        }

        setIsSubmittingLead(true);

        try {
            const response = await fetch("/api/sell-do/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: leadForm.customerName.trim(),
                    customerEmail: leadForm.customerEmail.trim(),
                    customerNumber: leadForm.customerNumber.trim(),
                    notes: leadForm.notes.trim(),
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload?.message || "Failed to submit lead.");
            }

            toast.success("Thanks! Your details have been submitted.");
            setLeadForm({
                customerName: "",
                customerEmail: "",
                customerNumber: "",
                notes: "",
            });
            closeLeadPopupAndContinue();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to submit lead right now.");
        } finally {
            setIsSubmittingLead(false);
        }
    };

    return (
        <section className="relative min-h-[86vh] md:h-[68vh] overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    className="w-full h-full object-cover scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source media="(max-width: 767px)" src="/assets/video/herosection.mp4" type="video/mp4" />
                    <source src="/assets/video/bg_new_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-b from-[#212121]/60 via-[#212121]/40 to-[#212121]/70"></div> */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-[#212121]/60 to-transparent"></div> */}
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#F5EFE7]/20 rounded-full"
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

            <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[86vh] md:h-[64vh] flex flex-col justify-center items-center pt-[15px] pb-0">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="max-w-5xl text-[#F5EFE7] text-center w-full"
                >

                    {/* Animated Title */}
                    <motion.h1
                        key={activeFilter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="hero-title text-[#F5EFE7] text-3xl md:text-6xl lg:text-6xl font-semibold mb-4 md:mb-6 leading-tight tracking-tight md:px-2"
                    >
                        {getHeadingText()}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p 
                        variants={fadeInUp}
                        className="text-sm sm:text-base md:text-2xl font-medium mb-6 max-w-4xl mx-auto text-[#F5EFE7]/90 leading-tight px-4"
                    >
                        We provide a complete service for the sale, purchase or rental of real estate.
                        Get access to exclusive network & properties that suit your needs.
                    </motion.p>

                    {/* Search Section */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative z-40 w-full max-w-7xl mx-auto px-2 mt-2"
                    >
                        <motion.h2 
                            className="text-xl sm:text-2xl md:text-[34px] font-bold mb-4 md:mb-6 bg-gradient-to-r from-[#F5EFE7] via-[#F5EFE7] to-[#F5EFE7]/60 bg-clip-text text-transparent"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            #FindYourDreamProperty
                        </motion.h2>

                        <motion.div 
                            className="bg-[#F5EFE7]/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl border border-[#F5EFE7]/10"
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-1.5 mb-3 md:mb-4 justify-center">
                                {filters.map((filter, index) => (
                                    <motion.button
                                        key={filter.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 + index * 0.08 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`relative px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 overflow-hidden whitespace-nowrap ${
                                            activeFilter === filter.id
                                                ? "bg-[#F5EFE7] text-[#212121] shadow-lg shadow-[#F5EFE7]/25"
                                                : "bg-[#F5EFE7]/10 text-[#F5EFE7] hover:bg-[#F5EFE7]/20 border border-[#F5EFE7]/20"
                                        }`}
                                    >
                                        {activeFilter === filter.id && (
                                            <motion.div
                                                layoutId="activeFilter"
                                                className="absolute inset-0 bg-[#F5EFE7] rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{filter.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <div className="flex flex-col md:flex-row gap-2 sm:gap-2.5 md:gap-3 items-stretch md:items-center mb-6">
                                    <div className="w-full md:flex-[1.7]">
                                        <motion.div 
                                            className="relative"
                                            whileHover={{ scale: 1.01 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="w-full flex items-center rounded-xl md:rounded-2xl border-2 border-transparent bg-[#F5EFE7] shadow-lg overflow-hidden focus-within:border-[#212121] transition-all duration-300">
                                                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-r border-[#212121]/15 text-[#212121] whitespace-nowrap">
                                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#212121]" />
                                                    <span className="text-sm sm:text-sm font-semibold">Indore</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Search by project or builder name"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-sm text-[#212121] focus:outline-none placeholder-[#212121]/55 placeholder:text-xs sm:placeholder:text-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {!isProjectLandSelected && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAdvancedFilters((prev) => !prev)}
                                            className="md:shrink-0 bg-[#C8A45D]/18 text-[#E4C686] border border-[#C8A45D]/60 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl md:rounded-2xl font-semibold text-sm hover:bg-[#C8A45D]/28 transition-colors"
                                        >
                                            Filters
                                        </button>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(33, 33, 33, 0.5)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleHeroSearch}
                                        className="bg-gradient-to-r from-[#212121] to-[#212121] text-[#F5EFE7] px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl md:rounded-2xl font-semibold text-sm sm:text-sm flex items-center gap-2 transition-all duration-300 shadow-lg w-full md:w-auto md:shrink-0 justify-center"
                                    >
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Search
                                    </motion.button>
                                </div>

                                <AnimatePresence>
                                    {showAdvancedFilters && !isProjectLandSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.18, ease: "easeOut" }}
                                            className="absolute left-0 right-0 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[86%] lg:w-[78%] top-full mt-2 z-50 rounded-xl border border-[#C8A45D]/55 bg-[#212121] p-3 md:p-4 text-left shadow-2xl shadow-[#C8A45D]/15"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-[#E4C686]">Quick Filters</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAdvancedFilters(false)}
                                                    className="text-xs text-[#C8A45D] hover:text-[#E4C686]"
                                                >
                                                    Close
                                                </button>
                                            </div>

                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                    {!isAreaBudgetOnlySelected && (
                                                        <div>
                                                            <p className="text-xs text-[#F5EFE7]/70 mb-2 flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> Bedrooms</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {["Any", "1", "2", "3", "4", "5+"].map((value) => (
                                                                    <button
                                                                        key={value}
                                                                        type="button"
                                                                        onClick={() => updateHeroFilter("bedrooms", value)}
                                                                        className={`px-2.5 py-1.5 rounded-full text-xs transition-colors ${
                                                                            heroFilters.bedrooms === value
                                                                                ? "bg-[#C8A45D] text-[#212121]"
                                                                                : "bg-[#F5EFE7]/10 text-[#F5EFE7] border border-[#C8A45D]/30 hover:bg-[#C8A45D]/20"
                                                                        }`}
                                                                    >
                                                                        {value}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-xs text-[#F5EFE7]/70 mb-2">Super Area</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["Any", "500-1000", "1000-1500", "1500-2000", "2000+"].map((value) => (
                                                                <button
                                                                    key={value}
                                                                    type="button"
                                                                    onClick={() => updateHeroFilter("super_area", value)}
                                                                    className={`px-2.5 py-1.5 rounded-full text-xs transition-colors ${
                                                                        heroFilters.super_area === value
                                                                            ? "bg-[#C8A45D] text-[#212121]"
                                                                            : "bg-[#F5EFE7]/10 text-[#F5EFE7] border border-[#C8A45D]/30 hover:bg-[#C8A45D]/20"
                                                                    }`}
                                                                >
                                                                    {value}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>

                                            <div>
                                                <p className="text-xs text-[#F5EFE7]/70 mb-2 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Budget</p>
                                                <div className="rounded-lg border border-[#C8A45D]/45 bg-[#F5EFE7]/6 px-3 py-2">
                                                    <Slider
                                                        value={heroFilters.priceRange}
                                                        onValueChange={(value) => updateHeroFilter("priceRange", value)}
                                                        max={100}
                                                        min={0}
                                                        step={5}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="mt-2.5 flex items-center justify-between text-xs">
                                                    <span className="px-2 py-1 rounded-md bg-[#C8A45D]/22 text-[#E4C686] border border-[#C8A45D]/45">{formatPrice(heroFilters.priceRange[0])}</span>
                                                    <span className="text-[#F5EFE7]/60">to</span>
                                                    <span className="px-2 py-1 rounded-md bg-[#C8A45D]/22 text-[#E4C686] border border-[#C8A45D]/45">{formatPrice(heroFilters.priceRange[1])}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div 
                        variants={fadeInUp}
                        className="relative z-10 grid grid-cols-2 md:flex md:flex-wrap items-center gap-3 sm:gap-4 md:gap-0 mt-10 justify-center mb-6 md:mb-8 px-2"
                    >
                        {[
                            { target: 3000, label: "PROPERTIES" },
                            { target: 100, label: "BUILDERS" },
                            { target: 800, label: "AGENTS" },
                            { target: 1000, label: "CLIENTS" },
                        ].map((stat, index, arr) => (
                            <div key={stat.label} className="flex items-center justify-center">
                                <motion.div 
                                    className="text-center group px-2 sm:px-3 md:px-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <div className="relative">
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl flex justify-center font-bold bg-gradient-to-r from-[#F5EFE7] to-[#F5EFE7]/80 bg-clip-text text-transparent">
                                            {inView && <AnimatedCounter target={stat.target} />}
                                        </h2>
                                        <motion.div 
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#212121] to-[#212121] group-hover:w-full transition-all duration-300"
                                        />
                                    </div>
                                    <p className="text-[10px] sm:text-xs md:text-xs font-semibold mt-1.5 md:mt-2 text-[#F5EFE7]/80 tracking-wider">{stat.label}</p>
                                </motion.div>
                                {index < arr.length - 1 && (
                                    <div className="hidden md:block w-px h-12 bg-[#F5EFE7]/30"></div>
                                )}
                            </div>
                        ))}
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
                        className="w-6 h-10 bg-[#C8A45D] rounded-full flex justify-center p-2 shadow-[0_0_14px_rgba(200,164,93,0.45)]"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <motion.div 
                            className="w-1.5 h-1.5 bg-[#212121] rounded-full"
                            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isLeadPopupOpen && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center px-4">
                        <motion.div
                            className="absolute inset-0 bg-[#020814]/80 backdrop-blur-[2px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeLeadPopupAndContinue}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="relative z-10 w-full max-w-3xl rounded-[28px] border border-[#F5EFE7]/15 bg-[linear-gradient(135deg,rgba(5,18,44,0.95),rgba(9,24,52,0.96))] p-5 sm:p-6 shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={closeLeadPopupAndContinue}
                                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#F5EFE7]/20 bg-[#F5EFE7]/6 text-[#F5EFE7]/70 transition-colors hover:text-[#F5EFE7]"
                                aria-label="Close lead form"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h2 className="text-2xl font-bold text-[#F5EFE7]">Contact Us</h2>
                            <p className="mt-1 text-sm text-[#F5EFE7]/70">
                                Share your details to help us show better property matches.
                            </p>

                            <form onSubmit={handleLeadSubmit} className="mt-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm text-[#F5EFE7]/90">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={leadForm.customerName}
                                            onChange={(e) => updateLeadForm("customerName", e.target.value)}
                                            placeholder="Enter customer name"
                                            className="mt-2 w-full rounded-2xl border border-[#F5EFE7]/12 bg-[#0F172A]/55 px-4 py-3 text-sm text-[#F5EFE7] placeholder:text-[#F5EFE7]/35 outline-none transition-all duration-200 focus:border-[#C6A256]/55 focus:bg-[#0F172A]/80"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-[#F5EFE7]/90">Customer Email </label>
                                        <input
                                            type="email"
                                            value={leadForm.customerEmail}
                                            onChange={(e) => updateLeadForm("customerEmail", e.target.value)}
                                            placeholder="customer@example.com"
                                            className="mt-2 w-full rounded-2xl border border-[#F5EFE7]/12 bg-[#0F172A]/55 px-4 py-3 text-sm text-[#F5EFE7] placeholder:text-[#F5EFE7]/35 outline-none transition-all duration-200 focus:border-[#C6A256]/55 focus:bg-[#0F172A]/80"
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="text-sm text-[#F5EFE7]/90">Customer Number *</label>
                                        <input
                                            type="tel"
                                            value={leadForm.customerNumber}
                                            onChange={(e) => updateLeadForm("customerNumber", e.target.value)}
                                            placeholder="Enter phone number"
                                            className="mt-2 w-full rounded-2xl border border-[#F5EFE7]/12 bg-[#0F172A]/55 px-4 py-3 text-sm text-[#F5EFE7] placeholder:text-[#F5EFE7]/35 outline-none transition-all duration-200 focus:border-[#C6A256]/55 focus:bg-[#0F172A]/80"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="text-sm text-[#F5EFE7]/90">Content / Notes</label>
                                    <textarea
                                        rows={4}
                                        value={leadForm.notes}
                                        onChange={(e) => updateLeadForm("notes", e.target.value)}
                                        placeholder="Add notes"
                                        className="mt-2 w-full rounded-2xl border border-[#F5EFE7]/12 bg-[#0F172A]/55 px-4 py-3 text-sm text-[#F5EFE7] placeholder:text-[#F5EFE7]/35 outline-none transition-all duration-200 focus:border-[#C6A256]/55 focus:bg-[#0F172A]/80"
                                    />
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingLead}
                                        className="inline-flex min-w-28 items-center justify-center rounded-2xl border border-[#C6A256]/45 bg-[#C6A256] px-5 py-3 font-semibold text-[#212121] transition-colors hover:bg-[#d2b36d] disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {isSubmittingLead ? (
                                            <span className="animate-spin">
                                                <Loader className="h-4 w-4" />
                                            </span>
                                        ) : (
                                            "Add Lead"
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeLeadPopupAndContinue}
                                        className="inline-flex min-w-28 items-center justify-center rounded-2xl border border-[#F5EFE7]/20 bg-[#F5EFE7]/5 px-5 py-3 font-semibold text-[#F5EFE7] transition-colors hover:bg-[#F5EFE7]/10"
                                    >
                                        Skip
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default HeroSection;
