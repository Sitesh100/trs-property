import Header from "@/components/header";
import Footer from "@/components/footer";

const serviceItems = [
  {
    id: "1",
    title: "Tenant onboarding",
    description:
      "Seamless tenant onboarding with thorough verification and ongoing coordination to ensure compliance, transparency, and smooth occupancy.",
  },
  {
    id: "2",
    title: "Rent collection",
    description:
      "Automated rent collection supported by clear invoicing and real-time financial reporting for complete visibility and control.",
  },
  {
    id: "3",
    title: "Maintenance",
    description:
      "Proactive maintenance handling with trusted vendors to ensure repairs, cost efficiency, and service quality.",
  },
  {
    id: "4",
    title: "Inspections & issue resolution",
    description:
      "Regular inspections and structured issue resolution to protect asset value and maintain long-term property performance.",
  },
];

function PropertyManagementPage() {
  return (
    <>
      <Header />
      <main className="bg-[#010a1e] text-white min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight">
                Property
                <br />
                Management
                <br />
                Services
              </h1>

              <div className="mt-8 space-y-5 text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl">
                <p>
                  Real estate ownership should create value, not operational stress. Our property management services are designed to
                  protect assets, optimize returns, and ensure seamless day-to-day operations, allowing owners and investors to focus
                  on growth while we handle execution.
                </p>
                <p>
                  From tenant onboarding and rent management to maintenance coordination and compliance oversight, we act as a single
                  point of accountability for the entire property lifecycle. Every process is system-driven, transparent, and
                  performance-oriented.
                </p>
              </div>
            </div>

            <div className="space-y-7 sm:space-y-8">
              {serviceItems.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-light text-white/95">{item.id}</span>
                    <span className="text-3xl text-white/60 leading-none">|</span>
                    <h2 className="text-2xl sm:text-[2rem] font-medium tracking-tight">{item.title}</h2>
                  </div>
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl pl-11">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-10 sm:py-14">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: "url('/assets/images/bgimage.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#050c1f]/65" aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="bg-[#020c21]/95 border border-white/10 rounded-none sm:rounded-md px-8 sm:px-14 py-10 sm:py-14 grid lg:grid-cols-2 gap-8 items-center">
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight">
                Get Your Property
                <br />
                Managed Professionally
              </h3>

              <div className="lg:pl-8">
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-lg mb-6">
                  End-to-end management designed to protect your asset, streamline operations, and deliver consistent performance.
                </p>
                <button className="bg-white text-[#0b1020] hover:bg-slate-100 text-base font-semibold rounded-lg px-6 py-3 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PropertyManagementPage;
