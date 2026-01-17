import DetailCard from '../../ui/detail-card';

function PropertySearchRecommended({ recommendedProperties }) {
    return (
        <>
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-2 text-center">RX100 Recommended Properties</h2>
                <p className="text-gray-400 mb-8 text-center">Top handpicked projects for you exclusively by RX100</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {recommendedProperties.map((property, index) => (
                        <DetailCard property={property} key={index} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default PropertySearchRecommended;
