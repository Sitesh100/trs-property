"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsappStrip from "@/components/whatsapp-strip";
import toast from "react-hot-toast";
import { useRequestBuilderLoungeAccessMutation } from "@/service/builderLoungeApi";

const BuilderLounge = () => {
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

  const [requestBuilderLoungeAccess, { isLoading: isSubmitting }] = useRequestBuilderLoungeAccessMutation();

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
      const response = await requestBuilderLoungeAccess({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: normalizedPhone,
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        experience: formData.experience || undefined,
        city: formData.city.trim() || undefined,
      }).unwrap();

      toast.success(response?.message || "Builder lounge request submitted successfully.");
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

  const benefits = [
    {
      title: "Builder Profile",
      desc: "We give builders a credible digital headquarters. A dedicated builder profile showcases the company's legacy, vision, certifications, and complete project portfolio—past, ongoing, and upcoming. It becomes a trust asset, not just a listing, positioning the builder as a brand.",
    },
    {
      title: "Lead Generation",
      desc: "Our platform acts as a growth engine, not a directory. Builders gain access to targeted marketing campaigns and qualified buyer leads driven by data, intent, and reach. From discovery to conversion, we reduce sales friction and ensure every inquiry has real purchase potential.",
    },
    {
      title: "Project Listing",
      desc: "Each project is presented with depth, clarity, and intent. Rich listings highlight floor plans, amenities, pricing, timelines, and compliance details—designed to inform, persuade, and convert. The result: faster visibility, stronger buyer confidence, and accelerated deal velocity.",
    },
    {
      title: "Agent Network",
      desc: "Builders instantly tap into a verified, performance-driven agent ecosystem. This extended sales force amplifies reach across geographies without increasing fixed costs—turning agents into distribution partners and projects into scalable opportunities.",
    },
  ];

  const builderLogos = [
    { name: "Godrej Properties", src: "/assets/images/builderLogo/GODREJ PROPERTIES.png" },
    { name: "Raymond Realty", src: "/assets/images/builderLogo/RAYMOND REALITY.png" },
    { name: "DAMAC", src: "/assets/images/builderLogo/DAMAC.png" },
    { name: "Oberoi Realty", src: "/assets/images/builderLogo/OBERAI REALITY.jpeg" },
    { name: "Kalpataru", src: "/assets/images/builderLogo/KALPATARU.png" },
    { name: "Skye Earth", src: "/assets/images/builderLogo/SKYE EARTH.png" },
    { name: "Sobha Realty", src: "/assets/images/builderLogo/SOBHA REALTY.png" },
    { name: "Bhutani Infra", src: "/assets/images/builderLogo/BHUTANI.png" },
    { name: "Bhartiya City", src: "/assets/images/builderLogo/BHARTIYA CITY.png" },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white">

        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden">

          {/* Full-width background image */}
          {/* <div className="absolute inset-0 w-full h-full">
            <Image
              src="/assets/images/detail/banner.jpg"
              alt="builder background"
              fill
              unoptimized
              className="object-top object-center"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div> */}

          <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
            <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="lg:col-span-3 space-y-6"
              >
                <div className="bg-[#111]/90 border border-[#C6A256]/30 p-8 md:p-10 rounded-2xl backdrop-blur-sm">
                  <span className="inline-block px-3 py-1.5 rounded-full bg-[#C6A256]/10 text-[#C6A256] text-xs font-medium mb-4 uppercase tracking-wider">
                    Builder Network
                  </span>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Built for Builders
                    <br />
                    <span className="text-[#C6A256]">Who Think Long-Term.</span>
                  </h1>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                    TRS Property Mall is not just a marketplace. It is a strategic ecosystem designed to empower builders at every stage of growth. From brand presence to sales enablement, we bring technology and marketing under one roof.
                  </p>

                  <a
                    href="#builder-benefits"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 hover:border-[#C6A256]/30 transition-all duration-300"
                  >
                    Explore Builder Benefits
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                className="lg:col-span-2 lg:sticky lg:top-24"
              >
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 md:p-7 border border-[#C6A256]/20">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Builder Sign up
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Join our builder community today!
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
                        <div className="px-2.5 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-xl text-gray-400 text-xs flex items-center shrink-0">
                          IN +91
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
                        <Link href="/terms" className="text-[#C6A256] hover:underline">
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
                      {isSubmitting ? "Submitting..." : "Request Builder Lounge Access"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= BENEFITS SECTION ================= */}
        <section id="builder-benefits" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Benefits For Builders
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-transparent hover:bg-[#111] transition text-center"
                >
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TRUSTED BUILDERS SECTION ================= */}
        <section className="py-8">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-6 items-center">

            {/* LEFT TEXT */}
            <div>
              <h2 className="text-4xl font-bold leading-snug">
                Trusted by
                <br />
                leading builders
                <br />
                &amp; developers.
              </h2>
            </div>

            {/* RIGHT LOGO GRID — all boxes same fixed size, image fills/zooms to show brand clearly */}
            <div className="grid grid-cols-3 gap-4">
              {builderLogos.map((logo, i) => (
                <div
                  key={i}
                  className="bg-white flex items-center justify-center overflow-hidden"
                  style={{ width: "100%", aspectRatio: "2/1" }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 33vw, 15vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WhatsappStrip />

      </main>

      <Footer />
    </>
  );
};

export default BuilderLounge;