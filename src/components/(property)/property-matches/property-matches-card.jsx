"use client"
import DetailSearchCard from '../../ui/detail-search-card'
import PropertySearchBar from '../../ui/property-search-bar';
import { useGetRequirementMatchesQuery, useGetAllRequirementMatchesQuery } from '@/service/buyRequirementApi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

const PropertyMatchesCard = ({ reqId }) => {
    const { token } = useSelector((state) => state.auth);

    // If reqId is provided, fetch matches for that specific requirement
    // Otherwise, fetch all matches for the customer
    const { data: specificMatchesData, isLoading: isLoadingSpecific, isError: isErrorSpecific } = useGetRequirementMatchesQuery(reqId, {
        skip: !reqId || !token,
        refetchOnMountOrArgChange: true,
    });
    const { data: allMatchesData, isLoading: isLoadingAll, isError: isErrorAll } = useGetAllRequirementMatchesQuery(undefined, {
        skip: !!reqId || !token,
        refetchOnMountOrArgChange: true,
    });

    const rawMatchesData = reqId ? specificMatchesData : allMatchesData;
    const isLoading = reqId ? isLoadingSpecific : isLoadingAll;
    const isError = reqId ? isErrorSpecific : isErrorAll;

    const [filteredProperties, setFilteredProperties] = useState([]);
    const propertiesRef = useRef([]);

    const normalizeMatches = useCallback((payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.results)) return payload.results;
        if (Array.isArray(payload?.items)) return payload.items;
        if (Array.isArray(payload?.matches)) return payload.matches;
        if (Array.isArray(payload?.matched_properties)) return payload.matched_properties;
        if (Array.isArray(payload?.data?.results)) return payload.data.results;
        if (Array.isArray(payload?.data?.items)) return payload.data.items;
        return [];
    }, []);

    useEffect(() => {
        const normalized = normalizeMatches(rawMatchesData);
        propertiesRef.current = normalized;
        setFilteredProperties(normalized);
    }, [rawMatchesData, normalizeMatches]);

    function handleSearchAndFilter(query = "", propertyType = null, activeTab = "") {
        const matchesData = propertiesRef.current;

        const isEmptySearch = !query?.trim() && (!propertyType || propertyType === "Any") && !activeTab;
        if (isEmptySearch && matchesData.length === 0 && !rawMatchesData) {
            return;
        }

        if (matchesData.length === 0) {
            setFilteredProperties([]);
            return;
        }

        let result = [...matchesData];

        if (query?.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((property) =>
                property?.title?.toLowerCase().includes(lowerQuery) ||
                property?.city?.toLowerCase().includes(lowerQuery) ||
                property?.map_address?.toLowerCase().includes(lowerQuery) ||
                property?.project_name?.toLowerCase().includes(lowerQuery) ||
                property?.builder_name?.toLowerCase().includes(lowerQuery) ||
                property?.agent_name?.toLowerCase().includes(lowerQuery)
            );
        }

        if (propertyType && propertyType !== "Any") {
            const propertyTypeMap = {
                flat_apartment: "flat",
                builder: "builder_floor",
            };
            const normalizedPropertyType = (propertyTypeMap[propertyType] || propertyType).toLowerCase();
            result = result.filter((property) => 
                property?.property_type?.toLowerCase() === normalizedPropertyType
            );
        }

        setFilteredProperties(result);
    }

    return (
        <>
            <div className="property-gradient text-[#F5EFE7]">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="container mx-auto md:px-10 px-5 py-8">
                <div className="flex justify-between my-8 items-center">
                    <h1 className='md:text-3xl text-lg font-bold'>Your Matches on TRS</h1>
                    {filteredProperties?.length > 0 && (
                        <p className="text-[#F5EFE7]">{filteredProperties.length} properties found</p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-[#F5EFE7] p-4 rounded-2xl shadow">
                                <div className="w-full h-48 bg-[#212121] animate-pulse rounded-xl mb-4" />
                                <div className="h-4 w-1/2 bg-[#212121] animate-pulse rounded mb-2" />
                                <div className="h-4 w-1/3 bg-[#212121] animate-pulse rounded mb-2" />
                                <div className="h-4 w-full bg-[#212121] animate-pulse rounded" />
                            </div>
                        ))
                    ) : isError ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 bg-[#212121] rounded-lg">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-semibold text-[#C6A256] mb-2">Error Loading Matches</h3>
                            <p className="text-[#C6A256] text-center">
                                Unable to load property matches. Please try again later.
                            </p>
                        </div>
                    ) : filteredProperties?.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 bg-[#212121] rounded-lg">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-[#F5EFE7] mb-2">No Matching Properties Found</h3>
                            <p className="text-[#F5EFE7] text-center">
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

