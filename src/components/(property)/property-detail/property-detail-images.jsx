"use client"
import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { basedUrl } from "@/libs/based-url"

function PropertyDetailImages({ property }) {
    const [showAllPhotos, setShowAllPhotos] = useState(false)

    return (
        <>
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 relative rounded-lg overflow-hidden"
                    >
                        <Image
                            src={`${basedUrl}/${property?.images[0]}`}
                            alt="Property Main Image"
                            width={800}
                            height={500}
                            className="w-full h-[400px] object-cover"
                        />
                    </motion.div>
                    <div className="flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="relative rounded-lg overflow-hidden"
                        >
                            <Image
                                src={`${basedUrl}/${property?.images[1]}`}
                                alt="Property Image 2"
                                width={400}
                                height={200}
                                className="w-full h-[190px] object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="relative rounded-lg overflow-hidden"
                        >
                            <Image
                                src={`${basedUrl}/${property?.images[2]}`}
                                alt="Property Image 3"
                                width={400}
                                height={200}
                                className="w-full h-[190px] object-cover"
                            />
                            <button
                                onClick={() => setShowAllPhotos(true)}
                                className="absolute cursor-pointer bottom-4 right-4 bg-white text-black text-xs px-3 py-1.5 rounded-full flex items-center font-semibold"
                            >
                                View All Photos
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAllPhotos && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="relative w-full max-w-5xl mx-auto p-4"
                        >
                            <button
                                onClick={() => setShowAllPhotos(false)}
                                className="absolute top-5 right-5 text-white z-50"
                            >
                                <X size={24} />
                            </button>

                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                className="rounded-lg overflow-hidden"
                            >
                                {property?.images?.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <Image
                                            src={`${basedUrl}/${img}`}
                                            alt={`Slide ${index + 1}`}
                                            width={1200}
                                            height={700}
                                            className="w-full h-[600px] object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default PropertyDetailImages
