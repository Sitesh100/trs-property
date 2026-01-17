import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsapBanner from "@/components/home/whatsap-banner"
import SliderBanner from "@/components/ui/slider-banner"
import IPhoneBanner from "@/components/ui/i-phone-banner"
import MyPropertyCard from "@/components/(property)/my-property/my-property-card"

export default function MyProperty() {
    return (

        <>
            <Header />
            <SliderBanner  />
            <MyPropertyCard />
            <IPhoneBanner />
            <WhatsapBanner />
            <Footer />
        </>

    )
}

