"use client"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Mail, MessageCircle, Send } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSubscribeNewsletterMutation } from "@/service/newsletterApi"

function NewsLetter() {
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [selectedOption, setSelectedOption] = useState(null)
    const [isFocused, setIsFocused] = useState(false)
    const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation()

    const handleSubscribe = async (e) => {
        e.preventDefault()

        if (!selectedOption) {
            toast.error("Please select Email or WhatsApp")
            return
        }

        const trimmedEmail = email.trim()
        const trimmedPhone = phoneNumber.trim()

        if (selectedOption === "email" && !trimmedEmail) {
            toast.error("Please enter your email address")
            return
        }

        if (selectedOption === "whatsapp") {
            const isValidPhone = /^\+?[0-9]{10,15}$/.test(trimmedPhone)
            if (!isValidPhone) {
                toast.error("Please enter a valid WhatsApp number")
                return
            }
        }

        try {
            const payload =
                selectedOption === "email"
                    ? { email: trimmedEmail }
                    : { whatsapp: trimmedPhone }

            await subscribeNewsletter(payload).unwrap()
            toast.success(
                selectedOption === "email"
                    ? "Thanks for subscribing to our newsletter"
                    : "Thanks for subscribing via WhatsApp"
            )
            setEmail("")
            setPhoneNumber("")
        } catch (err) {
            toast.error(err?.data?.detail || err?.data?.message || "Subscription failed. Please try again.")
        }
    }

    return (
        <section className="py-20 bg-linear-to-br from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
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
                <div className="max-w-2xl mx-auto text-center">

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
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedOption("email")
                                    setIsFocused(false)
                                }}
                                className={`px-5 py-2.5 cursor-pointer rounded-full border text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-2 ${
                                    selectedOption === "email"
                                        ? "bg-[#212121]/95 text-[#F5EFE7] border-[#C6A256]/45 shadow-lg shadow-black/35"
                                        : "bg-transparent text-[#F5EFE7]/80 border-[#F5EFE7]/30"
                                }`}
                            >
                                <Mail className="w-4 h-4" />
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedOption("whatsapp")
                                    setIsFocused(false)
                                }}
                                className={`px-5 py-2.5 rounded-full cursor-pointer border text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-2 ${
                                    selectedOption === "whatsapp"
                                        ? "bg-[#212121]/95 text-[#F5EFE7] border-[#C6A256]/45 shadow-lg shadow-black/35"
                                        : "bg-transparent text-[#F5EFE7]/80 border-[#F5EFE7]/30"
                                }`}
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </button>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            {selectedOption && (
                                <motion.form
                                    key={selectedOption}
                                    onSubmit={handleSubscribe}
                                    initial={{ opacity: 0, y: 16, scale: 0.985 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.985 }}
                                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                                    className={`flex flex-col sm:flex-row gap-3 p-2 bg-[#F5EFE7]/5 backdrop-blur-md border rounded-2xl sm:rounded-full transition-all duration-300 ${
                                        isFocused ? "border-[#212121]/50 shadow-lg shadow-[#212121]/20" : "border-[#F5EFE7]/10"
                                    }`}
                                >
                                    <div className="flex-1 flex items-center gap-3 px-4 py-2">
                                        {selectedOption === "email" ? (
                                            <Mail
                                                className={`w-5 h-5 transition-colors duration-300 ${
                                                    isFocused ? "text-[#212121]" : "text-[#F5EFE7]/40"
                                                }`}
                                            />
                                        ) : (
                                            <MessageCircle
                                                className={`w-5 h-5 transition-colors duration-300 ${
                                                    isFocused ? "text-[#212121]" : "text-[#F5EFE7]/40"
                                                }`}
                                            />
                                        )}

                                        {selectedOption === "email" ? (
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                required
                                                className="w-full bg-transparent text-[#F5EFE7] placeholder-[#F5EFE7]/40 focus:outline-none text-base"
                                            />
                                        ) : (
                                            <input
                                                type="tel"
                                                placeholder="Enter your WhatsApp number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                required
                                                className="w-full bg-transparent text-[#F5EFE7] placeholder-[#F5EFE7]/40 focus:outline-none text-base"
                                            />
                                        )}
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-linear-to-r from-[#212121] to-[#212121] text-[#F5EFE7] px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#212121]/30"
                                    >
                                        <span className="flex items-center gap-2">
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {isLoading
                                                ? "Subscribing..."
                                                : selectedOption === "email"
                                                    ? "Subscribe"
                                                    : "Subscribe on WhatsApp"}
                                        </span>
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>
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