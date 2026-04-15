"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Trophy, Award } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const awardImages = [
  { id: 1, src: '/assets/images/awards/Pasted image.png', alt: 'Award Ceremony 1', label: 'Excellence Award 2024' },
  // { id: 2, src: '/assets/images/awards/Pasted image (2).png', alt: 'Award Ceremony 2', label: 'Best Developer 2024' },
  { id: 3, src: '/assets/images/awards/Pasted image (3).png', alt: 'Award Ceremony 3', label: 'Industry Leader' },
  { id: 4, src: '/assets/images/awards/Pasted image (4).png', alt: 'Award Ceremony 4', label: 'Innovation Award' },
  { id: 5, src: '/assets/images/awards/Pasted image (5).png', alt: 'Award Ceremony 5', label: 'Top Performer' },
  { id: 6, src: '/assets/images/awards/Pasted image (6).png', alt: 'Award Ceremony 6', label: 'Recognition 2023' },
  { id: 7, src: '/assets/images/awards/Pasted image (7).png', alt: 'Award Ceremony 7', label: 'Legacy Award' },
]

const FounderAwardSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [autoplayPlugin.current]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && setLightboxOpen(false)
    if (lightboxOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [lightboxOpen])

  return (
    <section className="relative py-20 bg-[#161616] overflow-hidden">

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(198,162,86,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,162,86,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Gold radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(198,162,86,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative container mx-auto px-4 md:px-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#C6A256]" />
              <span className="text-[#C6A256] text-xs font-semibold uppercase tracking-[0.2em]">
                Milestones
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#F5EFE7] leading-tight">
              Awards &amp;
              <br />
              <span className="text-[#C6A256]">Recognition</span>
            </h2>
          </div>

          {/* Stats */}
          <div className="flex gap-8 md:gap-12">
            {[
              { value: '15+', label: 'Awards Won' },
              { value: '8+', label: 'Years of Excellence' },
              { value: '50+', label: 'Recognitions' },
            ].map((stat) => (
              <div key={stat.label} className="text-right">
                <p className="text-3xl font-bold text-[#C6A256]">{stat.value}</p>
                <p className="text-xs text-[#F5EFE7]/50 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3-CARD SLIDER ── */}
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {awardImages.map((image, index) => (
              <div
                key={image.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-4"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => openLightbox(index)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group border border-[#C6A256]/10 hover:border-[#C6A256]/40 transition-colors duration-300"
                  style={{ aspectRatio: '4/3' }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/75 via-[#0d0d0d]/10 to-transparent" />

                  {/* Gold corner accent */}
                  <div className="absolute top-0 left-0">
                    <div className="absolute top-0 left-0 w-10 h-[2px] bg-[#C6A256]" />
                    <div className="absolute top-0 left-0 w-[2px] h-10 bg-[#C6A256]" />
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0d0d0d]/60 backdrop-blur-sm border border-[#C6A256]/30 flex items-center justify-center">
                    <span className="text-[#C6A256] text-[10px] font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy className="w-3 h-3 text-[#C6A256]" />
                      <span className="text-[#C6A256] text-[10px] font-semibold uppercase tracking-widest">Award</span>
                    </div>
                    <p className="text-[#F5EFE7] font-semibold text-sm">{image.label}</p>
                  </div>

                  {/* Zoom icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-11 h-11 rounded-full bg-[#0d0d0d]/50 backdrop-blur-sm border border-[#C6A256]/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#C6A256]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex items-center justify-between mt-8">
          {/* Dot indicators */}
          <div className="flex gap-1.5 items-center">
            {awardImages.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedIndex % awardImages.length
                    ? 'w-6 h-1.5 bg-[#C6A256]'
                    : 'w-1.5 h-1.5 bg-[#F5EFE7]/20 hover:bg-[#F5EFE7]/40'
                }`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollPrev}
              className="w-11 h-11 rounded-full border border-[#F5EFE7]/15 flex items-center justify-center text-[#F5EFE7]/50 hover:border-[#C6A256]/60 hover:text-[#C6A256] transition-all duration-300 bg-[#212121]/40"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollNext}
              className="w-11 h-11 rounded-full bg-[#C6A256] flex items-center justify-center text-[#161616] hover:bg-[#d4b06a] transition-all duration-300 shadow-lg shadow-[#C6A256]/20"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* ── BOTTOM STRIP ── */}
        <div className="mt-10 pt-8 border-t border-[#C6A256]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#F5EFE7]/40 text-sm">
            Recognised by India's top real estate institutions &amp; developer bodies
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#C6A256]/20 bg-[#C6A256]/5">
            <Award className="w-4 h-4 text-[#C6A256]" />
            <span className="text-[#C6A256] text-xs font-semibold uppercase tracking-widest">
              {awardImages.length} Ceremonies Captured
            </span>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="fixed inset-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
            >
              <div className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden border border-[#C6A256]/20 shadow-2xl pointer-events-auto">
                <Image
                  src={awardImages[lightboxIndex].src}
                  alt={awardImages[lightboxIndex].alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-[#C6A256]" />
                    <span className="text-[#C6A256] text-xs uppercase tracking-widest font-semibold">Award</span>
                  </div>
                  <p className="text-[#F5EFE7] text-xl font-semibold">{awardImages[lightboxIndex].label}</p>
                </div>

                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#161616]/70 backdrop-blur-sm border border-[#F5EFE7]/10 flex items-center justify-center text-[#F5EFE7] hover:border-[#C6A256]/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setLightboxIndex((lightboxIndex - 1 + awardImages.length) % awardImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#161616]/70 backdrop-blur-sm border border-[#F5EFE7]/10 flex items-center justify-center text-[#F5EFE7] hover:border-[#C6A256]/40 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % awardImages.length)}
                  className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#161616]/70 backdrop-blur-sm border border-[#F5EFE7]/10 flex items-center justify-center text-[#F5EFE7] hover:border-[#C6A256]/40 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

export default FounderAwardSection