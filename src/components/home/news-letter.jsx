"use client"
import { motion } from "framer-motion"
import { Loader2, Mail, MessageCircle, Send } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSubscribeNewsletterMutation } from "@/service/newsletterApi"

function NewsLetter() {
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [submittingType, setSubmittingType] = useState(null)
    const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation()

    const handleEmailSubscribe = async (e) => {
        e.preventDefault()
        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            toast.error("Please enter your email address")
            return
        }

        try {
            setSubmittingType("email")
            await subscribeNewsletter({ email: trimmedEmail }).unwrap()
            toast.success("Thanks for subscribing to our newsletter")
            setEmail("")
        } catch (err) {
            toast.error(err?.data?.detail || err?.data?.message || "Subscription failed. Please try again.")
        } finally {
            setSubmittingType(null)
        }
    }

    const handleWhatsAppSubscribe = async (e) => {
        e.preventDefault()

        const trimmedPhone = phoneNumber.trim()

        const isValidPhone = /^\+?[0-9]{10,15}$/.test(trimmedPhone)
        if (!isValidPhone) {
            toast.error("Please enter a valid WhatsApp number")
            return
        }

        try {
            setSubmittingType("whatsapp")
            await subscribeNewsletter({ whatsapp: trimmedPhone }).unwrap()
            toast.success("Thanks for subscribing via WhatsApp")
            setPhoneNumber("")
        } catch (err) {
            toast.error(err?.data?.detail || err?.data?.message || "Subscription failed. Please try again.")
        } finally {
            setSubmittingType(null)
        }
    }

    return (
        <section className="py-12 bg-linear-to-br from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#212121]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#212121]/30 rounded-full blur-3xl"></div>
                
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
                        <Mail className="w-8 h-8 text-[#212121]/20" />
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: false }}
                        className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#F5EFE7]"
                    >
                        Subscribe to Newsletter
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                        className="text-[#F5EFE7]/50 mb-10 max-w-lg mx-auto text-base md:text-lg"
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <form
                                onSubmit={handleEmailSubscribe}
                                className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 sm:p-3 bg-[#F5EFE7]/5 backdrop-blur-md border border-[#F5EFE7]/10 rounded-2xl sm:rounded-full"
                            >
                                <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 min-h-12 sm:min-h-14">
                                    <Mail className="w-5 h-5 text-[#F5EFE7]/40" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-transparent text-[#F5EFE7] placeholder-[#F5EFE7]/40 focus:outline-none text-sm sm:text-base"
                                    />
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto bg-linear-to-r from-[#C6A256] to-[#B89248] text-[#1F1A12] px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#C6A256]/35"
                                >
                                    {isLoading && submittingType === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {isLoading && submittingType === "email" ? "Subscribing..." : "Subscribe Email"}
                                </motion.button>
                            </form>

                            <form
                                onSubmit={handleWhatsAppSubscribe}
                                className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 sm:p-3 bg-[#F5EFE7]/5 backdrop-blur-md border border-[#F5EFE7]/10 rounded-2xl sm:rounded-full"
                            >
                                <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 min-h-12 sm:min-h-14">
                                    <MessageCircle className="w-5 h-5 text-[#F5EFE7]/40" />
                                    <input
                                        type="tel"
                                        placeholder="Enter your WhatsApp number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        className="w-full bg-transparent text-[#F5EFE7] placeholder-[#F5EFE7]/40 focus:outline-none text-sm sm:text-base"
                                    />
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto bg-linear-to-r from-[#C6A256] to-[#B89248] text-[#1F1A12] px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#C6A256]/35"
                                >
                                    {isLoading && submittingType === "whatsapp" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {isLoading && submittingType === "whatsapp" ? "Subscribing..." : "Subscribe WhatsApp"}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                    {/* Disclaimer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: false }}
                        className="text-xs text-[#F5EFE7]/30 mt-6"
                    >
                        You can unsubscribe at any time. Read our <span className=" hover:underline cursor-pointer">Privacy Policy</span>
                    </motion.p>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-16">
                    <div className="h-px bg-linear-to-r from-transparent via-[#212121]/20 to-transparent"></div>
                </div>
            </div>
        </section>
    )
}

export default NewsLetter
