"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

function Testimonials({ testimonials }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeTestimonial = testimonials[activeIndex];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <section className="py-20  bg-gradient-to-br from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Dotted pattern - right side */}
                <div className="absolute top-20 right-20 grid grid-cols-6 gap-3 opacity-20">
                    {[...Array(24)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-[#F5EFE7]"></div>
                    ))}
                </div>
                {/* Large quote mark - top right */}
                <motion.div 
                    initial={{ opacity: 0, rotate: -20 }}
                    whileInView={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-10 right-10 md:right-32"
                >
                    <Quote className="w-24 h-24 md:w-40 md:h-40 text-[#212121]/20 fill-[#212121]/20 rotate-180" />
                </motion.div>
                {/* Gradient orbs */}
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#212121]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5EFE7]">
                        What they say about us
                    </h2>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
                    {/* Left Side - Featured Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: false }}
                        className="relative"
                    >
                        {/* Navigation Arrows */}
                        <div className="flex gap-3 mb-6">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrev}
                                className="w-12 h-12 rounded-full border-2 border-[#F5EFE7]/20 flex items-center justify-center text-[#F5EFE7]/50 hover:border-[#F5EFE7]/40 hover:text-[#F5EFE7] transition-all duration-300"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                className="w-12 h-12 rounded-full bg-[#F5EFE7] flex items-center justify-center text-[#212121] hover:bg-[#F5EFE7]/90 transition-all duration-300"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Featured Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative"
                            >
                                <div className="relative bg-gradient-to-br from-[#F5EFE7]/20 to-[#212121]/30 rounded-3xl p-[1px] shadow-2xl shadow-[#212121]/40">
                                    <div className="bg-gradient-to-br from-[#212121] to-[#212121] rounded-3xl p-6 md:p-8">
                                        {/* Image */}
                                        <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-6 rounded-2xl overflow-hidden">
                                            <Image
                                                src={activeTestimonial?.image || "/placeholder.svg"}
                                                alt={activeTestimonial?.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        
                                        {/* Name and Title */}
                                        <div className="text-center">
                                            <h3 className="text-xl md:text-2xl font-bold text-[#F5EFE7] mb-1">
                                                {activeTestimonial?.name}
                                            </h3>
                                            <p className="text-[#F5EFE7]/60 text-sm">
                                                Verified Customer
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Right Side - Quote */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: false }}
                        className="relative"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative"
                            >
                                {/* Speech bubble */}
                                <div className="relative bg-[#F5EFE7]/5 backdrop-blur-sm border border-[#F5EFE7]/10 rounded-3xl p-8 md:p-10">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#212121] rounded-full flex items-center justify-center">
                                        <Quote className="w-5 h-5 text-[#F5EFE7] rotate-180" />
                                    </div>

                                    {/* Quote text */}
                                    <p className="text-[#F5EFE7] text-lg md:text-xl leading-relaxed">
                                        &ldquo;{activeTestimonial?.desc}&rdquo;
                                    </p>

                                    {/* Speech bubble tail */}
                                    <div className="absolute -bottom-4 left-12 w-8 h-8 bg-[#F5EFE7]/5 border-l border-b border-[#F5EFE7]/10 transform rotate-45 hidden md:block"></div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Counter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: false }}
                            className="mt-12 flex justify-center lg:justify-start"
                        >
                            <div className="inline-flex items-center gap-2 bg-[#F5EFE7]/5 backdrop-blur-sm border border-[#F5EFE7]/10 rounded-full px-6 py-3">
                                <span className="text-[#F5EFE7] font-bold text-lg">{activeIndex + 1}</span>
                                <span className="text-[#F5EFE7]/30">/</span>
                                <span className="text-[#F5EFE7]/50 font-medium">{testimonials.length}</span>
                            </div>
                        </motion.div>

                        {/* Thumbnail Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: false }}
                            className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
                        >
                            {testimonials.slice(0, 5).map((testimonial, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleThumbnailClick(index)}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                        activeIndex === index
                                            ? 'border-[#F5EFE7] shadow-lg shadow-[#F5EFE7]/10'
                                            : 'border-[#F5EFE7]/10 hover:border-[#F5EFE7]/30 grayscale hover:grayscale-0'
                                    }`}
                                >
                                    <Image
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {activeIndex === index && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 border-2 border-[#F5EFE7] rounded-xl"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-20">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#F5EFE7]/10 to-transparent"></div>
                </div>
            </div>
        </section>
    )
}

export default Testimonials
