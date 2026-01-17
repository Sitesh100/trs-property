"use client"
import { Phone, Mail, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronRight, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

function Footer() {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Refund Policy", href: "/refund" },
    ]

    const propertyLinks = [
        { name: "Luxury Apartments", href: "/property" },
        { name: "Premium Villas", href: "/property" },
        { name: "Residential Plots", href: "/property" },
        { name: "Office Spaces", href: "/property" },
        { name: "Commercial Properties", href: "/property" },
    ]

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Youtube, href: "#", label: "YouTube" },
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

    return (
        <footer className="bg-[url('/assets/images/bg-black.png')] relative overflow-hidden">
            {/* Top gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 to-transparent pointer-events-none"></div>
            
            {/* Main Footer Content */}
            <div className="relative z-10 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
                    >
                        {/* Company Info */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <Link href="/" className="inline-block mb-6">
                                <Image 
                                    src="/assets/logo/logo1.png" 
                                    alt="Logo" 
                                    width={120} 
                                    height={50}
                                    className="h-16 w-auto"
                                />
                            </Link>
                            <p className="text-[#F3EFE7]/60 text-sm leading-relaxed mb-6">
                                Your trusted partner in finding the perfect property. We provide comprehensive real estate solutions with transparency and excellence.
                            </p>
                            
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

                        {/* Quick Links */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#F3EFE7] font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-[#C6A256]"></span>
                                Quick Links
                            </h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <motion.li 
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link 
                                            href={link.href}
                                            className="group flex items-center gap-2 text-[#F3EFE7]/60 hover:text-[#C6A256] transition-colors duration-300 text-sm"
                                        >
                                            <ChevronRight className="w-4 h-4 text-[#C6A256]/50 group-hover:text-[#C6A256] transition-colors" />
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Properties */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#F3EFE7] font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-[#C6A256]"></span>
                                Explore Properties
                            </h4>
                            <ul className="space-y-3">
                                {propertyLinks.map((link, index) => (
                                    <motion.li 
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link 
                                            href={link.href}
                                            className="group flex items-center gap-2 text-[#F3EFE7]/60 hover:text-[#C6A256] transition-colors duration-300 text-sm"
                                        >
                                            <ChevronRight className="w-4 h-4 text-[#C6A256]/50 group-hover:text-[#C6A256] transition-colors" />
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-[#F3EFE7] font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-[#C6A256]"></span>
                                Contact Us
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 rounded-full bg-[#C6A256]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C6A256]/20 transition-colors duration-300">
                                        <MapPin className="w-4 h-4 text-[#C6A256]" />
                                    </div>
                                    <div className="text-[#F3EFE7]/60 text-sm">
                                        <p className="text-[#F3EFE7]/80 font-medium mb-1">Corporate Office</p>
                                        <p>Raj Nagar, Ghaziabad</p>
                                        <p>Uttar Pradesh - 201002</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full bg-[#C6A256]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C6A256]/20 transition-colors duration-300">
                                        <Phone className="w-4 h-4 text-[#C6A256]" />
                                    </div>
                                    <div>
                                        <p className="text-[#F3EFE7]/60 text-sm hover:text-[#C6A256] transition-colors cursor-pointer">
                                            +91 98765 43210
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full bg-[#C6A256]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C6A256]/20 transition-colors duration-300">
                                        <Mail className="w-4 h-4 text-[#C6A256]" />
                                    </div>
                                    <div>
                                        <p className="text-[#F3EFE7]/60 text-sm hover:text-[#C6A256] transition-colors cursor-pointer">
                                            info@rx100realty.com
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Divider */}
                    <div className="my-10">
                        <div className="h-px bg-gradient-to-r from-transparent via-[#F3EFE7]/10 to-transparent"></div>
                    </div>

                    {/* Bottom Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: false }}
                        className="flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-2 text-[#F3EFE7]/40 text-sm">
                            <Building2 className="w-4 h-4 text-[#C6A256]" />
                            <p>© {currentYear} RX100 Realtech. All rights reserved.</p>
                        </div>

                        
                    </motion.div>
                </div>
            </div>

            {/* Back to top button */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#C6A256] text-[#121212] flex items-center justify-center shadow-lg shadow-[#C6A256]/30 hover:bg-[#d4b366] transition-colors duration-300 z-50"
            >
                <ArrowRight className="w-5 h-5 -rotate-90" />
            </motion.button>
        </footer>
    )
}

export default Footer

