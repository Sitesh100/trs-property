"use client"
import React, { useEffect, useState } from 'react'
import DetailSearchCard from '../../ui/detail-search-card'
import { useGetMyPropertiesQuery } from '@/service/propertyApi';
import PropertySearchBar from '../../ui/property-search-bar';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const MyPropertyCard = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetMyPropertiesQuery({}, {
        skip: !token,
    });
    const [filteredProperties, setFilteredProperties] = useState([]);

    useEffect(() => {
        if (data?.data?.properties) {
            setFilteredProperties(data.data.properties);
        }
    }, [data]);


    function handleSearchAndFilter(query = "", propertyType = null, activeTab = "") {
        // Safety check: ensure data exists before spreading
        if (!data?.data?.properties) {
            setFilteredProperties([]);
            return;
        }

        let result = [...data.data.properties];

        if (query?.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((property) =>
                property?.title?.toLowerCase().includes(lowerQuery) ||
                property?.city?.toLowerCase().includes(lowerQuery) ||
                property?.map_location?.toLowerCase().includes(lowerQuery) ||
                property?.map_address?.toLowerCase().includes(lowerQuery) ||
                property?.project_name?.toLowerCase().includes(lowerQuery) ||
                property?.builder_name?.toLowerCase().includes(lowerQuery)
            );
        }

        if (propertyType && propertyType !== "Any") {
            const propertyTypeMap = {
                flat_apartment: "flat",
                builder: "builder_floor",
            };
            const normalizedPropertyType = (propertyTypeMap[propertyType] || propertyType).toLowerCase();
            result = result.filter((property) => property?.property_type?.toLowerCase() === normalizedPropertyType);
        }

       if (activeTab && activeTab !== "reset") {
            const tabValue = activeTab.toLowerCase();
            result = result.filter((property) => {
                const listingStatus = property?.status?.toLowerCase() || property?.property_for?.toLowerCase() || "";
                return listingStatus ? listingStatus === tabValue : true;
            });
        }

        setFilteredProperties(result);
    }

    return (
        <>
            <div className="property-gradient text-[#F5EFE7]">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="container mx-auto md:px-10 px-5">
                <div className="flex justify-between my-8 items-center">
                    <h1 className='md:text-3xl text-lg font-bold'>Your Properties on TRS</h1>
                    <div className='flex items-center gap-2'>
                       
                        <Link
                            href={"/my-buy-requirement"}
                            className={`w-36 mt-6 bg-[#212121] hover:bg-[#212121] text-[#F5EFE7] font-medium py-2 rounded transition-colors h-12 flex items-center justify-center cursor-pointer`}
                        >
                            Buy Requirement
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-[#F5EFE7] p-4 rounded-2xl shadow">
                                <div className="w-full h-48 bg-[#212121] animate-pulse rounded-xl mb-4" />
                                <div className="h-4 w-1/2 bg-[#212121] animate-pulse rounded mb-2" />
                                <div className="h-4 w-1/3 bg-[#212121] animate-pulse rounded mb-2" />
                                <div className="h-4 w-full bg-[#212121] animate-pulse rounded" />
                            </div>
                        ))
                    ) : filteredProperties?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-[#212121] rounded-lg">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-[#F5EFE7] mb-2">No Properties Found</h3>
                            <p className="text-[#F5EFE7] text-center">
                                Try adjusting your filters or search criteria to find more properties.
                            </p>
                        </div>
                    ) : (
                        filteredProperties?.map((property, index) => (
                            <DetailSearchCard property={property} key={index} action={token && true} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default MyPropertyCard

