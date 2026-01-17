import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsapBanner from "@/components/home/whatsap-banner"
import SliderBanner from "@/components/ui/slider-banner"
import PropertyCard from "@/components/(property)/property/property-card"
import IPhoneBanner from "@/components/ui/i-phone-banner"
import CitiesCard from "@/components/(property)/property/cities-card"

export default function Property() {

    const cards = [
        { image: '/assets/images/property/square1.jpg', title: 'LUXURY VILLAS' },
        { image: '/assets/images/property/square2.jpg', title: 'COMMERCIAL' },
        { image: '/assets/images/property/square3.jpg', title: 'RESIDENTIAL' },
    ];

    const cities = [
        { image: '/assets/images/property/city1.jpg', title: 'DELHI' },
        { image: '/assets/images/property/city2.jpg', title: 'INDORE' },
        { image: '/assets/images/property/city3.jpg', title: 'MUMBAI' },
        { image: '/assets/images/property/city4.jpg', title: 'BANGLORE' },
    ];

    return (

        <>
            <Header />
            <SliderBanner />
            <PropertyCard cards={cards} />
            <IPhoneBanner />
            <CitiesCard cities={cities} />
            <WhatsapBanner />
            <Footer />
        </>

    )
}

