import { NextResponse } from "next/server";

const SELL_DO_URL = "https://app.sell.do/api/leads/create";
const SELL_DO_API_KEY = "3c2c197535c53a602c263a4e25008e52";
const SELL_DO_CAMPAIGN_SRD = "699fb0d0e11487234b1cfc49";

export async function POST(request) {
  try {
    const body = await request.json();
    const customerName = body?.customerName?.trim() || "";
    const customerEmail = body?.customerEmail?.trim() || "";
    const customerNumber = body?.customerNumber?.trim() || "";
    const notes = body?.notes?.trim() || "";

    if (!customerName || !customerNumber) {
      return NextResponse.json(
        { message: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.set("sell_do[form][lead][name]", customerName);
    formData.set("sell_do[form][lead][phone]", customerNumber);
    formData.set("sell_do[form][note][content]", notes);
    if (customerEmail) {
      formData.set("sell_do[form][lead][email]", customerEmail);
    }
    formData.set("sell_do[campaign][srd]", SELL_DO_CAMPAIGN_SRD);
    formData.set("api_key", SELL_DO_API_KEY);

    const response = await fetch(SELL_DO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      cache: "no-store",
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data?.message || data?.error || "Failed to create Sell.Do lead.",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Lead synced to Sell.Do successfully.",
      sellDo: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to submit lead right now.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
