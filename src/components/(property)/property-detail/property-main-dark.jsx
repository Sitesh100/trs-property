"use client";
import { useGetPropertyByIdQuery, useGetSimilarPropertiesQuery } from "@/service/propertyApi"
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
    const {
        data: similarApiResponse = [],
        isLoading: isSimilarLoading,
        isError: isSimilarError,
    } = useGetSimilarPropertiesQuery(id, { skip: !id });
    // New API returns property data directly
    const apiProperty = data;
    const normalizedProperty = apiProperty
        ? {
            ...apiProperty,
            id: apiProperty?.id,
            title: apiProperty?.title,
            bedrooms: apiProperty?.bedrooms,
            bathrooms: apiProperty?.bathrooms,
            expected_price: apiProperty?.expected_price,
            price: apiProperty?.expected_price,
            property_type: apiProperty?.property_type,
            super_area: apiProperty?.super_area,
            carpet_area: apiProperty?.carpet_area,
            location: apiProperty?.map_address || apiProperty?.map_location,
            city: apiProperty?.city || apiProperty?.map_address,
            map_location: apiProperty?.map_address || apiProperty?.map_location,
            map_address: apiProperty?.map_address,
            description: apiProperty?.description,
            nearby_landmarks: apiProperty?.nearby_landmarks || apiProperty?.description,
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
            floors: apiProperty?.total_floors,
            possession_status: apiProperty?.possession_status,
            furnished_status: apiProperty?.furnished_status,
            created_date: apiProperty?.created_date,
            updated_date: apiProperty?.updated_date,
        }
        : undefined;

    // Build property features from API data
    const propertyFeatures = [];
    if (apiProperty?.bedrooms) {
        propertyFeatures.push(`${apiProperty.bedrooms} Bedroom${apiProperty.bedrooms > 1 ? 's' : ''}`);
    }
    if (apiProperty?.bathrooms) {
        propertyFeatures.push(`${apiProperty.bathrooms} Bathroom${apiProperty.bathrooms > 1 ? 's' : ''}`);
    }
    if (apiProperty?.balconies) {
        propertyFeatures.push(`${apiProperty.balconies} Balcon${apiProperty.balconies > 1 ? 'ies' : 'y'}`);
    }
    if (apiProperty?.parking_spaces) {
        propertyFeatures.push(`${apiProperty.parking_spaces} Parking Space${apiProperty.parking_spaces > 1 ? 's' : ''}`);
    }
    if (apiProperty?.floor_number) {
        propertyFeatures.push(`Floor ${apiProperty.floor_number}`);
    }
    if (apiProperty?.total_floors) {
        propertyFeatures.push(`Total ${apiProperty.total_floors} Floors`);
    }
    if (apiProperty?.furnished_status) {
        propertyFeatures.push(apiProperty.furnished_status);
    }

    // Get facilities from API response
    const facilities = apiProperty?.facilities && apiProperty.facilities.length > 0 
        ? apiProperty.facilities 
        : [];

    const similarProperties = (Array.isArray(similarApiResponse) ? similarApiResponse : []).map((property) => ({
        ...property,
        id: property?.id,
        name: property?.title || property?.name || "Untitled Property",
        type: [property?.city, property?.property_type].filter(Boolean).join(" | "),
        price: property?.expected_price ?? property?.booking_amount ?? property?.price,
        beds: property?.bedrooms,
        baths: property?.bathrooms,
        area: property?.super_area || property?.carpet_area,
        image: property?.image,
    }));

    if (isLoading) return <>loading...</>

    return (
        <>
            <Header />
            <div className={`flex flex-col min-h-screen text-[#F5EFE7]`}>
                <main className={`grow property-search-gradient`}>
                    <PropertyDetailHeader property={normalizedProperty} isDark={true} />
                    <PropertyDetailImages property={normalizedProperty} />
                    <PropertyPropertyDetail property={normalizedProperty} rawProperty={apiProperty} propertyFeatures={propertyFeatures} facilities={facilities} />
                    <PropertyDetailSimilarProperties
                        similarProperties={similarProperties}
                        isLoading={isSimilarLoading}
                        isError={isSimilarError}
                    />
                    <PropertyDetailBanner />
                </main>
                <WhatsapBanner />
                <Footer />
            </div >
        </>
    )
}
export default PropertyMainDark


