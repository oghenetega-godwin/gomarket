"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useStandardWallets } from "@privy-io/react-auth/solana";
import { BuyButton } from "@/components/BuyButton";

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

export function ListingsFeed() {
  const { authenticated } = usePrivy();
  const { wallets } = useStandardWallets();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const myWallet = wallets[0]?.accounts?.[0]?.address;

  const fetchListings = () => {
    setIsLoading(true);
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(data.listings ?? []))
      .catch((error) => console.error("Failed to fetch listings:", error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (isLoading) return <p className="text-sm text-zinc-500">Loading listings...</p>;

  const buyerListings = listings.filter((l) => l.sellerWallet !== myWallet);

  if (buyerListings.length === 0) {
    return <p className="text-sm text-zinc-500">No listings available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {buyerListings.map((listing) => (
        <div
          key={listing.id}
          className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-100 shadow-lg"
        >
          <p className="font-semibold text-lg">{listing.crop}</p>
          <p className="text-sm text-zinc-400 mt-1">
            {listing.quantity} {listing.unit} — ₦{listing.pricePerUnit}/unit
          </p>
          <p className="text-sm text-zinc-500">{listing.location}</p>
          <p className="text-xs text-zinc-600 mt-2 uppercase tracking-wide">{listing.status}</p>

          {listing.status === "available" && (
            <div className="mt-3">
              <BuyButton
                listingId={listing.id}
                amountSol={listing.pricePerUnit}
                sellerWallet={listing.sellerWallet}
                onPaid={fetchListings}
              />
            </div>
          )}

          {listing.status === "paid" && (
            <p className="text-sm text-zinc-500 mt-3">Awaiting seller release</p>
          )}

          {listing.status === "released" && (
            <button
              onClick={async () => {
                await fetch("/api/listings", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: listing.id, status: "completed" }),
                });
                fetchListings();
              }}
              className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Confirm Received
            </button>
          )}

          {listing.status === "completed" && (
            <p className="text-sm text-emerald-500 mt-3">Order completed</p>
          )}
        </div>
      ))}
    </div>
  );
}