'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SquareCard = ({ cards }) => {

    return (
        <div className="container mx-auto grid md:grid-cols-3 gap-10 md:px-10 px-5">
            {cards.map((card, index) => (
                <Link
                    href="/property-search"
                    key={index}
                    className="w-full h-80 flex flex-col items-center"
                >
                    <div className="w-full h-full relative overflow-hidden cursor-pointer  rounded-2xl">
                        <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover transition-all hover:scale-125 duration-300"
                        />
                    </div>
                    <h3 className="text-center text-xl font-medium my-5">{card.title}</h3>
                </Link>
            ))}
        </div>
    );
};

export default SquareCard;
