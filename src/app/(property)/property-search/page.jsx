import PropertySearchReadyProjects from "@/components/(property)/property-search/property-search-ready-projects"
import PropertySearchRecommended from "@/components/(property)/property-search/property-search-recomended"
import PropertySearchPopularSearch from "@/components/(property)/property-search/property-search-popular-search"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsapBanner from "@/components/home/whatsap-banner"
import PropertyDetailMainSection from "@/components/(property)/property-search/property-detail-main-section"
import SliderBanner from "@/components/ui/slider-banner"

export default function PropertySearch() {

    const readyToMoveProjects = [
        {
            name: "Sarthak Galaxy",
            location: "Indore, No-23",
            image:
                "/assets/images/detail/image1.jpg",
        },
        {
            name: "Omaxe City",
            location: "Indore, Sector 3",
            image:
                "/assets/images/detail/image2.jpg",
        },
        {
            name: "DLF Billtown",
            location: "Ring Road, Indore",
            image:
                "/assets/images/detail/image3.jpg",
        },
        {
            name: "Kalpataru",
            location: "Indore",
            image:
                "/assets/images/detail/image4.jpg",
        },
        {
            name: "Sarthak Galaxy",
            location: "Indore, No-23",
            image:
                "/assets/images/detail/image3.jpg",
        },
    ]

    const recommendedProperties = [
        {
            name: "Parc Clementi",
            type: "Clementi | Condominium",
            price: "25L",
            beds: 3,
            baths: 2,
            area: "1, 250",
            image: "/assets/images/detail/image1.jpg"
        },
        {
            name: "Haus of Clementi",
            type: "Clementi | Condominium",
            price: "25L",
            beds: 3,
            baths: 2,
            area: "1, 220",
            image: "/assets/images/detail/image2.jpg"
        },
        {
            name: "Clemon",
            type: "Clementi | Condominium",
            price: "25L",
            beds: 3,
            baths: 2,
            area: "1, 220",
            image: "/assets/images/detail/image3.jpg"
        },
        {
            name: "The Lucent",
            type: "Clementi | Condominium",
            price: "25L",
            beds: 3,
            baths: 2,
            area: "1, 220",
            image: "/assets/images/detail/image4.jpg"
        }
    ]

    return (

        <>
            <Header />
            <div className="property-search-gradient text-white">
                <SliderBanner />
                <PropertyDetailMainSection />
                <PropertySearchReadyProjects readyToMoveProjects={readyToMoveProjects} />
                <PropertySearchRecommended recommendedProperties={recommendedProperties} />
                <PropertySearchPopularSearch />
            </div>
            <WhatsapBanner />
            <Footer />
        </>

    )
}

