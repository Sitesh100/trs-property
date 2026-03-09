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

function PropertyMainDark({ id }) {
    const { data, isLoading } = useGetPropertyByIdQuery(id);
    // New API returns property data directly
    const apiProperty = data;
    const normalizedProperty = apiProperty
        ? {
            ...apiProperty,
            id: apiProperty?.id,
            title: apiProperty?.title,
            bedrooms: apiProperty?.bedrooms,
            bathrooms: apiProperty?.bathrooms,
            expected_price: apiProperty?.price,
            price: apiProperty?.price,
            property_type: apiProperty?.property_type,
            size: apiProperty?.size,
            super_area: apiProperty?.size,
            carpet_area: apiProperty?.carpet_area,
            location: apiProperty?.map_location,
            city: apiProperty?.map_location,
            map_location: apiProperty?.map_location,
            description: apiProperty?.description,
            nearby_landmarks: apiProperty?.description,
            images: apiProperty?.image || apiProperty?.image_ids || [],
            image: apiProperty?.image,
            image_ids: apiProperty?.image_ids || [],
            gallery: apiProperty?.gallery,
            year_built: apiProperty?.year_built,
            status: apiProperty?.status,
            agent_name: apiProperty?.agent_name,
            agent_email: apiProperty?.agent_email,
            agent_phone: apiProperty?.agent_phone,
            owner: apiProperty?.owner,
            floors: apiProperty?.floors,
            created_date: apiProperty?.created_date,
            updated_date: apiProperty?.updated_date,
        }
        : undefined;
    const propertyId = normalizedProperty?.id || id;

    console.log('API Response:', data);
    console.log('Normalized Property:', normalizedProperty);

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

    if (isLoading) return <>loading...</>

    return (
        <>
            <Header />
            <div className={`flex flex-col min-h-screen text-white`}>
                <main className={`flex-grow property-search-gradient`}>
                    <PropertyDetailHeader property={normalizedProperty} isDark={true} />
                    <PropertyDetailImages property={normalizedProperty} />
                    <PropertyPropertyDetail property={normalizedProperty} propertyFeatures={propertyFeatures} facilities={facilities} />
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


