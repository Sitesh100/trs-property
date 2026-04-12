import DetailCard from "../../ui/detail-card"

function PropertyDetailSimilarProperties({ similarProperties = [], isLoading = false, isError = false }) {
    const loadingCards = Array.from({ length: 4 });

    return (
        <>
            <div className="bg-linear-to-b from-[#212121] to-[#212121] py-14">
                <div className="container mx-auto px-4">
                    <div className="mb-7 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold text-[#F5EFE7] tracking-tight">Similar Properties</h2>
                            <p className="mt-1 text-sm text-[#F5EFE7]/65">Curated matches based on this property.</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {loadingCards.map((_, index) => (
                                <div key={index} className="h-90 rounded-2xl bg-[#F5EFE7]/8 border border-[#F5EFE7]/10 animate-pulse" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-[#F5EFE7]/80">Unable to load similar properties right now.</div>
                    ) : similarProperties.length === 0 ? (
                        <div className="text-[#F5EFE7]/80">No similar properties found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {similarProperties.map((property) => (
                                <DetailCard property={property} key={property?.id || property?.name} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PropertyDetailSimilarProperties

