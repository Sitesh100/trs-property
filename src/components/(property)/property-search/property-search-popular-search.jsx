import Image from 'next/image';
import React from 'react';
import IPhoneBanner from '../../ui/i-phone-banner';

function PropertySearchPopularSearch() {
    return (
        <>
            <div className="py-12">
                <div className="container mx-auto md:px-28 px-5">
                    <h2 className="text-2xl font-bold mb-8 text-center">Popular Searches In Indore</h2>

                    <div className="grid md:grid-cols-5 grid-cols-1 gap-4">
                        <button className="bg-white text-black px-4 py-2 rounded-full text-sm cursor-pointer">Holiday Homes Indore</button>
                        <button className="bg-white text-black px-4 py-2 rounded-full text-sm cursor-pointer">Office Spaces Indore</button>
                        <button className="bg-white text-black px-4 py-2 rounded-full text-sm cursor-pointer">Rowhouses Indore</button>
                        <button className="bg-white text-black px-4 py-2 rounded-full text-sm cursor-pointer">Rental Properties</button>
                        <button className="bg-white text-black px-4 py-2 rounded-full text-sm cursor-pointer">Upcoming Residential</button>
                    </div>
                </div>
            </div>

            <IPhoneBanner />
        </>
    );
}

export default PropertySearchPopularSearch;
