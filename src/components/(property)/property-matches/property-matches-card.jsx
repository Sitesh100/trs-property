"use client"
import DetailSearchCard from '../../ui/detail-search-card'
import PropertySearchBar from '../../ui/property-search-bar';
import { useGetRequirementMatchesQuery, useGetAllRequirementMatchesQuery } from '@/service/buyRequirementApi';
import { Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

const PropertyMatchesCard = ({ reqId }) => {
    // If reqId is provided, fetch matches for that specific requirement
    // Otherwise, fetch all matches for the customer
    const { data: specificMatchesData, isLoading: isLoadingSpecific, isError: isErrorSpecific } = useGetRequirementMatchesQuery(reqId, {
        skip: !reqId,
    });
    const { data: allMatchesData, isLoading: isLoadingAll, isError: isErrorAll } = useGetAllRequirementMatchesQuery(undefined, {
        skip: !!reqId,
    });

    const matchesData = reqId ? specificMatchesData : allMatchesData;
    const isLoading = reqId ? isLoadingSpecific : isLoadingAll;
    const isError = reqId ? isErrorSpecific : isErrorAll;

    const [filteredProperties, setFilteredProperties] = useState([]);

    useEffect(() => {
        if (matchesData) {
            setFilteredProperties(Array.isArray(matchesData) ? matchesData : []);
        }
    }, [matchesData]);

    function handleSearchAndFilter(query = "", propertyType = null) {
        if (!matchesData || matchesData.length === 0) {
            setFilteredProperties([]);
            return;
        }

        let result = [...matchesData];

        if (query?.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((property) =>
                property?.title?.toLowerCase().includes(lowerQuery) ||
                property?.map_location?.toLowerCase().includes(lowerQuery) ||
                property?.agent_name?.toLowerCase().includes(lowerQuery)
            );
        }

        if (propertyType && propertyType !== "Any") {
            // Filter by property type if needed
            result = result.filter((property) => 
                property?.property_type === propertyType
            );
        }

        setFilteredProperties(result);
    }

    return (
        <>
            <div className="property-gradient text-white">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="container mx-auto md:px-10 px-5 py-8">
                <div className="flex justify-between my-8 items-center">
                    <h1 className='md:text-3xl text-lg font-bold'>Your Matches on TRS</h1>
                    {filteredProperties?.length > 0 && (
                        <p className="text-gray-600">{filteredProperties.length} properties found</p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow">
                                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl mb-4" />
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))
                    ) : isError ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Matches</h3>
                            <p className="text-red-600 text-center">
                                Unable to load property matches. Please try again later.
                            </p>
                        </div>
                    ) : filteredProperties?.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matching Properties Found</h3>
                            <p className="text-gray-500 text-center">
                                We couldn't find any properties matching your requirements yet.<br />
                                Check back later for new listings.
                            </p>
                        </div>
                    ) : (
                        filteredProperties?.map((property, index) => (
                            <DetailSearchCard property={property} key={property.id || index} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default PropertyMatchesCard

