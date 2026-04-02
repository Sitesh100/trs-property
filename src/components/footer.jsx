"use client"
import { Phone, Mail, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronRight, Building2, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

function Footer() {
        const buildPropertySearchHref = ({
            city,
            propertyType = "",
            status = "",
        }) => {
            const query = new URLSearchParams();
            if (city) query.set("city", city);
            if (propertyType) query.set("property_type", propertyType);
            if (status) query.set("status", status);
            return `/property-search?${query.toString()}`;
        };

    const currentYear = new Date().getFullYear()
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    // Corporate Office Info
    const corporateOffice = {
        title: "Corporate Office",
        address: [
            "Scheme No 140, 1, The Row Eight, opp.",
            "Grande Exotica, Pipliyahana,",
            "Bicholi Mardana, Indore - 452016"
        ],
        email: "totalrealtysolutions11@gmail.com",
        phone: "917024144040"
    }

    const rLounge = {
        title: "R - Lounge",
        address: [
            "MZ-11, Bansi Trade Centre, 581, Mahatma",
            "Gandhi Rd, Opp. Jaipur Jewels, Race Course",
            "Road, Indore, Madhya Pradesh 452003"
        ]
    }

    const companyLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Consultant Lounge", href: "/consultant-lounge" },
        { name: "Builder Lounge", href: "/builder-lounge" },
        { name: "Insights & Advice", href: "/resources" },
        { name: "Contact Us", href: "/contact" },
    ]

    const exclusiveServices = [
        { name: "Best Loan Offers", href: "/loan-offers" },
        { name: "EMI Calculator", href: "/emi-calculator" },
        { name: "Property Valuation", href: "/services/property-valuation" },
        { name: "Legal Services", href: "/resources" },
        { name: "Property Management", href: "/services/management" },
        { name: "Research & Advice", href: "/services/research" },
    ]

    const topDeals = [
        { name: "Commercial Properties In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "commercial", status: "Sell" }) },
        { name: "Luxury Villas In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "villa", status: "Sell" }) },
        { name: "Residential Properties In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "flat", status: "Sell" }) },
        { name: "Top Properties In Indore", href: buildPropertySearchHref({ city: "Indore" }) },
        { name: "Commercial Properties For Rent", href: buildPropertySearchHref({ city: "Indore", propertyType: "commercial", status: "Rent" }) },
        { name: "Luxury Farmhouses In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "farmhouse", status: "Sell" }) },
        { name: "Rental Properties In Indore", href: buildPropertySearchHref({ city: "Indore", status: "Rent" }) },
        { name: "Apartments For Sale In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "flat", status: "Sell" }) },
        { name: "Row Houses Projects In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "row_house", status: "Sell" }) },
    ]

    const exploreProperties = [
        { name: "Commercial Properties In Bangalore", href: buildPropertySearchHref({ city: "Bangalore", propertyType: "commercial", status: "Sell" }) },
        { name: "Luxury Villas In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "villa", status: "Sell" }) },
        { name: "Residential Properties In Bangalore", href: buildPropertySearchHref({ city: "Bangalore", propertyType: "flat", status: "Sell" }) },
        { name: "Plots In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "plot", status: "Sell" }) },
        { name: "Rental Properties In Bangalore", href: buildPropertySearchHref({ city: "Bangalore", status: "Rent" }) },
        { name: "Commercial Properties In Indore", href: buildPropertySearchHref({ city: "Indore", propertyType: "commercial" }) },
    ]

    const socialLinks = [
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Youtube, href: "#", label: "YouTube" },
        { icon: Twitter, href: "#", label: "Twitter" },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }

    const openVideo = () => setIsVideoOpen(true)
    const closeVideo = () => setIsVideoOpen(false)

    return (
        <footer className="bg-[url('/assets/images/bg-black.png')] relative overflow-hidden">
            {/* Top gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 to-transparent pointer-events-none"></div>
            
            {/* Fixed Contact Buttons - Right Side */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
                <motion.a
                    href="tel:917024144040"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-[#C6A256] flex items-center justify-center shadow-lg"
                >
                    <Phone className="w-5 h-5 text-[#121212]" />
                </motion.a>
                <motion.a
                    href="https://api.whatsapp.com/send/?phone=917024144040&text=Hello%2C+I+am+interested+in+your+property%3A+Kalpataru+Grandeur&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg"
                >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </motion.a>
                <motion.a
                    href="mailto:totalrealtysolutions11@gmail.com"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-[#C6A256] flex items-center justify-center shadow-lg"
                >
                    <Mail className="w-5 h-5 text-[#121212]" />
                </motion.a>
            </div>
            
            {/* Main Footer Content - First Section */}
            <div className="relative z-10 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6"
                    >
                        {/* Corporate Office */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                {corporateOffice.title}
                            </h4>
                            <div className="text-[#F3EFE7]/70 text-sm space-y-1 mb-4">
                                {corporateOffice.address.map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
                            <p className="text-[#F3EFE7]/70 text-sm mb-1">{corporateOffice.email}</p>
                            <p className="text-[#F3EFE7]/70 text-sm mb-6">{corporateOffice.phone}</p>
                            
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                {rLounge.title}
                            </h4>
                            <div className="text-[#F3EFE7]/70 text-sm space-y-1">
                                {rLounge.address.map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
                        </motion.div>

                        {/* Company Links */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                Company Links
                            </h4>
                            <ul className="space-y-2">
                                {companyLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.href}
                                            className="text-[#F3EFE7]/70 hover:text-[#C6A256] transition-colors duration-300 text-sm underline decoration-[#F3EFE7]/30 hover:decoration-[#C6A256]"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Exclusive Services */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                Exclusive Services
                            </h4>
                            <ul className="space-y-2">
                                {exclusiveServices.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.href}
                                            className="text-[#F3EFE7]/70 hover:text-[#C6A256] transition-colors duration-300 text-sm underline decoration-[#F3EFE7]/30 hover:decoration-[#C6A256]"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Top Deals For You */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                Top Deals For You
                            </h4>
                            <ul className="space-y-2">
                                {topDeals.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.href}
                                            className="text-[#F3EFE7]/70 hover:text-[#C6A256] transition-colors duration-300 text-sm underline decoration-[#F3EFE7]/30 hover:decoration-[#C6A256]"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Explore Properties */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                Explore Properties
                            </h4>
                            <ul className="space-y-2">
                                {exploreProperties.map((link, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={link.href}
                                            className="text-[#F3EFE7]/70 hover:text-[#C6A256] transition-colors duration-300 text-sm underline decoration-[#F3EFE7]/30 hover:decoration-[#C6A256]"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Divider */}
                    <div className="my-10">
                        <div className="h-px bg-gradient-to-r from-transparent via-[#F3EFE7]/20 to-transparent"></div>
                    </div>

                    {/* Second Section - YouTube Video, Logo, About Us, QR Code */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
                    >
                        {/* YouTube Video Thumbnail */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <div 
                                onClick={openVideo}
                                className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 border-[#C6A256]/30 hover:border-[#C6A256] transition-colors duration-300"
                            >
                                <Image
                                    src="/assets/images/bgimage.jpg"
                                    alt="YouTube Video Thumbnail"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                                
                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
                                    >
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </motion.div>
                                </div>
                                
                                {/* Video Info Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-xs font-medium truncate">INDORE: NOT TIER 2, BUT TIER NEXT. A ...</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[#C6A256] text-xs font-semibold px-2 py-0.5 bg-black/50 rounded">WATCH NOW</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Logo Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col items-center justify-center">
                            <Link href="/" className="inline-block mb-4">
                                <Image 
                                    src="/assets/logo/logo1.png" 
                                    alt="TRS Property Mall Logo" 
                                    width={200} 
                                    height={100}
                                    className="h-24 w-auto"
                                />
                            </Link>
                            <p className="text-[#F3EFE7]/60 text-xs text-center">
                                MEGA CHOICES | MEGA OFFERS | MEGA HOMES
                            </p>
                            <p className="text-[#F3EFE7]/40 text-xs text-center mt-4">
                                © {currentYear} | By Total Realty Solutions Pvt. Ltd.
                            </p>
                        </motion.div>

                        {/* About Us Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                About Us
                            </h4>
                            <p className="text-[#F3EFE7]/70 text-sm leading-relaxed">
                                TRS Property Mall – Indore, an initiative by Total Realty Solutions Pvt. Ltd., is a trusted real estate consultancy in Indore offering end-to-end property solutions. We specialize in buying, selling, leasing, and investing in residential, commercial, and plotted properties.
                            </p>
                            <p className="text-[#F3EFE7]/70 text-sm leading-relaxed mt-3">
                                Our commitment to delivering exceptional client service forms the backbone of our company.
                            </p>
                        </motion.div>

                        {/* QR Code and Social Links */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col items-center lg:items-end">
                            <h4 className="text-[#C6A256] font-bold text-base mb-4">
                                Scan for Brochure
                            </h4>
                            <div className="w-32 h-32 bg-white p-2 rounded-lg mb-6">
                                <div className="w-full h-full bg-[#121212] rounded flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                                        <rect fill="white" width="100" height="100"/>
                                        <g fill="black">
                                            <rect x="10" y="10" width="25" height="25"/>
                                            <rect x="65" y="10" width="25" height="25"/>
                                            <rect x="10" y="65" width="25" height="25"/>
                                            <rect x="40" y="40" width="20" height="20"/>
                                            <rect x="65" y="65" width="10" height="10"/>
                                            <rect x="80" y="65" width="10" height="10"/>
                                            <rect x="65" y="80" width="10" height="10"/>
                                            <rect x="15" y="15" width="15" height="15" fill="white"/>
                                            <rect x="70" y="15" width="15" height="15" fill="white"/>
                                            <rect x="15" y="70" width="15" height="15" fill="white"/>
                                            <rect x="18" y="18" width="9" height="9"/>
                                            <rect x="73" y="18" width="9" height="9"/>
                                            <rect x="18" y="73" width="9" height="9"/>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 rounded-full bg-[#F3EFE7]/5 border border-[#F3EFE7]/10 flex items-center justify-center text-[#F3EFE7]/60 hover:bg-[#C6A256] hover:border-[#C6A256] hover:text-[#121212] transition-all duration-300"
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Back to top button */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#C6A256] text-[#121212] flex items-center justify-center shadow-lg shadow-[#C6A256]/30 hover:bg-[#d4b366] transition-colors duration-300 z-40"
            >
                <ArrowRight className="w-5 h-5 -rotate-90" />
            </motion.button>

            {/* YouTube Video Popup Modal */}
            <AnimatePresence>
                {isVideoOpen && (
                    <>
                        {/* Backdrop with blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeVideo}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                        />
                        
                        {/* Video Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
                        >
                            <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
                                {/* Close Button */}
                                <button
                                    onClick={closeVideo}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                {/* YouTube Embed */}
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/GD55ofLDIyI?autoplay=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </footer>
    )
}

export default Footer

