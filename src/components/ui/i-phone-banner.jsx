import Image from 'next/image'
import React from 'react'

const IPhoneBanner = () => {
    return (
        <>
            <div className="relative h-[300px] overflow-hidden">
                <Image
                    src="/assets/images/search/banner.jpg"
                    alt="Banner Ad"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>
        </>
    )
}

export default IPhoneBanner

