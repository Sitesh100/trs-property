import { NextResponse } from "next/server";
import { getWixBlogClient } from "@/service/wixClient";

const DEFAULT_LIMIT = 5;

function toSafeInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 50);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = toSafeInt(searchParams.get("limit"), DEFAULT_LIMIT);

  try {
    const wixClient = getWixBlogClient();

    const [postsRes, categoriesRes, tagsRes] = await Promise.all([
      wixClient.posts.listPosts({ paging: { limit, offset: 0 } }),
      wixClient.categories.listCategories({ paging: { limit, offset: 0 } }),
      wixClient.tags.queryTags().limit(limit).find(),
    ]);

    return NextResponse.json({
      ok: true,
      totalPosts: postsRes?.metaData?.total ?? postsRes?.posts?.length ?? 0,
      totalCategories:
        categoriesRes?.metaData?.total ?? categoriesRes?.categories?.length ?? 0,
      totalTags: tagsRes?.items?.length ?? 0,
      posts: (postsRes?.posts || []).map((post) => ({
        id: post?._id,
        title: post?.title,
        slug: post?.slug,
        excerpt: post?.excerpt,
      })),
      categories: (categoriesRes?.categories || []).map((category) => ({
        id: category?._id,
        label: category?.label,
        slug: category?.slug,
        postCount: category?.postCount,
      })),
      tags: (tagsRes?.items || []).map((tag) => ({
        id: tag?._id,
        label: tag?.label,
        slug: tag?.slug,
        postCount: tag?.postCount,
      })),
    });
  } catch (error) {
    const message =
      error?.details?.applicationError?.description ||
      error?.message ||
      "Unknown Wix blog error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
