import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsapBanner from "@/components/home/whatsap-banner"
import IPhoneBanner from "@/components/ui/i-phone-banner"
import PropertyMatchesCard from "@/components/(property)/property-matches/property-matches-card"

export default function PropertyMatchesDetail({ params }) {
    return (
        <>
            <Header />
            <PropertyMatchesCard reqId={params.id} />
            <IPhoneBanner />
            <WhatsapBanner />
            <Footer />
        </>
    )
}
