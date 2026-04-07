import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import PropertyMatchesCard from "@/components/(property)/property-matches/property-matches-card";

export default function AgentMatchMakingPage() {
    return (
        <>
            <Header />
            <PropertyMatchesCard />
            <WhatsapBanner />
            <Footer />
        </>
    );
}
