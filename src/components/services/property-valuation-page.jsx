"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

const serviceSections = [
  {
    title: "For Clients",
    image: "/assets/images/client1.png",
    points: [
      "Title Verification",
      "Property due diligence",
      "Agreements & Documentation",
      "Legal consultation",
      "Registry & Ownership Transfer",
      "Loans & Financing Support",
      "Tenant Onboarding Support",
    ],
  },
  {
    title: "For Agents",
    image: "/assets/images/agent1.png",
    points: [
      "RERA Registration for agents",
      "Sale agreements & Deeds",
      "Dispute management & resolution",
      "Property Verification",
      "Legal structuring for project sales",
      "Marketing support & guidance",
      "Deal structuring & Brokerage agreements",
    ],
  },
  {
    title: "For Builders",
    image: "/assets/images/builder1.png",
    points: [
      "RERA Compliances",
      "Land title verification",
      "Statutory approvals support",
      "Legal structuring for project",
      "Regulatory advisory",
      "Dispute management",
      "Sale agreements & Documentation",
    ],
  },
];

function PropertyValuationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#212121] text-[#F5EFE7] pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(198, 162, 86, 0.14),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(10, 31, 61, 0.12),transparent_38%)]" />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center px-4 py-2 mb-5 text-xs sm:text-sm font-semibold bg-[#212121]/15 text-[#C6A256] border border-[#C6A256]/30 rounded-[0.5rem]"
          >
            Trusted Legal Support
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight"
          >
            Professional Legal Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="mt-4 max-w-4xl text-base sm:text-lg text-[#F5EFE7]/90 leading-relaxed"
          >
            Real estate decisions carry long-term implications. Our legal services are designed to eliminate
            uncertainty at every step. We provide structured legal support across buying, selling, leasing,
            and project development, ensuring every transaction is compliant, transparent, and risk-mitigated.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-8 bg-[#212121]/90 border border-[#F5EFE7]/30 rounded-[0.5rem] overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {serviceSections.map((section, index) => (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.12 * index, ease: "easeOut" }}
                  whileHover={{ backgroundColor: "rgba(245, 239, 231, 0.02)" }}
                  className={`p-6 sm:p-8 border-b md:border-b-0 border-[#F5EFE7]/30 ${
                    index < serviceSections.length - 1 ? "md:border-r" : ""
                  }`}
                >
                  <div className="inline-flex bg-[#F5EFE7] text-[#212121] text-lg font-semibold px-7 py-2 rounded-[0.5rem] mb-7">
                    {section.title}
                  </div>

                  <div className="h-40 sm:h-44 w-full rounded-[0.5rem] overflow-hidden mb-7">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <ul className="space-y-0">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="py-3 text-sm sm:text-base text-[#F5EFE7] border-b border-[#F5EFE7]/40"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PropertyValuationPage;
