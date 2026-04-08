'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

const SquareCard = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    // Auto-advance every 3 seconds on mobile
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [cards.length]);

    return (
        <>
            {/* Desktop: grid layout */}
            <div className="hidden md:grid container mx-auto md:grid-cols-3 gap-10 md:px-10 px-5">
                {cards.map((card, index) => (
                    <Link
                        href="/property-search"
                        key={index}
                        className="w-full h-80 flex flex-col items-center"
                    >
                        <div className="w-full h-full relative overflow-hidden cursor-pointer rounded-2xl">
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

            {/* Mobile: slider */}
            <div className="md:hidden px-5">
                <div
                    className="relative overflow-hidden rounded-2xl"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {cards.map((card, index) => (
                            <Link
                                href="/property-search"
                                key={index}
                                className="w-full flex-shrink-0 flex flex-col items-center"
                            >
                                <div className="w-full h-56 relative overflow-hidden rounded-2xl">
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-center text-xl font-medium my-4">{card.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Dots indicator */}
                {/* <div className="flex justify-center gap-2 mt-2 mb-4">
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-1 h-1 rounded-full transition-all duration-300 cursor-pointer ${
                                currentIndex === index
                                    ? 'bg-[#212121] w-1'
                                    : 'bg-[#F5EFE7]/40'
                            }`}
                        />
                    ))}
                </div> */}
            </div>
        </>
    );
};

export default SquareCard;
