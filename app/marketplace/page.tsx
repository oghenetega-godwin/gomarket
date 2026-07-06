import { NavBar } from "@/components/NavBar";
import { ListingsFeed } from "@/components/ListingsFeed";

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8">
      <NavBar />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Marketplace</h1>
        <ListingsFeed />
      </div>
    </main>
  );
}
