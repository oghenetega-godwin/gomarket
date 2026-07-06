"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useStandardWallets } from "@privy-io/react-auth/solana";

interface ListingFormProps {
  onSuccess?: () => void;
}

/**
 * Manual listing creation form. Submits crop/quantity/unit/price/location
 * plus the farmer's wallet address to /api/listings.
 */
export function ListingForm({ onSuccess }: ListingFormProps) {
  const { authenticated } = usePrivy();
  const { wallets } = useStandardWallets();

  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    unit: "",
    pricePerUnit: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const wallet = wallets[0];
    if (!authenticated || !wallet) {
      setMessage({ type: "error", text: "Connect your wallet before creating a listing." });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: formData.crop,
          quantity: Number(formData.quantity),
          unit: formData.unit,
          pricePerUnit: Number(formData.pricePerUnit),
          location: formData.location,
          sellerWallet: wallet.accounts[0].address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the listing");
      }

      setMessage({ type: "success", text: "Listing created successfully!" });
      setFormData({ crop: "", quantity: "", unit: "", pricePerUnit: "", location: "" });
      onSuccess?.();
    } catch (error) {
      const text = error instanceof Error ? error.message : "An error occurred during submission.";
      setMessage({ type: "error", text });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-emerald-400">Create Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="crop" className="block text-sm font-medium text-zinc-400 mb-1">Crop</label>
          <input
            id="crop"
            name="crop"
            type="text"
            required
            value={formData.crop}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Tomato"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-zinc-400 mb-1">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-zinc-400 mb-1">Unit</label>
            <input
              id="unit"
              name="unit"
              type="text"
              required
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., Bags"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pricePerUnit" className="block text-sm font-medium text-zinc-400 mb-1">Price Per Unit</label>
          <input
            id="pricePerUnit"
            name="pricePerUnit"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., 15000"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-400 mb-1">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Benin City"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit Listing"}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm border ${message.type === "success" ? "bg-emerald-900/30 border-emerald-800 text-emerald-400" : "bg-red-900/30 border-red-800 text-red-400"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}