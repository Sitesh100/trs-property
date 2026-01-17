import Footer from "@/components/footer"
import Header from "@/components/header"
import WhatsapBanner from "@/components/home/whatsap-banner"
import PropertyPropertyDetail from "@/components/(property)/property-detail/property-detail"
import PropertyDetailBanner from "@/components/(property)/property-detail/property-detail-banner"
import PropertyDetailHeader from "@/components/(property)/property-detail/property-detail-header"
import PropertyDetailImages from "@/components/(property)/property-detail/property-detail-images"
import PropertyDetailSimilarProperties from "@/components/(property)/property-detail/property-detail-similar-properties"

function PropertyDetailPage() {
    const propertyFeatures = [
        "3 Bedrooms",
        "2 Baths",
        "Balcony",
        "Store room",
        "Air-conditioning",
        "Fully equipped Kitchen",
    ]

    const facilities = [
        "Carpark",
        "Swimming Pool",
        "BBQ Pits",
        "Kid's Pool",
        "Gym",
        "Function rooms",
        "Tennis Court",
        "Playground",
    ]

    const similarProperties = [
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
            <div className={`flex flex-col min-h-screen text-black`}>
                <main className={`flex-grow bg-[#F2F4F7]`}>
                    <PropertyDetailHeader />
                    <PropertyDetailImages />
                    <PropertyPropertyDetail propertyFeatures={propertyFeatures} facilities={facilities} />
                    <PropertyDetailSimilarProperties similarProperties={similarProperties} />
                    <PropertyDetailBanner />
                </main>
                <WhatsapBanner />
                <Footer />
            </div >
        </>
    )
}
export default PropertyDetailPage
