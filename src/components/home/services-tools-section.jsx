import Image from "next/image"

const ServicesToolsSection = ({ services }) => {


    return (
        <section className="patner-gradient py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-center">TOOLS & SERVICES</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer rounded-2xl"
                            >
                                <div className="relative h-80 overflow-hidden">
                                    <Image
                                        src={service?.img}
                                        alt="Image Service"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-12 flex items-center justify-center cursor-pointer"
                                >
                                    {service?.btn}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default ServicesToolsSection
