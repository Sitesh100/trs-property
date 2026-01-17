"use client"
import { motion } from "framer-motion"
import Image from "next/image"

function AiRevolutionSection({ features }) {
    return (
        <section className="revolution-gradient relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.3 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="col-span-1 md:flex flex-col justify-center hidden overflow-hidden"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="mt-4"
                        >
                            <Image
                                src="/assets/images/roboto.png"
                                alt="AI Robot"
                                width={300}
                                height={300}
                                className="rounded-lg w-full h-full object-contain drop-shadow-xl"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.15,
                                },
                            },
                        }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="p-6 rounded-lg shadow-lg cursor-pointer text-center"
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                                }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-white/20 text-white text-xl mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
                                    dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AiRevolutionSection
