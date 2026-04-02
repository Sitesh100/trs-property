"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Linkedin, Instagram, CheckCircle, Clock, Users, Globe } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import toast from 'react-hot-toast'
import { useSubmitLeadMutation } from '@/service/leadsApi'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitLead, { isLoading: isSubmitting }] = useSubmitLeadMutation()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fullName = `${formData.firstName} ${formData.lastName}`.trim()

    try {
      const response = await submitLead({
        name: fullName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service_type: 'Contact Us',
        message: formData.message.trim() || undefined,
      }).unwrap()

      toast.success(response?.message || 'Thanks for contacting us. Our team will reach out shortly.')
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    } catch (err) {
      toast.error(err?.data?.detail || err?.data?.message || 'Failed to submit contact request. Please try again.')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const stats = [
    { icon: Clock, value: "25+", label: "Years Experience" },
    { icon: Users, value: "10K+", label: "Happy Clients" },
    { icon: Globe, value: "Pan India", label: "Consulting" },
    { icon: CheckCircle, value: "500+", label: "Projects Completed" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/assets/images/bgimage.jpg"
              alt="Contact Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Need help? <span className="text-[#C6A256]">Talk to our expert.</span>
              </motion.h1>
              <motion.p
                className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                We at TRS Property Mall are always approachable.
                <br />
                All you need to do is reach out to us.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 bg-[#C6A256] rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Main Contact Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#0a0a0a] via-[#0d0a14] to-[#0a0a0a] relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B46C1]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#492974]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">

            {/* Equal-height two columns — height driven by image column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

              {/* Left — India Map (no bg, blends into page) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false }}
                className="flex items-center justify-center"
              >
                <Image
                  src="/assets/images/india.png"
                  alt="India Map"
                  width={600}
                  height={700}
                  unoptimized
                  className="w-full h-[575px] object-contain drop-shadow-2xl"
                  style={{ mixBlendMode: 'screen' }}
                />
              </motion.div>

              {/* Right — Contact Form (no bg, no border, matches image height) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false }}
                className="flex flex-col justify-between py-2"
              >
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Get in Touch</h2>
                  <p className="text-white/50">Fill out the form and our team will get back to you within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:border-[#C6A256] focus:outline-none transition-colors duration-300"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:border-[#C6A256] focus:outline-none transition-colors duration-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:border-[#C6A256] focus:outline-none transition-colors duration-300"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:border-[#C6A256] focus:outline-none transition-colors duration-300"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="block text-white/70 text-sm mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full flex-1 bg-transparent border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:border-[#C6A256] focus:outline-none transition-colors duration-300 resize-none min-h-[80px]"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                      isSubmitted
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-[#C6A256] to-[#a8893f] text-[#0a0a0a] hover:shadow-lg hover:shadow-[#C6A256]/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-[#0a0a0a] border-t-transparent rounded-full"
                      />
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* 4 Stats in one row below */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[#12121a] border border-white/5 rounded-2xl p-6 text-center hover:border-[#6B46C1]/30 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-[#C6A256] mx-auto mb-3" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* Google Map Section */}
        <section className="relative h-[400px] md:h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.123456789!2d75.8577258!3d22.7195687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTRS%20Property%20Mall!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(80%) invert(92%) contrast(90%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent pointer-events-none h-20"></div>
        </section>

        {/* Contact Info Bar */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/assets/images/bgimage.jpg"
              alt="Contact Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={containerVariants}
              className="bg-[#0d0a14]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6B46C1] to-[#492974] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">Call</h3>
                  <a href="tel:+919425092651" className="text-[#C6A256] text-lg hover:text-white transition-colors duration-300">
                    +91-9425092651
                  </a>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6B46C1] to-[#492974] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">Email</h3>
                  <a href="mailto:info@trspropertymall.com" className="text-[#C6A256] text-lg hover:text-white transition-colors duration-300">
                    info@trspropertymall.com
                  </a>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6B46C1] to-[#492974] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-4">Follow</h3>
                  <div className="flex items-center justify-center gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#C6A256] hover:border-[#C6A256] hover:text-[#0a0a0a] transition-all duration-300"
                      >
                        <social.icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0d0a14]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Offices</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#6B46C1] to-[#C6A256] mx-auto"></div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-[#12121a] border border-white/5 rounded-2xl p-8 hover:border-[#6B46C1]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#C6A256] to-[#a8893f] rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Corporate Office</h3>
                <p className="text-white/60 leading-relaxed">
                  Scheme No 140, 1, The Row Eight,<br />
                  opp. Grande Exotica, Pipliyahana,<br />
                  Bicholi Mardana, Indore - 452016
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-[#12121a] border border-white/5 rounded-2xl p-8 hover:border-[#6B46C1]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#C6A256] to-[#a8893f] rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">R - Lounge</h3>
                <p className="text-white/60 leading-relaxed">
                  MZ-11, Bansi Trade Centre, 581,<br />
                  Mahatma Gandhi Rd, Opp. Jaipur Jewels,<br />
                  Race Course Road, Indore - 452003
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ContactPage