"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Award, Briefcase, Star, Sparkles } from "lucide-react"

function FounderSection() {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    })

    const imageVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
    }

    const textVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
            }
        },
    }

    const badgeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.6 + i * 0.1,
                ease: "easeOut"
            }
        })
    }

    return (
        <section ref={ref} className="py-20 md:py-28 bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
            {/* Background decorative elements - subtle */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#212121]/40 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#212121]/3 rounded-full blur-3xl"></div>
            </div>

            {/* Decorative bottom vector */}
            <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none">
                <Image
                    src="/assets/images/vector.png"
                    width={600}
                    height={600}
                    alt="Vector decoration"
                    className="object-contain"
                />
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
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-[#C6A256]" />
                        <span className="text-[#C6A256] font-medium uppercase tracking-wider text-sm">
                            Leadership Excellence
                        </span>
                    </div>
                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-[#F5EFE7]">
                        Visionary Leadership
                    </h2>
                    <p className="text-[#F5EFE7]/60 max-w-2xl mx-auto text-base md:text-lg">
                        Pioneering innovation in real estate for over three decades
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
                    {/* Image Section */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        variants={imageVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                    >
                        <div className="relative">
                            {/* Glowing border effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#212121]/40 to-[#212121]/40 rounded-3xl blur-2xl opacity-30"></div>
                            
                            {/* Main image container */}
                            <motion.div 
                                className="relative bg-gradient-to-br from-[#F5EFE7]/5 to-[#F5EFE7]/10 backdrop-blur-sm border border-[#F5EFE7]/20 rounded-3xl overflow-hidden p-2"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#212121] to-[#212121]">
                                    <Image
                                        src="/assets/images/men.png"
                                        alt="Dr. Gajendra Narang"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Decorative gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/80 via-transparent to-transparent"></div>
                                </div>
                            </motion.div>

                            {/* Floating badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="absolute -top-4 -right-4 bg-gradient-to-br from-[#C6A256] to-[#C6A256] text-[#212121] px-6 py-3 rounded-2xl shadow-2xl shadow-[#212121]/40 border border-[#F5EFE7]/10"
                            >
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold text-sm">30+ Years</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Text Section */}
                    <motion.div
                        className="w-full lg:w-1/2 text-center lg:text-left"
                        variants={textVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5EFE7] mb-4 leading-tight">
                                Founder Managed Under <br />
                                <span className="bg-gradient-to-r from-[#C6A256] to-[#C6A256] bg-clip-text text-transparent">
                                    Visionary Leadership
                                </span>
                            </h3>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-[#F5EFE7]/70 text-base md:text-lg mb-6 leading-relaxed"
                        >
                            Managing Director of TRS Realtech Private Limited Pvt Ltd | Founder of WORLDCITY INFRATECH | Promoter of various Realty Sector Initiatives since 1992
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8"
                        >
                            <h4 className="text-2xl md:text-3xl font-bold text-[#F5EFE7] mb-2">
                                Dr. Gajendra Narang
                            </h4>
                            <p className="text-[#C6A256] font-medium text-lg">Managing Director & Founder</p>
                        </motion.div>

                        {/* Achievement badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.div
                                custom={0}
                                variants={badgeVariants}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                className="bg-[#F5EFE7]/5 backdrop-blur-sm border border-[#F5EFE7]/10 rounded-2xl p-4 hover:border-[#C6A256]/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#212121] to-[#212121] border border-[#F5EFE7]/10 rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-6 h-6 text-[#F5EFE7]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[#F5EFE7] font-semibold text-sm">Industry Pioneer</p>
                                        <p className="text-[#F5EFE7]/60 text-xs">Since 1992</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                custom={1}
                                variants={badgeVariants}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                className="bg-[#F5EFE7]/5 backdrop-blur-sm border border-[#F5EFE7]/10 rounded-2xl p-4 hover:border-[#C6A256]/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#212121] to-[#212121] border border-[#F5EFE7]/10 rounded-xl flex items-center justify-center">
                                        <Award className="w-6 h-6 text-[#F5EFE7]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[#F5EFE7] font-semibold text-sm">Visionary Leader</p>
                                        <p className="text-[#F5EFE7]/60 text-xs">Multiple Ventures</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default FounderSection