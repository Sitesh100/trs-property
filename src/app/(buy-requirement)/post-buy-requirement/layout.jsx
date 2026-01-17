import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsapBanner from "@/components/home/whatsap-banner"

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <WhatsapBanner />
            <Footer />
        </>
    )
}

export default Layout

