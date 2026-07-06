import { ListingForm } from "@/components/ListingForm";
import { SellerListings } from "@/components/SellerListings";
import { BalanceDisplay } from "@/components/BalanceDisplay";

export default function SellerPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
        <BalanceDisplay />
        <ListingForm />
        <SellerListings />
      </div>
    </main>
  );
}