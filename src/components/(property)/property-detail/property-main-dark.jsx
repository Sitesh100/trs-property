"use client";
import { useGetPropertyByIdQuery } from "@/service/propertyApi"
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
    const { data, isLoading } = useGetPropertyByIdQuery(id);
    const apiProperty = data?.data?.property;
    const normalizedProperty = apiProperty
        ? {
            ...apiProperty,
            id: apiProperty?._id ?? apiProperty?.id,
            expected_price: apiProperty?.price ?? apiProperty?.expected_price,
            property_type: apiProperty?.propertyType ?? apiProperty?.property_type,
            project_name: apiProperty?.projectName ?? apiProperty?.project_name,
            possession_status: apiProperty?.possessionStatus ?? apiProperty?.possession_status,
            booking_amount: apiProperty?.bookingAmount ?? apiProperty?.booking_amount,
            super_area: apiProperty?.size ?? apiProperty?.superArea ?? apiProperty?.super_area,
            carpet_area: apiProperty?.carpetArea ?? apiProperty?.carpet_area,
            rera_id: apiProperty?.reraId ?? apiProperty?.rera_id,
            builder_name: apiProperty?.builderName ?? apiProperty?.builder_name,
            nearby_landmarks: apiProperty?.landmarks ?? apiProperty?.nearby_landmarks,
            location: apiProperty?.map_location ?? apiProperty?.location ?? apiProperty?.city,
            city: apiProperty?.map_location ?? apiProperty?.city ?? apiProperty?.location,
            images: apiProperty?.image ?? apiProperty?.images ?? apiProperty?.image_ids,
        }
        : undefined;
    const propertyId = normalizedProperty?.id || id;
    const { data: requestStatus } = useGetRequestStatusPropertyQuery(propertyId);

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
                    <PropertyDetailHeader property={normalizedProperty} isDark={true} />
                    <PropertyDetailImages property={normalizedProperty} />
                    <PropertyPropertyDetail property={normalizedProperty} propertyFeatures={propertyFeatures} facilities={facilities} requestStatus={requestStatus?.requested} />
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


