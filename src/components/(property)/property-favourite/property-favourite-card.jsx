"use client"
import React, { useEffect, useState } from 'react'
import DetailSearchCard from '../../ui/detail-search-card'
import { useGetFavoritesQuery } from '@/service/favoriteApi';
import PropertySearchBar from '../../ui/property-search-bar';
import { useSelector } from 'react-redux';

const PropertyFavouriteCard = () => {
    const { token } = useSelector((state) => state.auth);
    const { data: favoritesData, isLoading } = useGetFavoritesQuery(undefined, {
        skip: !token, // Skip query if user is not logged in
    });
    const [filteredProperties, setFilteredProperties] = useState([]);

    useEffect(() => {
        if (favoritesData) {
            setFilteredProperties(favoritesData);
        }
    }, [favoritesData]);


    function handleSearchAndFilter(query = "", propertyType = null, activeTab = "") {
        // Safety check: ensure favoritesData exists before filtering
        if (!favoritesData || favoritesData.length === 0) {
            setFilteredProperties([]);
            return;
        }

        let result = [...favoritesData];

        if (query?.trim()) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((property) =>
                property?.title?.toLowerCase().includes(lowerQuery) ||
                property?.city?.toLowerCase().includes(lowerQuery) ||
                property?.map_location?.toLowerCase().includes(lowerQuery) ||
                property?.project_name?.toLowerCase().includes(lowerQuery) ||
                property?.builder_name?.toLowerCase().includes(lowerQuery)
            );
        }

        if (propertyType && propertyType !== "Any") {
            result = result.filter((property) => property?.property_type === propertyType);
        }

       if (activeTab && activeTab !== "reset") {
            result = result.filter((property) => property?.property_post_status === activeTab);
        }

        setFilteredProperties(result);
    }

    return (
        <>
            <div className="property-gradient text-white">
                <PropertySearchBar onSearch={handleSearchAndFilter} />
            </div>
            <div className="container mx-auto md:px-10 px-5">
                <div className="flex justify-between my-8 items-center">
                    <h1 className='md:text-3xl text-lg font-bold'>Your Favorites TRS</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {!token ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <div className="text-6xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Login</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                You need to be logged in to view your favorite properties.
                            </p>
                        </div>
                    ) : isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow">
                                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl mb-4" />
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))
                    ) : filteredProperties?.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <div className="text-6xl mb-4">💔</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Start exploring properties and click the heart icon to add them to your favorites.
                            </p>
                        </div>
                    ) : (
                        filteredProperties?.map((property, index) => (
                            <DetailSearchCard property={property} key={property?.id || index} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default PropertyFavouriteCard

