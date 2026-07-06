import { NextResponse } from "next/server";

type Listing = {
  id: string;
  crop: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  sellerWallet: string;
  status: "available" | "paid" | "released" | "completed";
  createdAt: string;
};

const listings: Listing[] = [
  {
    id: crypto.randomUUID(),
    crop: "Tomato",
    quantity: 50,
    unit: "Bags",
    pricePerUnit: 0.05,
    location: "Benin City",
    sellerWallet: "REPLACE_WITH_A_REAL_DEVNET_ADDRESS",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    crop: "Yam",
    quantity: 30,
    unit: "Tubers",
    pricePerUnit: 0.08,
    location: "Ibadan",
    sellerWallet: "REPLACE_WITH_A_REAL_DEVNET_ADDRESS",
    status: "available",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { crop, quantity, unit, pricePerUnit, location, sellerWallet } = body;

    if (!crop || !quantity || !unit || !pricePerUnit || !location || !sellerWallet) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const listing: Listing = {
      id: crypto.randomUUID(),
      crop,
      quantity: Number(quantity),
      unit,
      pricePerUnit: Number(pricePerUnit),
      location,
      sellerWallet,
      status: "available",
      createdAt: new Date().toISOString(),
    };

    listings.push(listing);

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json({ error: "Failed to create listing." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const listing = listings.find((l) => l.id === id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    listing.status = status;
    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Failed to update listing:", error);
    return NextResponse.json({ error: "Failed to update listing." }, { status: 500 });
  }
}