"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { lufga } from '@/fonts';

function PatnerSection({ imagesPatner }) {
    // Double the images for seamless loop
    const duplicatedImages = [...imagesPatner, ...imagesPatner, ...imagesPatner, ...imagesPatner];

    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-[#171137] via-[#121212] to-[#171137] overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-center mb-16"
                >

                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-[#F3EFE7]">
                        Our Partners & Affiliates
                    </h2>
                    <p className="text-[#F3EFE7]/50 max-w-xl mx-auto text-base md:text-lg">
                        Collaborating with industry leaders to bring you the best real estate experience
                    </p>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative marquee-mask">
                {/* Marquee Track */}
                <motion.div
                    className="flex gap-8 md:gap-12 py-8"
                    animate={{
                        x: [0, -50 * imagesPatner.length * 4],
                    }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedImages.map((img, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="flex-shrink-0 group cursor-pointer"
                        >
                            <div className="relative w-28 h-28 md:w-36 md:h-36 bg-[#F3EFE7]/5 backdrop-blur-sm border border-[#F3EFE7]/10 rounded-2xl flex items-center justify-center p-4 transition-all duration-300 group-hover:bg-[#F3EFE7]/10 group-hover:border-[#C6A256]/30 group-hover:shadow-lg group-hover:shadow-[#C6A256]/10">
                                <Image
                                    src={img}
                                    alt={`Partner ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Second row - moving in opposite direction */}
                <motion.div
                    className="flex gap-8 md:gap-12 py-8"
                    animate={{
                        x: [-50 * imagesPatner.length * 4, 0],
                    }}
                    transition={{
                        x: {
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedImages.map((img, index) => (
                        <motion.div
                            key={`row2-${index}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="flex-shrink-0 group cursor-pointer"
                        >
                            <div className="relative w-28 h-28 md:w-36 md:h-36 bg-[#F3EFE7]/5 backdrop-blur-sm border border-[#F3EFE7]/10 rounded-2xl flex items-center justify-center p-4 transition-all duration-300 group-hover:bg-[#F3EFE7]/10 group-hover:border-[#C6A256]/30 group-hover:shadow-lg group-hover:shadow-[#C6A256]/10">
                                <Image
                                    src={img}
                                    alt={`Partner ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom accent line */}
            <div className="container mx-auto px-4 mt-12">
                <div className="h-px bg-gradient-to-r from-transparent via-[#C6A256]/30 to-transparent"></div>
            </div>
        </section>
    )
}

export default PatnerSection
