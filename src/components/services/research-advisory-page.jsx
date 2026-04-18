"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { User, MoreVertical } from "lucide-react";
import { useGetBlogsQuery } from "@/service/blogApi";
import Link from "next/link";

const stripHtml = (text = "") => text.replace(/<[^>]+>/g, "").trim();
const formatBlogDate = (dateString) => {
  if (!dateString) return "Recently published";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently published";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function ResearchAdvisoryPage() {
  const { data: apiArticles = [], isLoading, isError } = useGetBlogsQuery({
    skip: 0,
    limit: 100,
  });
  const articles = [...apiArticles].sort((a, b) => {
    const first = new Date(b?.published_date || 0).getTime();
    const second = new Date(a?.published_date || 0).getTime();
    return first - second;
  });

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
                {isLoading && (
                  <p className="col-span-full text-center text-[#212121]/80">Loading blogs...</p>
                )}

                {!isLoading && isError && (
                  <p className="col-span-full text-center text-[#212121]/80">
                    Unable to load blogs right now.
                  </p>
                )}

                {!isLoading && !isError && articles.length === 0 && (
                  <p className="col-span-full text-center text-[#212121]/80">No blogs found.</p>
                )}

                {articles.map((article) => (
                  <Link key={article.id ?? article.title} href={`/blog/${article.id}`}>
                  <article className="bg-[#F5EFE7] border border-[#D8CEC0] shadow-sm overflow-hidden cursor-pointer">
                    <div className="relative h-64 w-full">
                      <img
                        src={article.image_url || "/assets/images/project/project1.webp"}
                        alt={article.title || "Blog image"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-[#212121] mb-4">
                        <span>
                          {formatBlogDate(article.published_date)}
                        </span>
                        <span className="text-[#212121] hover:text-[#212121] transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-[#212121] leading-tight mb-3">{article.title}</h2>
                      <p className="text-[#212121] text-base leading-relaxed mb-4 line-clamp-4">
                        {stripHtml(article.content)}
                      </p>

                      <div className="border-t border-[#D8CEC0] pt-3 flex items-center gap-1.5 text-[#212121] text-sm">
                        <User className="w-4 h-4" />
                        <span>{article.author || "Admin"}</span>
                      </div>
                    </div>
                  </article>
                  </Link>
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
