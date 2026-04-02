"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FeaturedProjects from "@/components/home/featured-projects";
import toast from "react-hot-toast";
import { useRequestAgentLoungeAccessMutation } from "@/service/agentLoungeApi";


const ConsultantLoungePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    code: "IN +91",
    phone: "",
    email: "",
    company: "",
    experience: "",
    city: "",
    agreeTerms: false,
  });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [requestAgentLoungeAccess, { isLoading: isSubmitting }] = useRequestAgentLoungeAccessMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedPhone = formData.phone.replace(/\s|-/g, "").trim();
    const normalizedPhone = sanitizedPhone.startsWith("+")
      ? sanitizedPhone
      : `+91${sanitizedPhone}`;

    try {
      const response = await requestAgentLoungeAccess({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: normalizedPhone,
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        experience: formData.experience || undefined,
        city: formData.city.trim() || undefined,
      }).unwrap();

      toast.success(response?.message || "Agent lounge request submitted successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        code: "IN +91",
        phone: "",
        email: "",
        company: "",
        experience: "",
        city: "",
        agreeTerms: false,
      });
    } catch (err) {
      toast.error(err?.data?.detail || err?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  const networkBenefits = [
    {
      title: "Exclusive Deals",
      description: "Access premium properties with special consultant rates",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Guaranteed Allotment",
      description: "Priority allotment in high-demand projects",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Highest Brokerage",
      description: "Competitive commission structure for consultants",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "100% Transparency",
      description: "Complete transparency in all transactions",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "On-time Payments",
      description: "Guaranteed payment within 30 days",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Dedicated Support",
      description: "24/7 customer support for your needs",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
        {/* ===== Hero + Two Column Section ===== */}
        <section className="relative pt-10 md:pt-16 pb-20 md:pb-28 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1a1a1a]/40 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A256]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C6A256]/3 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Compact Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12 md:mb-16"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-block px-4 py-2 rounded-full bg-[#C6A256]/10 text-[#C6A256] text-sm font-medium mb-5"
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Exclusive Community
              </motion.span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Welcome to TRS{" "}
                <span className="text-[#C6A256]">Consultant Lounge</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Join an exclusive community of leading real estate consultants
                and brokers
              </p>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">
              {/* ===== LEFT COLUMN (3/5) ===== */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="lg:col-span-3 space-y-6"
              >
                {/* Text Content */}
                <div className="bg-gradient-to-r from-[#1a1a1a] to-[#141414] border border-[#C6A256]/10 rounded-2xl p-6 md:p-8">
                  <span className="inline-block px-3 py-1.5 rounded-full bg-[#C6A256]/10 text-[#C6A256] text-xs font-medium mb-4 uppercase tracking-wider">
                    Why Join TRS Lounge?
                  </span>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Network with leading consultants in real estate
                  </h2>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    TRS Property Mall brings together trusted agents and
                    verified property listings to help you close deals with
                    speed, clarity, and confidence. Making every real estate
                    decision smooth and reliable.
                  </p>
                </div>

                {/* Video Section */}
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl overflow-hidden group border border-[#C6A256]/10">
                  <video
                    src="/assets/video/trs.mp4"
                    className="w-full h-[250px] md:h-[320px] object-cover"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-[#C6A256] rounded-full flex items-center justify-center shadow-xl shadow-[#C6A256]/40"
                    >
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                    </motion.div>
                  </button>

                  {/* Video label */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">
                      Watch Introduction
                    </span>
                  </div>
                </div>

                {/* Quick action */}
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 hover:border-[#C6A256]/30 transition-all duration-300"
                >
                  <Play className="w-4 h-4 text-[#C6A256]" />
                  Talk to Expert
                </button>
              </motion.div>

              {/* ===== RIGHT COLUMN: Form (2/5) ===== */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                className="lg:col-span-2 lg:sticky lg:top-24"
              >
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 md:p-7 border border-[#C6A256]/20">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Agent Sign up
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Join our agent community today!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="First Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Last Name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="px-2.5 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-gray-400 text-xs flex items-center flex-shrink-0">
                          🇮🇳 +91
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Phone Number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:border-[#C6A256] focus:outline-none transition"
                        placeholder="Email Address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:border-[#C6A256] focus:outline-none transition"
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Experience
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-sm text-gray-400 focus:border-[#C6A256] focus:outline-none transition appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="0-2 Years">0-2 years</option>
                          <option value="2-5 Years">2-5 years</option>
                          <option value="5-10 Years">5-10 years</option>
                          <option value="10+ Years">10+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white text-xs font-medium mb-1.5 uppercase tracking-wider">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Your City"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded border-gray-700 text-[#C6A256] focus:ring-[#C6A256] bg-[#0a0a0a]"
                        required
                      />
                      <label className="text-gray-500 text-xs leading-relaxed">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-[#C6A256] hover:underline"
                        >
                          terms & conditions
                        </Link>
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-[#C6A256] to-[#D4B45F] text-[#0a0a0a] font-semibold py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-[#C6A256]/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {isSubmitting ? "Submitting..." : "Request R-Lounge Access"}
                    </motion.button>
                  </form>

                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* 🔥 STATS SECTION - COMPACT */}
       <section className="py-0">
  <div className="px-4">

    <div className="relative w-full overflow-hidden rounded-md">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/assets/images/Group 1321314989.avif"
        alt="Stats Banner"
        width={1600}
        height={150}
        className="w-full max-h-[110px] object-contain"
        priority
      />

      {/* CENTER MICRO GIF */}
      <div className="absolute inset-0 flex items-center justify-center">

        <div
          onClick={() => setShowVideoModal(true)}
          className="relative w-24 h-16 ml-55 md:w-75 md:h-44 cursor-pointer rotate-90"
        >
          <Image
            src="/assets/images/client.gif"
            alt="Video Preview"
            fill
            unoptimized
            className="object-contain"
          />
        </div>

      </div>

    </div>

  </div>
</section>






        {/* Network Benefits Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#C6A256]/10 text-[#C6A256] text-sm font-medium mb-4">
                Benefits
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                Network with leading developers
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                R-Lounge is an exclusive community for the Agents & Brokers at
                TRS Property Mall
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {networkBenefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#C6A256]/10 rounded-2xl p-6 hover:border-[#C6A256]/40 transition-all duration-300 group"
                >
                  <div className="text-[#C6A256] mb-3 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      <FeaturedProjects />

        {/* <WhatsappStrip /> */}
      </main>

      {/* Video Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
            >
              ✕
            </button>

            <div className="aspect-video">
              <video
                src="/assets/video/trs.mp4"
                className="w-full h-full rounded-2xl"
                controls
                autoPlay
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ConsultantLoungePage;



