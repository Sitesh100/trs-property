"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Award images - you can replace these with actual award images
const awardImages = [
  { id: 1, src: '/assets/images/awards/Pasted image.png', alt: 'Award Ceremony 1' },
  { id: 2, src: '/assets/images/awards/Pasted image (2).png', alt: 'Award Ceremony 2' },
  { id: 3, src: '/assets/images/awards/Pasted image (3).png', alt: 'Award Ceremony 3' },
  { id: 4, src: '/assets/images/awards/Pasted image (4).png', alt: 'Award Ceremony 4' },
  { id: 5, src: '/assets/images/awards/Pasted image (5).png', alt: 'Award Ceremony 5' },
  { id: 6, src: '/assets/images/awards/Pasted image (6).png', alt: 'Award Ceremony 6' },
  { id: 7, src: '/assets/images/awards/Pasted image (7).png', alt: 'Award Ceremony 7' },
]

const FounderAwardSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const videoRef = useRef(null)
  
  // Embla carousel setup with autoplay
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  )
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps'
    },
    [autoplayPlugin.current]
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Handle video popup
  const openVideo = () => {
    setIsVideoOpen(true)
    // Pause autoplay when video is open
    autoplayPlugin.current.stop()
  }

  const closeVideo = () => {
    setIsVideoOpen(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
    // Resume autoplay when video is closed
    autoplayPlugin.current.play()
  }

  // Close video on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeVideo()
      }
    }
    
    if (isVideoOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isVideoOpen])

  return (
    <section className="md:pt-8 pt-5 bg-gradient-to-b from-[#212121] via-[#212121] to-[#212121] relative overflow-hidden">
      {/* Background decorative elements - subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#212121]/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#212121]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Content Grid */}
         <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
               Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFE7] via-[#C6A256] to-[#C6A256]">Recognition</span>
           </h2>
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          
          {/* Video Section - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false }}
            className="w-full lg:w-[45%] xl:w-[40%]"
          >
            <div 
              onClick={openVideo}
              className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-2xl shadow-[#212121]/40"
            >
              {/* Video Thumbnail/Preview */}
              <video
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                muted
                loop
                playsInline
              >
                <source src="/assets/video/trs.mp4" type="video/mp4" />
              </video>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/80 via-[#212121]/30 to-transparent"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#C6A256] to-[#C6A256] flex items-center justify-center shadow-2xl shadow-[#212121]/50 group-hover:shadow-[#212121]/60 transition-shadow duration-300"
                >
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-[#212121] fill-[#212121] ml-1" />
                </motion.div>
              </div>
              
              {/* Video Duration Badge */}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-[#212121]/60 backdrop-blur-sm rounded-lg">
                <span className="text-[#F5EFE7] text-sm font-medium">01:25</span>
              </div>
            </div>
          </motion.div>

          {/* Images Carousel Section - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
            className="w-full lg:w-[55%] xl:w-[60%] flex flex-col"
          >
            {/* Carousel */}
            <div className="relative flex-1">
              <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex">
                  {awardImages.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_50%] pl-4 first:pl-0"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: false }}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollPrev}
                    className="w-12 h-12 rounded-full border-2 border-[#F5EFE7]/20 flex items-center justify-center text-[#F5EFE7]/50 hover:border-[#C6A256] hover:text-[#C6A256] transition-all duration-300 bg-[#212121]/30 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollNext}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C6A256] to-[#C6A256] flex items-center justify-center text-[#212121] hover:shadow-lg hover:shadow-[#212121]/40 transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Popup Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeVideo}
              className="fixed inset-0 z-50 bg-[#212121]/80 backdrop-blur-md"
            />
            
            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
            >
              <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-[#C6A256]/30 pointer-events-auto">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeVideo}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#212121]/60 backdrop-blur-sm flex items-center justify-center text-[#F5EFE7] hover:bg-[#212121]/80 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                
                {/* Video Player */}
              <video
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                autoPlay        
                muted
                loop
                playsInline
                poster="/assets/images/awards/Pasted image.png"  
              >
                <source src="/assets/video/trs.mp4" type="video/mp4" />
              </video>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

export default FounderAwardSection