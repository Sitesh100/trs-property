import { NextResponse } from "next/server";
import { getWixBlogClient } from "@/service/wixClient";

const DEFAULT_LIMIT = 5;

const IMAGE_EXT_RE = /\.(png|jpe?g|webp|avif|gif|svg)([?#].*)?$/i;

function normalizeWixImageUrl(value) {
  if (typeof value !== "string" || !value) return "";

  if (value.startsWith("wix:image://")) {
    const match = value.match(/^wix:image:\/\/v1\/([^/]+)\/?([^#?]*)/i);
    if (!match) return "";

    const mediaId = match[1];
    const fileName = match[2];
    return fileName
      ? `https://static.wixstatic.com/media/${mediaId}/${fileName}`
      : `https://static.wixstatic.com/media/${mediaId}`;
  }

  return value;
}

function pickFirstString(candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return "";
}

function looksLikeImageRef(value) {
  if (typeof value !== "string" || !value) return false;
  if (value.startsWith("wix:image://")) return true;
  if (value.includes("static.wixstatic.com/media/")) return true;
  if (IMAGE_EXT_RE.test(value)) return true;
  return false;
}

function deepFindImageRef(value, depth = 0) {
  if (!value || depth > 8) return "";

  if (typeof value === "string") {
    return looksLikeImageRef(value) ? value : "";
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = deepFindImageRef(entry, depth + 1);
      if (found) return found;
    }
    return "";
  }

  if (typeof value === "object") {
    const preferredKeys = [
      "coverMedia",
      "media",
      "coverImage",
      "featuredImage",
      "heroImage",
      "image",
      "thumbnail",
      "richContent",
      "content",
    ];

    for (const key of preferredKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const found = deepFindImageRef(value[key], depth + 1);
        if (found) return found;
      }
    }

    for (const nested of Object.values(value)) {
      const found = deepFindImageRef(nested, depth + 1);
      if (found) return found;
    }
  }

  return "";
}

function extractPostImage(post, fullPost = null) {
  const direct = pickFirstString([
    post?.coverMedia?.image?.url,
    post?.coverMedia?.wixMedia?.image?.url,
    post?.media?.image?.url,
    post?.media?.wixMedia?.image?.url,
    post?.coverImage?.url,
    post?.heroImage?.url,
    post?.image?.url,
    post?.featuredImage?.url,
    post?.coverMedia?.image,
    post?.media?.image,
    fullPost?.coverMedia?.image?.url,
    fullPost?.coverMedia?.wixMedia?.image?.url,
    fullPost?.media?.image?.url,
    fullPost?.media?.wixMedia?.image?.url,
    fullPost?.coverImage?.url,
    fullPost?.heroImage?.url,
    fullPost?.image?.url,
    fullPost?.featuredImage?.url,
    fullPost?.coverMedia?.image,
    fullPost?.media?.image,
  ]);

  const fallback = direct || deepFindImageRef(fullPost || post);

  const imageUrl = normalizeWixImageUrl(fallback);

  const source = fallback || null;

  return {
    imageUrl,
    imageSource: source,
  };
}

async function getFullPost(wixClient, postId) {
  if (!postId) return null;

  // Different SDK versions may accept object or positional args.
  const attempts = [
    () => wixClient.posts.getPost({ postId }),
    () => wixClient.posts.getPost(postId),
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      return response?.post || response?.item || response || null;
    } catch {
      // Try next signature.
    }
  }

  return null;
}

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

    const basePosts = postsRes?.posts || [];

    const postsWithImages = await Promise.all(
      basePosts.map(async (post) => {
        const fullPost = await getFullPost(wixClient, post?._id);
        const image = extractPostImage(post, fullPost);

        return {
          id: post?._id,
          title: post?.title,
          slug: post?.slug,
          excerpt: post?.excerpt,
          ...image,
          imageFoundInFullPost: Boolean(!extractPostImage(post).imageUrl && image.imageUrl),
        };
      })
    );

    return NextResponse.json({
      ok: true,
      totalPosts: postsRes?.metaData?.total ?? postsRes?.posts?.length ?? 0,
      totalCategories:
        categoriesRes?.metaData?.total ?? categoriesRes?.categories?.length ?? 0,
      totalTags: tagsRes?.items?.length ?? 0,
      posts: postsWithImages,
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
