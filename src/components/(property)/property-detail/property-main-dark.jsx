"use client";
import { useGetSinglePropertyQuery } from "@/service/propertyApi"
import Footer from "../../footer"
import Header from "../../header"
import WhatsapBanner from "../../home/whatsap-banner"
import PropertyPropertyDetail from "./property-detail"
import PropertyDetailBanner from "./property-detail-banner"
import PropertyDetailHeader from "./property-detail-header"
import PropertyDetailImages from "./property-detail-images"
import PropertyDetailSimilarProperties from "./property-detail-similar-properties"
import { useGetRequestStatusPropertyQuery } from "@/service/tourApi";

function PropertyMainDark({ id }) {
    const { data, isLoading } = useGetSinglePropertyQuery(id);
    const { data: requestStatus } = useGetRequestStatusPropertyQuery(id);

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

    console.log(requestStatus, 'requestStatus')

    if (isLoading) return <>loading...</>

    return (
        <>
            <Header />
            <div className={`flex flex-col min-h-screen text-white`}>
                <main className={`flex-grow property-search-gradient`}>
                    <PropertyDetailHeader property={data?.data[0]} isDark={true} />
                    <PropertyDetailImages property={data?.data[0]} />
                    <PropertyPropertyDetail property={data?.data[0]} propertyFeatures={propertyFeatures} facilities={facilities} requestStatus={requestStatus?.requested} />
                    <PropertyDetailSimilarProperties similarProperties={similarProperties} />
                    <PropertyDetailBanner />
                </main>
                <WhatsapBanner />
                <Footer />
            </div >
        </>
    )
}
export default PropertyMainDark


