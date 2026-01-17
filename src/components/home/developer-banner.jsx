import Image from "next/image"

function DeveloperBanner() {
    return (
        <>
            <section>
                <Image
                    src="/assets/images/banner.png"
                    alt="iPhone"
                    width={800}
                    height={200}
                    className="w-full"
                />
            </section>
        </>
    )
}

export default DeveloperBanner


// "use client"
// import { motion } from "framer-motion"
// import Image from "next/image"

// function DeveloperBanner() {
//     return (
//         <section className="overflow-hidden">
//             <motion.div
//                 initial={{ opacity: 0, y: 100 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.3 }}
//                 viewport={{ once: false, amount: 0.3 }}
//             >
//                 <Image
//                     src="/assets/images/banner.png"
//                     alt="iPhone"
//                     width={800}
//                     height={200}
//                     className="w-full rounded-lg shadow-lg"
//                 />
//             </motion.div>
//         </section>
//     )
// }

// export default DeveloperBanner
