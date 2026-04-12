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
import { useRegisterBuilderMutation } from "@/service/authApi";

const BuilderLounge = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPersonName: "",
    reraRegistrationNumber: "",
    companyAddress: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    password: "",
    city: "",
    agreeTerms: false,
  });

  const [registerBuilder, { isLoading: isSubmitting }] = useRegisterBuilderMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedPhone = formData.phone.replace(/\D/g, "").trim();
    const sanitizedWhatsapp = formData.whatsappNumber.replace(/\D/g, "").trim();
    const normalizedPhone = sanitizedPhone.startsWith("91") && sanitizedPhone.length > 10
      ? `+${sanitizedPhone}`
      : `+91${sanitizedPhone}`;
    const normalizedWhatsapp = sanitizedWhatsapp
      ? (sanitizedWhatsapp.startsWith("91") && sanitizedWhatsapp.length > 10
          ? `+${sanitizedWhatsapp}`
          : `+91${sanitizedWhatsapp}`)
      : "";

    try {
      const response = await registerBuilder({
        companyName: formData.companyName.trim(),
        contactPersonName: formData.contactPersonName.trim(),
        reraRegistrationNumber: formData.reraRegistrationNumber.trim(),
        companyAddress: formData.companyAddress.trim(),
        phone: normalizedPhone,
        whatsappNumber: normalizedWhatsapp || undefined,
        email: formData.email.trim(),
        password: formData.password,
        city: formData.city.trim(),
      }).unwrap();

      toast.success(response?.message || "Builder registration successful. Please login.");

      window.dispatchEvent(
        new CustomEvent("open-auth-modal", {
          detail: {
            tab: "sendOtp",
            sendOtpInfo: {
              email: formData.email.trim(),
              role: "builder",
            },
          },
        }),
      );

      setFormData({
        companyName: "",
        contactPersonName: "",
        reraRegistrationNumber: "",
        companyAddress: "",
        phone: "",
        whatsappNumber: "",
        email: "",
        password: "",
        city: "",
        agreeTerms: false,
      });
    } catch (err) {
      toast.error(err?.data?.detail || err?.data?.message || "Failed to register. Please try again.");
    }
  };

  const openLoginPopup = () => {
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: {
          tab: "sendOtp",
          sendOtpInfo: {
            email: formData.email.trim(),
            role: "builder",
          },
        },
      }),
    );
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

      <main className="min-h-screen bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] text-[#F5EFE7]">

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
            <div className="absolute inset-0 bg-[#212121]/60" />
          </div> */}

          <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
            <div className="grid lg:grid-cols-[45%_55%] gap-8 xl:gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-[#212121]/90 border border-[#C6A256]/30 p-8 md:p-10 rounded-2xl backdrop-blur-sm">
                  <span className="inline-block px-3 py-1.5 rounded-full bg-[#C6A256]/10 text-[#C6A256] text-xs font-medium mb-4 uppercase tracking-wider">
                    Builder Network
                  </span>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Built for Builders
                    <br />
                    <span className="text-[#C6A256]">Who Think Long-Term.</span>
                  </h1>

                  <p className="text-[#F5EFE7] text-sm md:text-base leading-relaxed mb-6">
                    TRS Property Mall is not just a marketplace. It is a strategic ecosystem designed to empower builders at every stage of growth. From brand presence to sales enablement, we bring technology and marketing under one roof.
                  </p>

                  <a
                    href="#builder-benefits"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5EFE7]/5 border border-[#F5EFE7]/10 text-[#F5EFE7] rounded-xl text-sm font-medium hover:bg-[#F5EFE7]/10 hover:border-[#C6A256]/30 transition-all duration-300"
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
                className="lg:sticky lg:top-24"
              >
                <div className="bg-gradient-to-br from-[#212121] to-[#212121] rounded-2xl p-6 md:p-7 border border-[#C6A256]/20">
                  <h3 className="text-xl font-bold text-[#F5EFE7] mb-1">
                    Builder Sign up
                  </h3>
                  <p className="text-[#F5EFE7] text-sm mb-6">
                    Create your builder account and continue to{" "}
                    <button
                      type="button"
                      onClick={openLoginPopup}
                      className="text-[#C6A256] hover:underline font-semibold"
                    >
                      Login
                    </button>
                    .
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-xs font-semibold text-[#F5EFE7] mb-1 uppercase tracking-wide">
                      Company Information
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Contact Person Name
                        </label>
                        <input
                          type="text"
                          name="contactPersonName"
                          value={formData.contactPersonName}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Enter contact person name"
                        />
                      </div>

                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          RERA Registration Number
                        </label>
                        <input
                          type="text"
                          name="reraRegistrationNumber"
                          value={formData.reraRegistrationNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Enter RERA registration number"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Company Address
                        </label>
                        <textarea
                          name="companyAddress"
                          value={formData.companyAddress}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition resize-none"
                          placeholder="Enter company address"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[#F5EFE7]/15 pt-2">
                      <label className="block text-xs font-semibold text-[#F5EFE7] mb-1 uppercase tracking-wide">
                        Contact & Login Details
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Phone
                        </label>
                        <div className="flex gap-2">
                          <div className="px-2.5 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-xs flex items-center shrink-0">
                            IN +91
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          WhatsApp Number
                        </label>
                        <div className="flex gap-2">
                          <div className="px-2.5 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-xs flex items-center shrink-0">
                            IN +91
                          </div>
                          <input
                            type="tel"
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                            placeholder="WhatsApp Number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Email Address"
                        />
                      </div>

                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Enter password"
                          minLength={6}
                        />
                      </div>

                      <div>
                        <label className="block text-[#F5EFE7] text-xs font-medium mb-1.5 uppercase tracking-wider">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-[#212121] border border-[#F5EFE7] rounded-xl text-[#F5EFE7] text-sm placeholder-[#F5EFE7] focus:border-[#C6A256] focus:outline-none transition"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded border-[#F5EFE7] text-[#C6A256] focus:ring-[#C6A256] bg-[#212121]"
                      />
                      <label className="text-[#F5EFE7] text-xs leading-relaxed">
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
                      className="w-full bg-gradient-to-r from-[#C6A256] to-[#C6A256] text-[#212121] font-semibold py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-[#C6A256]/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {isSubmitting ? "Submitting..." : "Create Account"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= BENEFITS SECTION ================= */}
        <section id="builder-benefits" className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(10,31,61,0.5),transparent_50%),radial-gradient(circle_at_82%_88%,rgba(24,55,102,0.22),transparent_45%),linear-gradient(180deg,#181c25_0%,#1e222c_55%,#212121_100%)]" />
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(245,239,231,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(245,239,231,0.12)_1px,transparent_1px)] bg-size-[44px_44px]" />
          </div>

          <div className="relative container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Benefits For Builders
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-transparent hover:bg-[#0A1F3D]/25 hover:backdrop-blur-[1px] transition text-center rounded-xl"
                >
                  <h3 className="text-lg font-semibold mb-4 text-[#F5EFE7]">
                    {item.title}
                  </h3>
                  <p className="text-[#F5EFE7] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TRUSTED BUILDERS SECTION ================= */}
        <section className="relative py-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(10,31,61,0.28)_0%,rgba(10,31,61,0.1)_34%,rgba(33,33,33,0)_70%)]" />

          <div className="relative container mx-auto px-4 grid lg:grid-cols-2 gap-6 items-center">

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
                  className="bg-[#F5EFE7] border border-[#0A1F3D]/20 shadow-[0_8px_24px_rgba(10,31,61,0.16)] flex items-center justify-center overflow-hidden"
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