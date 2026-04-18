import BlogDetailPage from "@/components/blog/blog-detail-page";

export default function BlogDetailRoute({ params }) {
  return <BlogDetailPage blogId={params?.id} />;
}
