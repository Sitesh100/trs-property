"use client"
import { motion } from "framer-motion"
import { Mail, Send, Bell, Sparkles } from "lucide-react"
import { useState } from "react"

function NewsLetter() {
    const [email, setEmail] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    return (
        <section className="py-20 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#9B59B6]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#171137]/30 rounded-full blur-3xl"></div>
                
                {/* Floating mail icons */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${10 + i * 20}%`,
                            top: `${20 + (i % 3) * 30}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    >
                        <Mail className="w-8 h-8 text-[#9B59B6]/20" />
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl mx-auto text-center">

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: false }}
                        className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#F3EFE7]"
                    >
                        Subscribe to Newsletter
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                        className="text-[#F3EFE7]/50 mb-10 max-w-lg mx-auto text-base md:text-lg"
                    >
                        Discover ways to increase your home&apos;s value and get listed. Stay updated with the latest properties.
                    </motion.p>

                    {/* Newsletter Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: false }}
                        className="relative"
                    >
                        <div className={`flex flex-col sm:flex-row gap-3 p-2 bg-white/5 backdrop-blur-md border rounded-2xl sm:rounded-full transition-all duration-300 ${
                            isFocused ? 'border-[#9B59B6]/50 shadow-lg shadow-[#9B59B6]/20' : 'border-white/10'
                        }`}>
                            {/* Email Input */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-2">
                                <Mail className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-[#9B59B6]' : 'text-white/40'}`} />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-base"
                                />
                            </div>

                            {/* Submit Button with Sphere Effect */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#9B59B6] to-[#8e44ad] text-white px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#9B59B6]/30"
                            >
                                <span className="flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Subscribe
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                    {/* Disclaimer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: false }}
                        className="text-xs text-white/30 mt-6"
                    >
                        You can unsubscribe at any time. Read our <span className="text-[#9B59B6] hover:underline cursor-pointer">Privacy Policy</span>
                    </motion.p>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-16">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#9B59B6]/20 to-transparent"></div>
                </div>
            </div>
        </section>
    )
}

export default NewsLetter