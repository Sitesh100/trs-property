"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useGetBlogsQuery } from "@/service/blogApi";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

const formatBlogDate = (dateString) => {
  if (!dateString) return "Recently published";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently published";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function BlogDetailPage({ blogId }) {
  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery({
    skip: 0,
    limit: 1000,
  });

  const selectedBlog = blogs.find((blog) => String(blog?.id) === String(blogId));
  const shareUrl =
    typeof window !== "undefined" && blogId
      ? `${window.location.origin}/blog/${blogId}`
      : "";

  const handleShare = async () => {
    if (!selectedBlog) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedBlog.title,
          text: selectedBlog.title,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Blog link copied to clipboard");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share right now");
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#212121] text-[#F5EFE7] py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {isLoading && (
            <div className="text-center py-20 text-[#F5EFE7]/80">Loading blog...</div>
          )}

          {!isLoading && isError && (
            <div className="text-center py-20 text-[#F5EFE7]/80">
              Unable to load this blog right now.
            </div>
          )}

          {!isLoading && !isError && !selectedBlog && (
            <div className="text-center py-20 text-[#F5EFE7]/80">Blog not found.</div>
          )}

          {!isLoading && !isError && selectedBlog && (
            <article className="bg-[#F5EFE7] text-[#212121] rounded-lg overflow-hidden shadow-lg">
              <div className="p-6 sm:p-10">
                <p className="text-sm text-[#212121]/70 mb-3">
                  {formatBlogDate(selectedBlog.published_date)} • {selectedBlog.author || "Admin"}
                </p>
                <h1 className="text-2xl sm:text-4xl font-bold mb-6">{selectedBlog.title}</h1>

                <div className="w-full h-72 sm:h-96 bg-[#E7DED3] rounded-md overflow-hidden mb-8">
                  <img
                    src={selectedBlog.image_url || "/assets/images/project/project1.webp"}
                    alt={selectedBlog.title || "Blog image"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="text-base leading-relaxed prose max-w-none prose-headings:mt-6 prose-p:my-4"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content || "" }}
                />

                <div className="mt-10 pt-6 border-t border-[#212121]/15">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#212121] text-[#F5EFE7] hover:bg-[#2c2c2c] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share This Blog
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
