"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useStandardWallets } from "@privy-io/react-auth/solana";

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

export function SellerListings() {
  const { authenticated } = usePrivy();
  const { wallets } = useStandardWallets();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const myWallet = wallets[0]?.accounts[0]?.address;
  const myListings = listings.filter((l) => l.sellerWallet === myWallet);

  async function handleRelease(id: string) {
    await fetch("/api/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "released" }),
    });
    fetchListings();
  }

  if (!authenticated) return <p className="text-sm text-gray-400">Sign in to view your listings.</p>;
  if (isLoading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (myListings.length === 0) return <p className="text-sm text-gray-400">You have no listings yet.</p>;

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      {myListings.map((listing) => (
        <div key={listing.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100">
          <p className="font-semibold">{listing.crop}</p>
          <p className="text-sm text-zinc-400">
            {listing.quantity} {listing.unit} — ₦{listing.pricePerUnit}/unit
          </p>
          <p className="text-xs text-zinc-600 mt-1">Status: {listing.status}</p>
          {listing.status === "paid" && (
            <button
              onClick={() => handleRelease(listing.id)}
              className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Release Goods
            </button>
          )}
        </div>
      ))}
    </div>
  );
}