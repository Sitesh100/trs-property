import Header from "@/components/header"
import HeroSection from "@/components/home/hero-section"
import FounderSection from "@/components/home/founder-section"
import AiRevolutionSection from "@/components/home/ai-revolution-section"
import DeveloperBanner from "@/components/home/developer-banner"
import PatnerSection from "@/components/home/patner-section"
import Testimonials from "@/components/home/testimonials"
import NewsLetter from "@/components/home/news-letter"
import WhatsapBanner from "@/components/home/whatsap-banner"
import Footer from "@/components/footer"
import FeaturedProjects from "@/components/home/featured-projects"
import ServicesToolsSection from "@/components/home/services-tools-section"
import FAQSection from "@/components/home/faq-section"

export default function Home() {

  const testimonials = [
    {
      name: "ABHAY SHARMA",
      image:
        "/assets/images/testimonials/test1.jpg",
      desc: "Share the amazing things customers are saying about your business. Double click, or click Edit Text to make it yours."
    },
    {
      name: "ABHAY SHARMA",
      image:
        "/assets/images/testimonials/test2.jpg",
      desc: "Share the amazing things customers are saying about your business. Double click, or click Edit Text to make it yours."
    },
    {
      name: "Esther Howard",
      image:
        "/assets/images/testimonials/test3.jpg",
      desc: "Share the amazing things customers are saying about your business. Double click, or click Edit Text to make it yours."
    },
    {
      name: "ABHAY SHARMA",
      image:
        "/assets/images/testimonials/test1.jpg",
      desc: "Share the amazing things customers are saying about your business. Double click, or click Edit Text to make it yours."
    },
    {
      name: "ABHAY SHARMA",
      image:
        "/assets/images/testimonials/test2.jpg",
      desc: "Share the amazing things customers are saying about your business. Double click, or click Edit Text to make it yours."
    },
    {
      name: "Esther Howard",
      image:
        "/assets/images/testimonials/test3.jpg",
      desc: "Share the amazing things customers are saying about your business. Double click, or click Edit Text to make it yours."
    },
  ]

  const features = [
    {
      title: "Creative User Interface & Technology",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Advance Filters & Verified Properties",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      ),
    },
    {
      title: "Dedicated Customer Support Team",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
    },
    {
      title: "30+ Years of Industry Experience",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  const imagesPatner = [
    "/assets/images/text1.png",
    "/assets/images/text2.png",
    "/assets/images/text3.png",
    "/assets/images/text4.png",
    "/assets/images/text5.png",
  ]

  const services = [
    {
      img: "/assets/images/service/service-one.avif",
      btn: "EMI CALCULATOR"
    },
    {
      img: "/assets/images/service/service-two.avif",
      btn: "QUICK HOME LOAN"
    },
    {
      img: "/assets/images/service/service-three.avif",
      btn: "PROPERTY VERIFICATION"
    },
  ]

  const faqs = [
    {
      id: 1,
      question: "How do I create an account?",
      answer:
        "Creating an account is simple! Click on the 'Sign Up' button in the top right corner, fill in your details including name, email, and phone number, verify your email address, and you're ready to start exploring properties.",
    },
    {
      id: 2,
      question: "Is my personal information secured?",
      answer:
        "Yes, absolutely! We use industry-standard encryption and security measures to protect your personal information. Your data is stored securely and we never share your information with third parties without your explicit consent.",
    },
    {
      id: 3,
      question: "How do I post a property for sale or rent?",
      answer:
        "After logging in, click on 'Post Property' in the navigation menu. Choose whether you want to sell or rent, select your property type, fill in all the required details, upload high-quality photos, and submit for review. Your property will be live within 24 hours after approval.",
    },
    {
      id: 4,
      question: "What are the charges for posting a property?",
      answer:
        "We offer both free and premium listing options. Basic listings are free and include standard features. Premium listings start from ₹999 and include featured placement, priority support, and advanced analytics.",
    },
    {
      id: 5,
      question: "How can I contact property owners?",
      answer:
        "Once you find a property you're interested in, you can contact the owner through our secure messaging system, call them directly using the provided contact number, or schedule a property visit through our platform.",
    },
    {
      id: 6,
      question: "Can I get a home loan through your platform?",
      answer:
        "Yes! We partner with leading banks and financial institutions to offer competitive home loan rates. Use our EMI calculator to estimate your monthly payments and apply for pre-approval directly through our platform.",
    },
    {
      id: 7,
      question: "How do I verify property documents?",
      answer:
        "We offer professional property verification services. Our legal experts will verify all property documents, check for clear titles, ensure compliance with local regulations, and provide you with a detailed verification report.",
    },
    {
      id: 8,
      question: "What if I face issues with a property transaction?",
      answer:
        "Our customer support team is available 24/7 to help resolve any issues. We also offer legal assistance and mediation services to ensure smooth property transactions for all parties involved.",
    },
  ]

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen  text-white">
        <main className="flex-grow">
          <HeroSection />
          <FeaturedProjects />
          {/* <FounderSection /> */}
          {/* <AiRevolutionSection features={features} /> */}
          {/* <DeveloperBanner /> */}
          <PatnerSection imagesPatner={imagesPatner} />
          {/* <ServicesToolsSection services={services} /> */}
          <Testimonials testimonials={testimonials} />
          <FAQSection faqs={faqs} />
          <NewsLetter />
        </main>
        {/* <WhatsapBanner /> */}
        <Footer />
      </div>
    </>
  )
}

