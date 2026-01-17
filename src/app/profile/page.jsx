import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsapBanner from "@/components/home/whatsap-banner"
import ProfileForm from "@/components/(profile)/profile-form/profile-form"

export default function ProfilePage() {
    return (
        <>
            <Header />
            <ProfileForm />
            <WhatsapBanner />
            <Footer />
        </>

    )
}

