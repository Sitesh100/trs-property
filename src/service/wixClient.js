import { createClient, OAuthStrategy, ApiKeyStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import { posts, categories, tags } from "@wix/blog";

const FALLBACK_WIX_CLIENT_ID = "5cb3596e-3bc4-4ba4-8bc0-5adda1c16ecd";

export const wixClientId =
  process.env.WIX_CLIENT_ID ||
  process.env.NEXT_PUBLIC_WIX_CLIENT_ID ||
  FALLBACK_WIX_CLIENT_ID;

const wixApiKey = process.env.WIX_API_KEY;
const wixSiteId = process.env.WIX_SITE_ID;
const wixAccountId = process.env.WIX_ACCOUNT_ID;

function getWixAuthStrategy() {
  if (wixApiKey) {
    if (!wixSiteId && !wixAccountId) {
      throw new Error(
        "WIX_API_KEY is set, but WIX_SITE_ID or WIX_ACCOUNT_ID is missing."
      );
    }

    return ApiKeyStrategy({
      apiKey: wixApiKey,
      ...(wixSiteId ? { siteId: wixSiteId } : {}),
      ...(wixAccountId ? { accountId: wixAccountId } : {}),
    });
  }

  return OAuthStrategy({ clientId: wixClientId });
}

export function getWixClient() {
  return getWixDataClient();
}

export function getWixDataClient() {
  return createClient({
    modules: { items },
    auth: getWixAuthStrategy(),
  });
}

export function getWixBlogClient() {
  return createClient({
    modules: { posts, categories, tags },
    auth: getWixAuthStrategy(),
  });
}
