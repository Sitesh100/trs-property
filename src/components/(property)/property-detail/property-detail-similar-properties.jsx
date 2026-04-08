import { ChevronRight } from "lucide-react"
import Link from "next/link"
import DetailCard from "../../ui/detail-card"

function PropertyDetailSimilarProperties({ similarProperties }) {
    return (
        <>
            <div className="bg-gradient-to-b from-[#212121] to-[#212121] py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#F5EFE7]">Similar Properties</h2>
                        <Link href="/properties" className="text-[#C6A256] flex items-center">
                            View more <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {similarProperties.map((property, index) => (
                            <DetailCard property={property} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PropertyDetailSimilarProperties

