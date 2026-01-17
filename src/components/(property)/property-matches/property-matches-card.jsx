"use client"
import DetailSearchCard from '../../ui/detail-search-card'
import PropertySearchBar from '../../ui/property-search-bar';

const PropertyMatchesCard = () => {
    const filteredProperties = [];
    function handleSearchAndFilter() {
        return []
    }

    return (
        <>
            <div className="property-gradient text-white">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="container mx-auto md:px-10 px-5">
                <div className="flex justify-between my-8 items-center">
                    <h1 className='md:text-3xl text-lg font-bold'>Your Matches on RX100</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {false ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow">
                                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl mb-4" />
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))
                    ) : filteredProperties?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
                            <p className="text-gray-500 text-center">
                                Try adjusting your filters or search criteria to find more properties.
                            </p>
                        </div>
                    ) : (
                        filteredProperties?.map((property, index) => (
                            <DetailSearchCard property={property} key={index} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default PropertyMatchesCard

