"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Award, Users, Globe, Target, Handshake, TrendingUp, Play, Instagram, Linkedin, Twitter, Facebook, X } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import FounderAwardSection from '@/components/home/founder-award-section'
import TrsOfficeSection from '@/components/about/trs-office-section'
// import VideoTestimonialsSection from '@/components/home/video-testimonials-section'

const AboutPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showFounderVideo, setShowFounderVideo] = useState(false)

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  const { ref: valuesRef, inView: valuesInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const { ref: founderRef, inView: founderInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  const coreValues = [
    {
      icon: Users,
      title: "Customer Centricity",
      description: "We place our clients at the heart of everything, building relationships grounded in trust, honesty, and exceptional service.",
      gradient: "from-[#212121]/20 to-[#C6A256]/20"
    },
    {
      icon: Handshake,
      title: "Integrity",
      description: "We uphold transparency and authenticity in every interaction, ensuring our solutions are honest and value-driven.",
      gradient: "from-[#212121]/20 to-[#212121]/20"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously embrace technology and unique business models to enhance stakeholder growth and customer experience.",
      gradient: "from-[#C6A256]/20 to-[#212121]/20"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "At TRS we strive for unparalleled quality in delivering seamless, hassle-free real estate experiences.",
      gradient: "from-[#212121]/20 to-[#212121]/20"
    },
    {
      icon: Target,
      title: "Collaboration",
      description: "We nurture growth for employees, agents, builders, and clients alike through mutually beneficial partnerships.",
      gradient: "from-[#212121]/20 to-[#212121]/20"
    },
    {
      icon: Globe,
      title: "Global Mindset",
      description: "We aim to serve every household, large or small, with a vision to expand our real estate solutions worldwide.",
      gradient: "from-[#212121]/20 to-[#C6A256]/20"
    }
  ]

  const podcasts = [
    {
      title: "#EventTalk: Here are glimpses of the Association of Indore Realty Experts...",
      thumbnail: "/assets/images/project/project1.jpg",
      videoId: "6VSZe51wWfE"
    },
    {
      title: "इस रियलएस्टेट Podcast में, सुनिए हमारे Founder & CEO, Manoj Dhanotiya, और...",
      thumbnail: "/assets/images/project/project2.jpg",
      videoId: "GD55ofLDIyI"
    },
    {
      title: "Gajendra Narang - MD of Total Solution India Private Limited speaks...",
      thumbnail: "/assets/images/project/project3.jpg",
      videoId: "XzNCWz-ylus"
    },
    {
      title: "In this Investor Edition of the On Point Real Estate Podcast, Siddhant Mehta...",
      thumbnail: "/assets/images/project/project1.jpg",
      videoId: "GTQsCPTDDA4"
    }
  ]

  const blogPosts = [
    {
      title: "Commercial Space Growth Drivers, Opportunities, and...",
      readTime: "4 min read",
      image: "/assets/images/property/property1.jpg"
    },
    {
      title: "Exploring the Surge in India's Real Estate Market: Drivers,...",
      readTime: "4 min read",
      image: "/assets/images/property/property2.jpg"
    },
    {
      title: "Fractional ownership in real estate: How it works and its benefits",
      readTime: "3 min read",
      image: "/assets/images/property/property3.jpg"
    },
    {
      title: "Top reasons why homebuyers are considering this villa...",
      readTime: "3 min read",
      image: "/assets/images/property/property1.jpg"
    }
  ]

  const serviceColumns = [
    [
      {
        title: "1. Property Transactions",
        points: [
          "Residential & Commercial Sales & Leasing",
          "Luxury & Vacation Home Consulting",
          "Investment Property Sales",
        ],
      },
      {
        title: "2. Investment Consulting",
        points: [
          "High-Yield Property Market Analysis",
          "Portfolio Diversification & Risk Assessment",
          "Joint Venture & Partnership Opportunities",
        ],
      },
      {
        title: "3. Project Advisory",
        points: [
          "Feasibility Studies & Market Research",
          "Project Planning & Regulatory Approvals",
          "Pre-Launch Sales & Pricing Strategy",
        ],
      },
      {
        title: "4. Land Services",
        points: [
          "Land Acquisition & Valuation",
          "Zoning, Due Diligence & Developer Connections",
          "Agricultural Land Conversion",
        ],
      },
    ],
    [
      {
        title: "5. Leasing & Rental Management",
        points: [
          "Tenant Sourcing & Lease Negotiation",
          "Rent Collection & Property Maintenance",
          "Short-Term Rental Advisory (Airbnb, etc.)",
        ],
      },
      {
        title: "6. Marketing & Branding",
        points: [
          "Real Estate Project Branding & Lead Generation",
          "Digital & Offline Marketing Strategies",
          "Professional Photography & Videography",
        ],
      },
      {
        title: "7. Legal & Compliance Advisory",
        points: [
          "Title Search & Ownership Verification",
          "RERA Registration & Compliance",
          "Taxation & Documentation Support",
        ],
      },
      {
        title: "8. Property Valuation & Vastu",
        points: [
          "Sales & Rental Yield Valuation",
          "Commercial & Re-Development Assessment",
          "Vastu Consultation",
        ],
      },
    ],
    [
      {
        title: "9. Property Management",
        points: [
          "Maintenance & Renovation Advisory",
          "Tenant Issue Resolution & Asset Tracking",
        ],
      },
      {
        title: "10. Relocation Services",
        points: [
          "End-to-End Relocation Assistance",
          "Temporary Housing & Community Guidance",
        ],
      },
      {
        title: "11. Real Estate Development Consulting",
        points: [
          "PMC & Developer Network Building",
          "Architect, Builder & Engineer Partnerships",
          "Financing & Fundraising Advisory",
        ],
      },
      {
        title: "12. Real Estate Technology Integration",
        points: [
          "CRM Implementation & Analytics Tools",
          "Virtual Tours & AR/VR Property Marketing",
        ],
      },
      {
        title: "13. Real Estate Education & Training",
        points: [
          "Buyer & Investor Workshops",
          "Agent Sales Training & Market Insights",
        ],
      },
    ],
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#212121] via-[#212121] to-[#212121] text-[#F5EFE7] overflow-hidden">
        {/* Video Modals */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              {/* Backdrop with blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#212121]/90 via-[#212121]/85 to-[#212121]/90 backdrop-blur-md" />
              
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl aspect-video bg-gradient-to-br from-[#212121] to-[#212121] rounded-2xl overflow-hidden shadow-2xl border border-[#C6A256]/30"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#212121]/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#212121]/80 transition-colors"
                >
                  <X className="w-6 h-6 text-[#F5EFE7]" />
                </button>

                {/* YouTube Embed */}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </motion.div>
            </motion.div>
          )}

          {showFounderVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowFounderVideo(false)}
            >
              {/* Backdrop with blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#212121]/90 via-[#212121]/85 to-[#212121]/90 backdrop-blur-md" />
              
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl bg-gradient-to-br from-[#212121] to-[#212121] rounded-2xl overflow-hidden shadow-2xl border border-[#C6A256]/30"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowFounderVideo(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#212121]/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#212121]/80 transition-colors"
                >
                  <X className="w-6 h-6 text-[#F5EFE7]" />
                </button>

                {/* Local Video */}
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
            </motion.div>
          )}
        </AnimatePresence>
        {/* Hero Section with Mission & Vision */}
        <section ref={heroRef} className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 z-10" />
            <Image
              src="https://images.pexels.com/photos/19157992/pexels-photo-19157992.jpeg"
              alt="Total Realty Solutions"
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto text-center"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto max-w-[1950px] text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight"
              >
                <span className="text-[#F5EFE7]">TRS Property Mall</span> is a venture of Total Realty Solutions (India) Pvt Ltd,
                {/* <br className="hidden md:block" /> */}
                a trusted{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256]">
                  PAN India
                </span>{" "}
                real estate consultancy with{" "}
                {/* <br className="hidden md:block" /> */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256]">
                   25+ years
                </span>{" "}
                of legacy, offering end to end property solutions{" "}
                {/* <br className="hidden md:block" /> */}
                in residential, commercial, leasing, and investment segments.
              </motion.h1>

              {/* Mission & Vision Cards */}
              <div className="grid md:grid-cols-2 gap-6 mt-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-gradient-to-br from-[#212121]/30 to-[#212121]/40 backdrop-blur-sm p-8 rounded-2xl border border-[#C6A256]/20 hover:border-[#C6A256]/40 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4 text-[#C6A256]">OUR MISSION</h3>
                  <p className="text-[#F5EFE7] leading-relaxed">
                    To deliver end-to-end, transparent, and technologically empowered real estate solutions tailored to each client's unique needs, fostering trust, comfort, and lasting value across residential, commercial, leasing, and investment domains worldwide.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-gradient-to-br from-[#212121]/30 to-[#212121]/40 backdrop-blur-sm p-8 rounded-2xl border border-[#C6A256]/20 hover:border-[#C6A256]/40 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4 text-[#C6A256]">OUR VISION</h3>
                  <p className="text-[#F5EFE7] leading-relaxed">
                    To be the world's most trusted and innovative 360-degree real estate partner, transforming how individuals and businesses experience property solutions by making hassle-free, authentic, and scalable realty services accessible to every household globally.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

       

        {/* Founder's Desk Section */}
        <section ref={founderRef} className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#212121] via-[#212121] to-[#212121]/15" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={founderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Founder's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFE7] via-[#C6A256] to-[#C6A256]">Desk</span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={founderInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#212121]/30 to-[#C6A256]/30 rounded-2xl lg:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border border-[#C6A256]/30 cursor-pointer"
                  onClick={() => setShowFounderVideo(true)}
                >
                  <video
                    src="/assets/video/trs.mp4"
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#212121]/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#C6A256]/30">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-[#C6A256] ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={founderInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4 md:space-y-6"
              >
                <p className="text-base md:text-xl lg:text-2xl text-[#F5EFE7] leading-relaxed italic">
                  TRS embodies Trust, the cornerstone of our business; Relationships, the bridge to lasting partnerships; and Success, the result of our unwavering commitment to Transparency, Responsibility, and Sustainability. Guided by Tradition, powered by Talent, and driven by a passion for exceptional Service, we build a future you can rely on.
                </p>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#F5EFE7] mb-2">Rtn. Dr. Gajendra Narang</h3>
                  <p className="text-sm md:text-base text-[#C6A256] font-semibold mb-4">CHAIRMAN & MANAGING DIRECTOR</p>
                  <div className="flex gap-3 md:gap-4">
                    <a href="https://www.instagram.com/gajendrasinghnarang/" className="w-10 h-10 bg-[#212121]/20 rounded-full flex items-center justify-center hover:bg-[#212121]/40 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/dr-gajendra-singh-narang-93000631/" className="w-10 h-10 bg-[#212121]/20 rounded-full flex items-center justify-center hover:bg-[#212121]/40 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://www.facebook.com/gajendra.narang/" className="w-10 h-10 bg-[#212121]/20 rounded-full flex items-center justify-center hover:bg-[#212121]/40 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Growth Leader Section */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={founderInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4 md:space-y-6 order-2 lg:order-1"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFE7] via-[#C6A256] to-[#C6A256]">Leader</span>
                </h2>
                <div className="text-4xl md:text-6xl text-[#C6A256] opacity-50">"</div>
                <p className="text-base md:text-lg lg:text-xl text-[#F5EFE7] leading-relaxed italic">
                  Not Just Selling Property. Redefining the Experience Around it. I see real estate as more than transactions. For me, it is a system—where branding, data, digital tools, and market psychology work together, built on transparency and long-term trust. My focus is to innovate, digitise, and simplify the entire property journey removing friction, confusion, and guesswork to deliver a seamless, end-to-end experience rooted in clarity, confidence, and credibility for buyers, investors, and developers.
                </p>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#F5EFE7] mb-2">Sammartha Narang</h3>
                  <p className="text-sm md:text-base text-[#C6A256] font-semibold mb-4">CHIEF OF SALES & MARKETING</p>
                  <div className="flex gap-3 md:gap-4">
                    <a href="https://www.linkedin.com/in/sammartha-narang-44446b134/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" className="w-10 h-10 bg-[#212121]/20 rounded-full flex items-center justify-center hover:bg-[#212121]/40 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    {/* <a href="#" className="w-10 h-10 bg-[#212121]/20 rounded-full flex items-center justify-center hover:bg-[#212121]/40 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#212121]/20 rounded-full flex items-center justify-center hover:bg-[#212121]/40 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a> */}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={founderInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative group order-1 lg:order-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C6A256]/30 to-[#212121]/30 rounded-2xl lg:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-[400px] md:h-[500px] lg:h-[550px] rounded-2xl lg:rounded-3xl overflow-hidden border border-[#C6A256]/30">
                  <Image
                    src="/assets/images/femal.jpeg"
                    alt="Growth Leader"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/70 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

                       {/* Core Values Section */}
        <section ref={valuesRef} className="py-10 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#212121] via-[#212121]/15 to-[#212121]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFE7] via-[#C6A256] to-[#C6A256]">Values</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative bg-gradient-to-br from-[#212121] to-[#212121] md:p-8 p-4 rounded-2xl border border-[#C6A256]/20 hover:border-[#C6A256]/50 transition-all duration-300 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#212121]/20 to-[#C6A256]/20 rounded-xl">
                        <value.icon className="w-6 h-6 text-[#C6A256]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#F5EFE7] transition-all duration-300">
                      {value.title}
                    </h3>
                    <p className="text-[#F5EFE7] leading-tight">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="pt-10 md:p-6 relative overflow-hidden">
          <div />
         

          <FounderAwardSection />
        </section>

        

        {/* Real Estate Services */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#212121] via-[#212121]/20 to-[#212121]" />
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#C6A256]/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#C6A256]/10 blur-3xl rounded-full" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="relative bg-gradient-to-br from-[#212121]/95 via-[#212121]/90 to-[#212121]/95 border border-[#C6A256]/25 rounded-3xl p-6 md:p-10 lg:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 md:mb-10">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-[#F5EFE7] leading-tight">
                    Real Estate Services <span className="text-[#C6A256]">- Connect With Us</span>
                  </h2>
                  <div className="h-0.5 w-28 bg-gradient-to-r from-[#C6A256] to-transparent mt-3" />
                  <p className="mt-3 text-[#F5EFE7]/75 text-base md:text-xl font-semibold">
                    (We work on for Mandate Sales PAN India)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                {serviceColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-6">
                    {column.map((service) => (
                      <div key={service.title} className="group">
                        <h3 className="text-xl md:text-2xl leading-tight font-bold text-[#C6A256] group-hover:text-[#F5EFE7] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <ul className="mt-2 space-y-1.5 text-[#F5EFE7]/90 text-sm md:text-base leading-relaxed">
                          {service.points.map((point) => (
                            <li key={point} className="flex items-start gap-2">
                              <span className="text-[#C6A256] mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TrsOfficeSection />

        {/* Recent Podcasts & Video Highlights */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#212121] via-[#212121]/15 to-[#212121]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Recent Podcasts & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFE7] via-[#C6A256] to-[#C6A256]">Video Highlights</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {podcasts.map((podcast, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: false }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedVideo(podcast.videoId)}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#C6A256]/20 group-hover:border-[#C6A256]/50 transition-colors">
                    <Image
                      src={`https://img.youtube.com/vi/${podcast.videoId}/maxresdefault.jpg`}
                      alt={podcast.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/60 to-transparent group-hover:from-[#212121]/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-[#212121]/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#C6A256]/40">
                        <Play className="w-6 h-6 text-[#C6A256] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#F5EFE7] line-clamp-2 group-hover:text-[#C6A256] transition-colors">
                    {podcast.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
       
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
