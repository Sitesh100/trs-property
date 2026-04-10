import Header from "@/components/header";
import Footer from "@/components/footer";
import { Eye, MoreVertical } from "lucide-react";
import Image from "next/image";

const articles = [
  {
    id: 1,
    title: "Commercial Space Growth Drivers, Opportunities, and Challenges",
    date: "Jan 2",
    readTime: "4 min read",
    excerpt:
      "India's real estate market is experiencing a remarkable surge, capturing the attention of homebuyers, investors, and industry experts alike...",
    views: 2,
    image: "/assets/images/project/project1.webp",
  },
  {
    id: 2,
    title: "Exploring the Surge in India's Real Estate Market: Drivers, Opportunities, and Challenges",
    date: "Dec 26, 2025",
    readTime: "4 min read",
    excerpt:
      "India's real estate market is experiencing a remarkable surge, capturing the attention of homebuyers, investors, and industry experts alike...",
    views: 3,
    image: "/assets/images/project/project2.webp",
  },
  {
    id: 3,
    title: "Fractional ownership in real estate: How it works and its benefits",
    date: "May 23, 2025",
    readTime: "3 min read",
    excerpt:
      "When purchasing a property, it's crucial to understand the type of ownership you're acquiring, which is mostly either freehold or...",
    views: 0,
    image: "/assets/images/project/project3.webp",
  },
];

function ResearchAdvisoryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#212121] text-[#F5EFE7]">
        <section className="bg-[#212121] py-12 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Welcome to the ultimate Real Estate expert guide.
            </h1>
            <p className="mt-5 max-w-4xl mx-auto text-base sm:text-lg text-[#F5EFE7] leading-relaxed">
              This is TRS Market Research & Advice Section. Your go-to and reliable source to find useful and
              trusted real estate research and analysis curated and verified by Real Estate experts.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="bg-[#F5EFE7] rounded-none sm:rounded-md p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {articles.map((article) => (
                  <article key={article.id} className="bg-[#F5EFE7] border border-[#D8CEC0] shadow-sm overflow-hidden">
                    <div className="relative h-56 w-full">
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-[#212121] mb-4">
                        <span>
                          {article.date} • {article.readTime}
                        </span>
                        <button className="text-[#212121] hover:text-[#212121] transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <h2 className="text-2xl font-bold text-[#212121] leading-tight mb-3">{article.title}</h2>
                      <p className="text-[#212121] text-base leading-relaxed mb-4">{article.excerpt}</p>

                      <div className="border-t border-[#D8CEC0] pt-3 flex items-center gap-1.5 text-[#212121] text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ResearchAdvisoryPage;
