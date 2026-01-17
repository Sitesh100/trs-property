import PropertyMainDark from "@/components/(property)/property-detail/property-main-dark"

async function PropertyDetailPage({ params }) {
    const { id } = await params;

    return (
        <>
            <PropertyMainDark id={id} />
        </>
    )
}
export default PropertyDetailPage
