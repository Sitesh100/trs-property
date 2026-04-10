"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play, Volume2, VolumeX } from "lucide-react"
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

const canPlayMediaType = (mediaType) => {
  if (!mediaType || typeof document === "undefined") return true
  const el = document.createElement("video")
  return el.canPlayType(mediaType) !== ""
}

const getPlayableSource = (testimonial) => {
  return testimonial.sources.find((source) => canPlayMediaType(source.type)) || null
}

const UnsupportedVideoCard = ({ compact = false }) => {
  return (
    <div
      className={`relative w-full aspect-9/16 rounded-2xl border border-[#C6A256]/30 bg-[#212121] overflow-hidden ${compact ? "" : "max-w-md"}`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#212121]/80 to-[#212121]" />
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <div>
          <p className="text-[#F5EFE7] text-sm md:text-base font-semibold">Video format not supported</p>
          {!compact && (
            <p className="text-[#F5EFE7]/70 text-xs md:text-sm mt-2">
              Please upload H.264 (avc1) MP4 or WebM versions for browser playback.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const VideoTestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [erroredIds, setErroredIds] = useState([])
  const [isMiniRailPaused, setIsMiniRailPaused] = useState(false)
  const activeVideoRef = useRef(null)
  const miniSliderRef = useRef(null)

  const activeVideo = VIDEO_TESTIMONIALS[activeIndex]
  const activeSource = useMemo(() => getPlayableSource(activeVideo), [activeVideo])

  useEffect(() => {
    const player = activeVideoRef.current
    if (!player || !activeSource) return

    const playPromise = player.play()
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {})
    }
  }, [activeIndex, isMuted, activeSource])

  const miniCards = useMemo(() => {
    const order = []
    for (let step = 1; step <= VIDEO_TESTIMONIALS.length - 1; step += 1) {
      order.push((activeIndex + step) % VIDEO_TESTIMONIALS.length)
    }
    return order
  }, [activeIndex])

  const handleMiniClick = (index) => {
    setActiveIndex(index)
    setIsMuted(false)
  }

  const handleActiveVideoEnded = () => {
    setActiveIndex((prev) => (prev + 1) % VIDEO_TESTIMONIALS.length)
    setIsMuted(true)
  }

  const isErrored = erroredIds.includes(activeVideo.id)

  useEffect(() => {
    const slider = miniSliderRef.current
    if (!slider) return undefined

    let frameId = null
    let lastTime = 0
    const speed = 20

    const drift = (time) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time

      if (!isMiniRailPaused) {
        const maxScroll = slider.scrollWidth - slider.clientWidth
        if (maxScroll > 2) {
          slider.scrollLeft += (speed * delta) / 1000
          if (slider.scrollLeft >= maxScroll - 1) {
            slider.scrollLeft = 0
          }
        }
      }

      frameId = window.requestAnimationFrame(drift)
    }

    frameId = window.requestAnimationFrame(drift)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [miniCards.length, isMiniRailPaused])

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-linear-to-br from-[#212121] via-[#1B1B1B] to-[#2A2318]">
      <div className="pointer-events-none absolute inset-0 hidden xl:block">
        <div
          className="absolute right-12 top-24 opacity-40"
          style={{
            width: "640px",
            height: "440px",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(198, 162, 86, 0.38) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to left, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 50%, transparent 100%)",
          }}
        />
        <div className="absolute right-14 top-20 h-px w-80 bg-linear-to-r from-transparent via-[#C6A256]/55 to-transparent" />
        <div className="absolute right-16 top-28 h-px w-96 bg-linear-to-r from-transparent via-[#C6A256]/35 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-[#F5EFE7] mb-6">
          Client <span className="text-[#C6A256]">Video Testimonials</span>
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-[max-content_minmax(0,1fr)] gap-0 xl:gap-25 items-start xl:items-end">
          <div className="flex justify-center xl:justify-start">
            <div className="relative w-full max-w-84 md:max-w-88 xl:max-w-88 aspect-9/16 rounded-2xl overflow-hidden border border-[#C6A256]/35 bg-[#212121]">
              <AnimatePresence mode="wait" initial={false}>
                {activeSource && !isErrored ? (
                  <motion.video
                    key={`${activeVideo.id}-${activeSource.src}`}
                    ref={activeVideoRef}
                    className="w-full h-full object-cover rounded-2xl"
                    controls
                    playsInline
                    muted={isMuted}
                    autoPlay
                    preload="metadata"
                    onEnded={handleActiveVideoEnded}
                    onError={() => setErroredIds((prev) => [...new Set([...prev, activeVideo.id])])}
                    initial={{ opacity: 0, x: 18, scale: 0.985 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -18, scale: 0.985 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <source src={activeSource.src} type={activeSource.type} />
                  </motion.video>
                ) : (
                  <motion.div
                    key={`unsupported-${activeVideo.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <UnsupportedVideoCard />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#F5EFE7]/70">Now Playing</p>
                  {/* <h3 className="text-[#F5EFE7] font-semibold">{activeVideo.name}</h3> */}
                </div>

                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="bg-black/60 px-3 py-2 rounded-full text-[#F5EFE7] text-sm"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-55 xl:min-h-130 flex items-end overflow-hidden rounded-3xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-15 h-72 w-72 rounded-full bg-black/35 blur-3xl" />
              <div className="absolute right-24 top-20 h-60 w-60 rounded-full border border-[#0f0f0f]/90" />
              <div className="absolute -right-10 top-28 h-96 w-96 rounded-full border border-[#171717]/80" />
              <div
                className="absolute inset-y-0 right-0 w-[85%] opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(26, 26, 26, 0.95) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                  maskImage: "radial-gradient(circle at 78% 52%, black 0%, black 42%, transparent 80%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at 78% 52%, black 0%, black 42%, transparent 80%)",
                }}
              />
            </div>

            <div
              ref={miniSliderRef}
              className="relative z-10 flex gap-2 md:gap-3 overflow-x-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:self-end"
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
                    data-mini-card="true"
                    layout
                    transition={{ type: "spring", stiffness: 110, damping: 26, mass: 0.8 }}
                    className="relative shrink-0 w-28 md:w-32 aspect-9/16 rounded-xl overflow-hidden border border-[#F5EFE7]/20"
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
                      <UnsupportedVideoCard compact />
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                      <p className="text-[#F5EFE7] text-xs">{video.name}</p>
                      <Play size={14} className="text-[#C6A256]" />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoTestimonialsSection
