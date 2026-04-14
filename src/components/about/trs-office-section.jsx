"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useInView } from "react-intersection-observer"

const officeImages = [
  {
    src: "/assets/trs-pic/img6.jpeg",
    alt: "TRS office lounge and client interaction space",
    title: "Client lounge",
    description:
      "A refined environment for consultations, investor meetings, walkthroughs, and confident real estate conversations.",
  },
  {
    src: "/assets/trs-pic/img1.jpeg",
    alt: "TRS office display wall and interior details",
    title: "Display wall",
    description:
      "A curated corner that highlights the TRS journey, recognitions, and brand presence with a clean premium finish.",
  },
  {
    src: "/assets/trs-pic/img2.jpg",
    alt: "TRS team office photograph",
    title: "Team moments",
    description:
      "A people first culture captured through team presence, shared energy, and the relationships behind the brand.",
  },
  {
    src: "/assets/trs-pic/img3.jpeg",
    alt: "TRS office collaborative workspace",
    title: "Workspace",
    description:
      "A modern work zone designed for focused planning, smooth operations, and day to day client coordination.",
  },
  {
    src: "/assets/trs-pic/img4.jpeg",
    alt: "TRS office meeting area",
    title: "Meeting zone",
    description:
      "An inviting area for discussions, presentations, and strategic conversations in a polished business setting.",
  },
  {
    src: "/assets/trs-pic/img5.jpeg",
    alt: "TRS office curated wall frames",
    title: "Interior details",
    description:
      "Minimal details and thoughtful styling that give the office a warm, contemporary, and trustworthy identity.",
  },
]

const TrsOfficeSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const featuredImage = officeImages[activeImageIndex]
  const galleryImages = officeImages.filter((_, index) => index !== activeImageIndex)

  return (
    <section ref={ref} className="relative overflow-hidden py-14 md:py-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,162,86,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(198,162,86,0.08),transparent_24%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-7 max-w-3xl text-center md:mb-10"
          >
            <span className="inline-flex items-center rounded-full border border-[#C6A256]/30 bg-[#F5EFE7]/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#C6A256]">
              TRS Office Experience
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#F5EFE7] md:text-4xl lg:text-5xl">
              Inside{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5EFE7] via-[#C6A256] to-[#C6A256]">
                Our Office
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#F5EFE7]/76 md:text-base">
              A polished workspace that reflects the TRS brand through thoughtful
              interiors, trusted conversations, and a premium client first atmosphere.
            </p>
          </motion.div>

          <div className="grid items-start gap-4 lg:grid-cols-[1.18fr_0.82fr] xl:gap-5">
            <motion.div
              key={featuredImage.src}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="self-start overflow-hidden rounded-[28px] border border-[#C6A256]/18 bg-gradient-to-br from-[#171717] to-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
            >
              <div className="relative aspect-[16/10.2] overflow-hidden">
                <Image
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  fill
                  priority={false}
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent" />
              </div>

              <div className="flex items-center justify-between gap-4 p-4 md:p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#C6A256]">
                    Featured Space
                  </p>
                  <h3 className="mt-2 text-[30px] font-semibold leading-none text-[#F5EFE7] md:text-[34px]">
                    {featuredImage.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#F5EFE7]/72 md:text-[15px]">
                    {featuredImage.description}
                  </p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C6A256]/25 bg-[#C6A256]/[0.05] text-[#C6A256] md:flex">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 26, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: 0.14 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`group overflow-hidden rounded-[20px] border border-[#C6A256]/16 bg-gradient-to-br from-[#171717] to-[#101010] shadow-[0_16px_50px_rgba(0,0,0,0.22)] ${
                    index === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(officeImages.findIndex((item) => item.src === image.src))}
                    className="relative block w-full text-left"
                  >
                  <div
                    className={`relative overflow-hidden cursor-pointer ${
                      index === 0 ? "aspect-[16/7.8] md:aspect-[16/8.2]" : "aspect-[4/2.75] md:aspect-[4/2.9]"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#C6A256]/90">
                        TRS Space
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#F5EFE7]">
                        {image.title}
                      </p>
                    </div>
                  </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrsOfficeSection
