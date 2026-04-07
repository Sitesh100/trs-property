import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import MyPropertyCard from "@/components/(property)/my-property/my-property-card";

export default function AgentMyPropertyPage() {
    return (
        <>
            <Header />
            <MyPropertyCard />
            <WhatsapBanner />
            <Footer />
        </>
    );
}
