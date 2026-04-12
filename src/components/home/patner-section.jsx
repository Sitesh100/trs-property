"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { lufga } from '@/fonts';

// Builder Logo Images
import AdaniRealty from "../../../public/assets/images/builderLogo/adani.jpg";
import AdityaBirla from "../../../public/assets/images/builderLogo/aditya.jpeg";
import Azizi from "../../../public/assets/images/builderLogo/AZIZI.png";
import BhartiyaCity from "../../../public/assets/images/builderLogo/BHARTIYA CITY.png";
import Bhutani from "../../../public/assets/images/builderLogo/BHUTANI.png";
import Damac from "../../../public/assets/images/builderLogo/DAMAC.png";
import Dlf from "../../../public/assets/images/builderLogo/DLF.png";
import GodrejProperties from "../../../public/assets/images/builderLogo/GODREJ PROPERTIES.png";
import HarshitaSmart from "../../../public/assets/images/builderLogo/HARSHITA SMART.png";
import HdfcLife from "../../../public/assets/images/builderLogo/HDFC LIFE.png";
import HighwayInfrastructure from "../../../public/assets/images/builderLogo/HIGHWAY INFRASTRUCTURE.png";
import Kalpataru from "../../../public/assets/images/builderLogo/KALPATARU.png";
import LTRealty from "../../../public/assets/images/builderLogo/L T REALTY.jpeg";
import MahindraLifespace from "../../../public/assets/images/builderLogo/MAHINDRA LIFESPACE.png";
import OberaiReality from "../../../public/assets/images/builderLogo/oberoi.webp";
import Omaxe from "../../../public/assets/images/builderLogo/OMAXE.png";
import RaymondReality from "../../../public/assets/images/builderLogo/RAYMOND REALITY.png";
import Rustomjee from "../../../public/assets/images/builderLogo/RUSTOMJEE.jpeg";
import SkyeEarth from "../../../public/assets/images/builderLogo/SKYE EARTH.png";
import SobhaRealty from "../../../public/assets/images/builderLogo/SOBHA REALTY.png";

const builderLogos = [
    { src: AdaniRealty, name: "Adani Realty" },
    { src: AdityaBirla, name: "Aditya Birla" },
    { src: Azizi, name: "Azizi" },
    { src: BhartiyaCity, name: "Bhartiya City" },
    { src: Bhutani, name: "Bhutani" },
    { src: Damac, name: "Damac" },
    { src: Dlf, name: "DLF" },
    { src: GodrejProperties, name: "Godrej Properties" },
    { src: HarshitaSmart, name: "Harshita Smart" },
    { src: HdfcLife, name: "HDFC Life" },
    { src: HighwayInfrastructure, name: "Highway Infrastructure" },
    { src: Kalpataru, name: "Kalpataru" },
    { src: LTRealty, name: "L&T Realty" },
    { src: MahindraLifespace, name: "Mahindra Lifespace" },
    { src: OberaiReality, name: "Oberai Reality" },
    { src: Omaxe, name: "Omaxe" },
    { src: RaymondReality, name: "Raymond Reality" },
    { src: Rustomjee, name: "Rustomjee" },
    { src: SkyeEarth, name: "Skye Earth" },
    { src: SobhaRealty, name: "Sobha Realty" },
];

function PatnerSection() {
    // Double the images for seamless loop
    const duplicatedImages = [...builderLogos, ...builderLogos, ...builderLogos, ...builderLogos];

    return (
        <section className="py-12 md:py-20 bg-linear-to-br from-[#212121] via-[#212121] to-[#212121] overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#212121]/8 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#212121]/8 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-center mb-16"
                >

                    <h2 className="hero-title text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-[#F5EFE7]">
                        Our Partners & Affiliates
                    </h2>
                    <p className="text-[#F5EFE7]/50 max-w-xl mx-auto text-base md:text-lg">
                        Collaborating with industry leaders to bring you the best real estate experience
                    </p>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative marquee-mask">
                {/* Marquee Track */}
                <motion.div
                    className="flex gap-8 md:gap-12 py-8"
                    animate={{
                        x: [0, -50 * builderLogos.length * 4],
                    }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedImages.map((logo, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="shrink-0 group cursor-pointer"
                        >
                            <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 p-2 lg:p-3 bg-white border border-[#F5EFE7]/10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-[#C6A256]/30 group-hover:shadow-lg group-hover:shadow-[#C6A256]/10">
                                <Image
                                    src={logo.src}
                                    alt={logo.name}
                                    width={160}
                                    height={160}
                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Second row - moving in opposite direction */}
                <motion.div
                    className="flex gap-8 md:gap-12 py-8"
                    animate={{
                        x: [-50 * builderLogos.length * 4, 0],
                    }}
                    transition={{
                        x: {
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedImages.map((logo, index) => (
                        <motion.div
                            key={`row2-${index}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="shrink-0 group cursor-pointer"
                        >
                            <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 p-2 lg:p-3 bg-white border border-[#F5EFE7]/10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-[#C6A256]/30 group-hover:shadow-lg group-hover:shadow-[#C6A256]/10">
                                <Image
                                    src={logo.src}
                                    alt={logo.name}
                                    width={160}
                                    height={160}
                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom accent line */}
            <div className="container mx-auto px-4 mt-12">
                <div className="h-px bg-linear-to-r from-transparent via-[#C6A256]/30 to-transparent"></div>
            </div>
        </section>
    )
}

export default PatnerSection
