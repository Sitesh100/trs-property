"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

const VIDEO_TESTIMONIALS = [
  {
    id: 1,
    name: "Client Testimonial 01",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial1.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 2,
    name: "Client Testimonial 02",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial2.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 3,
    name: "Client Testimonial 03",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial3.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 4,
    name: "Client Testimonial 04",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial4.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 5,
    name: "Client Testimonial 05",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial5.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 6,
    name: "Client Testimonial 06",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial6.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 7,
    name: "Client Testimonial 07",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial7.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 8,
    name: "Client Testimonial 08",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial8.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
  {
    id: 9,
    name: "Client Testimonial 09",
    sources: [
      {
        src: "https://amzn-s3-bucket-trsmallproperties.s3.ap-south-1.amazonaws.com/testimonials/testimonial/testimonial9.mp4",
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
      },
    ],
  },
]

const STATS = [
  { value: "500+", label: "Happy Clients" },
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Properties Sold" },
  { value: "98%", label: "Satisfaction Rate" },
]

const canPlayMediaType = (mediaType) => {
  if (!mediaType || typeof document === "undefined") return true
  const el = document.createElement("video")
  return el.canPlayType(mediaType) !== ""
}

const getPlayableSource = (testimonial) => {
  return testimonial.sources.find((source) => canPlayMediaType(source.type)) || null
}

const UnsupportedVideoCard = ({ compact = false }) => (
  <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-[#212121]">
    <div>
      <p className="text-[#F5EFE7] text-sm font-semibold">Video format not supported</p>
      {!compact && (
        <p className="text-[#F5EFE7]/60 text-xs mt-1">Please use H.264 MP4 for browser playback.</p>
      )}
    </div>
  </div>
)

const VideoTestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [erroredIds, setErroredIds] = useState([])
  const [isMiniRailPaused, setIsMiniRailPaused] = useState(false)
  const activeVideoRef = useRef(null)
  const miniSliderRef = useRef(null)

  const activeVideo = VIDEO_TESTIMONIALS[activeIndex]
  const activeSource = useMemo(() => getPlayableSource(activeVideo), [activeVideo])
  const isErrored = erroredIds.includes(activeVideo.id)

  useEffect(() => {
    const player = activeVideoRef.current
    if (!player || !activeSource) return
    const playPromise = player.play()
    if (playPromise?.catch) playPromise.catch(() => {})
  }, [activeIndex, isMuted, activeSource])

  const miniCards = useMemo(() => {
    const order = []
    for (let step = 1; step <= VIDEO_TESTIMONIALS.length - 1; step++) {
      order.push((activeIndex + step) % VIDEO_TESTIMONIALS.length)
    }
    return order
  }, [activeIndex])

  const handleMiniClick = (index) => {
    setActiveIndex(index)
    setIsMuted(false)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + VIDEO_TESTIMONIALS.length) % VIDEO_TESTIMONIALS.length)
    setIsMuted(true)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % VIDEO_TESTIMONIALS.length)
    setIsMuted(true)
  }

  const handleActiveVideoEnded = () => {
    setActiveIndex((prev) => (prev + 1) % VIDEO_TESTIMONIALS.length)
    setIsMuted(true)
  }

  useEffect(() => {
    const slider = miniSliderRef.current
    if (!slider) return
    let frameId = null
    let lastTime = 0
    const speed = 22

    const drift = (time) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time
      if (!isMiniRailPaused) {
        const maxScroll = slider.scrollWidth - slider.clientWidth
        if (maxScroll > 2) {
          slider.scrollLeft += (speed * delta) / 1000
          if (slider.scrollLeft >= maxScroll - 1) slider.scrollLeft = 0
        }
      }
      frameId = window.requestAnimationFrame(drift)
    }
    frameId = window.requestAnimationFrame(drift)
    return () => { if (frameId) window.cancelAnimationFrame(frameId) }
  }, [miniCards.length, isMiniRailPaused])

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#1E1B16] to-[#211E17]">

      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #C6A256 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Top accent lines */}
        <div className="absolute top-0 left-1/4 right-0 h-px bg-gradient-to-r from-transparent via-[#C6A256]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-1/4 h-px bg-gradient-to-r from-transparent via-[#C6A256]/20 to-transparent" />
        {/* Large faint circle */}
        <div className="absolute right-[-10%] top-[-20%] w-[600px] h-[600px] rounded-full border border-[#C6A256]/8" />
        <div className="absolute right-[5%] top-[-5%] w-[360px] h-[360px] rounded-full border border-[#C6A256]/5" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <p className="text-[#C6A256] text-sm font-medium tracking-[0.2em] uppercase mb-3">
              What Our Clients Say
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5EFE7] leading-tight">
              
              <span className="text-[#C6A256]">Video Testimonials</span>
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-[#C6A256]/30 flex items-center justify-center text-[#C6A256] hover:bg-[#C6A256]/10 hover:border-[#C6A256]/60 transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[#F5EFE7]/40 text-sm tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} / {String(VIDEO_TESTIMONIALS.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-[#C6A256]/30 flex items-center justify-center text-[#C6A256] hover:bg-[#C6A256]/10 hover:border-[#C6A256]/60 transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 xl:gap-14">

          {/* Left: Active Video */}
          <div className="flex flex-col items-center xl:items-start gap-5">
            <div className="relative w-full max-w-[360px] xl:max-w-none aspect-[9/16] rounded-2xl overflow-hidden border border-[#C6A256]/25 bg-[#1A1A1A] shadow-[0_0_60px_rgba(198,162,86,0.08)]">
              <AnimatePresence mode="wait" initial={false}>
                {activeSource && !isErrored ? (
                  <motion.video
                    key={`${activeVideo.id}-${activeSource.src}`}
                    ref={activeVideoRef}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    muted={isMuted}
                    autoPlay
                    preload="metadata"
                    onEnded={handleActiveVideoEnded}
                    onError={() => setErroredIds((prev) => [...new Set([...prev, activeVideo.id])])}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <source src={activeSource.src} type={activeSource.type} />
                  </motion.video>
                ) : (
                  <motion.div
                    key={`unsupported-${activeVideo.id}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UnsupportedVideoCard />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C6A256] animate-pulse" />
                  <p className="text-[#F5EFE7]/70 text-xs tracking-wide">Now Playing</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMuted((p) => !p)}
                  className="pointer-events-auto bg-black/50 border border-white/10 px-3 py-1.5 rounded-full text-[#F5EFE7] hover:bg-black/70 transition-colors"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>

              {/* Progress dots */}
              <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 pointer-events-none">
                {VIDEO_TESTIMONIALS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? "w-5 bg-[#C6A256]" : "w-1.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-between gap-8">

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1E1B14]/80 border border-[#C6A256]/15 rounded-xl px-5 py-4 hover:border-[#C6A256]/35 transition-colors duration-200"
                >
                  <p className="text-[#C6A256] text-2xl font-bold leading-none mb-1">{stat.value}</p>
                  <p className="text-[#F5EFE7]/50 text-xs tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quote block */}
            <div className="relative bg-[#1E1B14]/60 border border-[#C6A256]/12 rounded-2xl p-6 xl:p-8">
              <Quote size={32} className="text-[#C6A256]/20 absolute top-5 left-5" />
              <p className="text-[#F5EFE7]/75 text-sm md:text-base leading-relaxed pl-6 pt-2">
                Our clients trust us to find not just a property, but a place they can call home. Every testimonial represents a family whose dream we helped turn into reality.
              </p>
              <div className="mt-5 pt-4 border-t border-[#C6A256]/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C6A256]/15 border border-[#C6A256]/30 flex items-center justify-center">
                  <span className="text-[#C6A256] text-xs font-bold">TR</span>
                </div>
                <div>
                  <p className="text-[#F5EFE7] text-sm font-medium">TRS Property Mall</p>
                  <p className="text-[#F5EFE7]/40 text-xs">Trusted Real Estate Partner</p>
                </div>
              </div>
            </div>

            {/* Mini thumbnail rail */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[#F5EFE7]/50 text-xs uppercase tracking-[0.15em]">All Testimonials</p>
                <div className="flex gap-1">
                  <div className="w-4 h-0.5 rounded-full bg-[#C6A256]" />
                  <div className="w-2 h-0.5 rounded-full bg-[#C6A256]/30" />
                  <div className="w-2 h-0.5 rounded-full bg-[#C6A256]/30" />
                </div>
              </div>

              <div
                ref={miniSliderRef}
                className="flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1"
                onMouseEnter={() => setIsMiniRailPaused(true)}
                onMouseLeave={() => setIsMiniRailPaused(false)}
                onTouchStart={() => setIsMiniRailPaused(true)}
                onTouchEnd={() => setIsMiniRailPaused(false)}
              >
                {miniCards.map((videoIndex) => {
                  const video = VIDEO_TESTIMONIALS[videoIndex]
                  const source = getPlayableSource(video)

                  return (
                    <motion.button
                      key={video.id}
                      type="button"
                      onClick={() => handleMiniClick(videoIndex)}
                      layout
                      transition={{ type: "spring", stiffness: 110, damping: 26, mass: 0.8 }}
                      className="relative shrink-0 w-[88px] aspect-[9/16] rounded-xl overflow-hidden border border-[#F5EFE7]/10 hover:border-[#C6A256]/50 transition-colors duration-200 group"
                    >
                      {source ? (
                        <video
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          autoPlay
                          loop
                          preload="metadata"
                        >
                          <source src={source.src} type={source.type} />
                        </video>
                      ) : (
                        <div className="w-full h-full bg-[#212121] flex items-center justify-center">
                          <p className="text-[#F5EFE7]/40 text-[10px] text-center px-1">Not supported</p>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-[#C6A256]/90 flex items-center justify-center">
                          <Play size={12} className="text-black ml-0.5" fill="black" />
                        </div>
                      </div>

                      {/* Index label */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-end pointer-events-none">
                        <span className="text-[#F5EFE7]/60 text-[9px] font-medium bg-black/40 px-1 py-0.5 rounded">
                          {String(video.id).padStart(2, "0")}
                        </span>
                        <Play size={10} className="text-[#C6A256]" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoTestimonialsSection