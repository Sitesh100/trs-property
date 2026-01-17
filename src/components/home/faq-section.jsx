"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, MessageCircleQuestion } from "lucide-react"

const FAQSection = ({ faqs }) => {
    const [openFAQ, setOpenFAQ] = useState(null)
    
    const toggleFAQ = (id) => {
        setOpenFAQ(openFAQ === id ? null : id)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
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
        <section className="py-20  bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0f0f0f] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-[#9B59B6]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
                {/* Decorative question marks */}
                <div className="absolute top-32 right-1/4 opacity-5">
                    <MessageCircleQuestion className="w-32 h-32 text-white" />
                </div>
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

                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#F3EFE7]">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-[#F3EFE7]/50 max-w-2xl mx-auto text-base md:text-lg">
                        Find answers to common questions about our services and how we can help you
                    </p>
                </motion.div>

                {/* FAQ List */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1 }}
                    variants={containerVariants}
                    className="max-w-3xl mx-auto space-y-4"
                >
                    {faqs?.map((faq, index) => (
                        <motion.div
                            key={faq?.id}
                            variants={itemVariants}
                            className="group"
                        >
                            <motion.div
                                className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
                                    openFAQ === faq?.id 
                                        ? 'border-[#9B59B6]/40 shadow-lg shadow-[#9B59B6]/10' 
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                                whileHover={{ scale: openFAQ === faq?.id ? 1 : 1.01 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => toggleFAQ(faq?.id)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Number indicator */}
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                            openFAQ === faq?.id 
                                                ? 'bg-[#9B59B6] text-white' 
                                                : 'bg-white/10 text-white/60'
                                        }`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className={`font-medium text-base md:text-lg transition-colors duration-300 ${
                                            openFAQ === faq?.id ? 'text-white' : 'text-white/80'
                                        }`}>
                                            {faq?.question}
                                        </span>
                                    </div>
                                    
                                    {/* Icon */}
                                    <motion.div
                                        animate={{ rotate: openFAQ === faq?.id ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            openFAQ === faq?.id 
                                                ? 'bg-[#9B59B6] text-white' 
                                                : 'bg-white/10 text-white/60 group-hover:bg-white/20'
                                        }`}
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </button>

                                {/* Answer */}
                                <AnimatePresence>
                                    {openFAQ === faq?.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6">
                                                <div className="ml-12 pl-4 border-l-2 border-[#9B59B6]/30">
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.1 }}
                                                        className="text-white/60 leading-relaxed text-base"
                                                    >
                                                        {faq?.answer}
                                                    </motion.p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
                {/* Bottom decorative line */}
                <div className="mt-16">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>
            </div>
        </section>
    )
}

export default FAQSection
