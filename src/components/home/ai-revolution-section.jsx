"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles } from "lucide-react"

function AiRevolutionSection({ features }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -10 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] overflow-hidden relative">
            {/* Background decorative elements - subtle */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#212121]/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#212121]/3 rounded-full blur-3xl"></div>
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
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-[#C6A256]" />
                        <span className="text-[#C6A256] font-medium uppercase tracking-wider text-sm">
                            Our Advantages
                        </span>
                    </div>
                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-[#F5EFE7]">
                        Why Choose Us
                    </h2>
                    <p className="text-[#F5EFE7]/60 max-w-2xl mx-auto text-base md:text-lg">
                        Experience the perfect blend of innovation and expertise in real estate solutions
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* AI Robot Image Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                        variants={imageVariants}
                        className="col-span-1 lg:flex flex-col justify-center hidden"
                    >
                        <div className="relative">
                            {/* Glowing effect behind robot */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#212121]/40 to-[#212121]/40 rounded-full blur-3xl opacity-60"></div>
                            
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="relative"
                            >
                                <Image
                                    src="/assets/images/roboto.png"
                                    alt="AI Technology"
                                    width={400}
                                    height={400}
                                    className="rounded-2xl w-full h-full object-contain drop-shadow-2xl relative z-10"
                                />
                            </motion.div>

                            {/* Animated decorative circles */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#F5EFE7]/10 rounded-full"
                            ></motion.div>
                            
                            <motion.div
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-[#F5EFE7]/5 rounded-full"
                            ></motion.div>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative p-6 rounded-2xl bg-[#F5EFE7]/5 backdrop-blur-sm border border-[#F5EFE7]/10 hover:border-[#F5EFE7]/20 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#212121]/40"
                            >
                                {/* Background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE7]/0 to-[#F5EFE7]/0 group-hover:from-[#F5EFE7]/5 group-hover:to-[#F5EFE7]/3 rounded-2xl transition-all duration-500"></div>

                                <div className="relative z-10">
                                    {/* Icon container */}
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#212121] to-[#212121] border border-[#F5EFE7]/10 shadow-lg shadow-[#212121]/40 mx-auto md:mx-0"
                                    >
                                        <div className="text-[#F5EFE7]">
                                            {feature.icon}
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold mb-3 text-[#F5EFE7] text-center md:text-left group-hover:text-[#212121] transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[#F5EFE7]/60 text-sm leading-relaxed text-center md:text-left">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
                                        dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                                    </p>
                                </div>

                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#212121]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom decorative line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: false }}
                    className="mt-16 h-px bg-gradient-to-r from-transparent via-[#212121]/30 to-transparent max-w-4xl mx-auto"
                ></motion.div>
            </div>
        </section>
    )
}

export default AiRevolutionSection;