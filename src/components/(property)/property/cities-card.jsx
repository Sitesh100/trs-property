// components/CitiCard.tsx
'use client';

import Image from 'next/image';
import React from 'react';

const CitiesCard = ({ cities }) => {
    return (
        <div className="container mx-auto md:mb-20 mb-10 md:px-10 px-5">
            <div className="flex justify-center my-8">
                <h1 className='md:text-4xl text-xl font-bold'>RX100 IS NOW PRESENT IN ALL MAJOR CITIES ACROSS INDIA </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cities?.map((card, index) => (
                    <div
                        key={index}
                        className="md:w-72 h-96 relative overflow-hidden rounded-2xl shadow-md"
                    >
                        <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover transition-all hover:scale-125 duration-300 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CitiesCard;

