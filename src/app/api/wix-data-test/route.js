import { NextResponse } from "next/server";
import { getWixClient } from "@/service/wixClient";

const DEFAULT_COLLECTION = "Members/FullData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") || DEFAULT_COLLECTION;

  try {
    const wixClient = getWixClient();
    const dataItemsList = await wixClient.items.query(collection).find();
    const ids = (dataItemsList?.items || [])
      .map((item) => item?.data?._id)
      .filter(Boolean);

    return NextResponse.json({
      ok: true,
      collection,
      total: dataItemsList?.items?.length || 0,
      ids,
      firstItem: dataItemsList?.items?.[0] || null,
    });
  } catch (error) {
    const message =
      error?.details?.applicationError?.description ||
      error?.message ||
      "Unknown Wix error";

    return NextResponse.json(
      {
        ok: false,
        collection,
        error: message,
      },
      { status: 500 }
    );
  }
}
