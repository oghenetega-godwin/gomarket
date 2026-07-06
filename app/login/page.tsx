"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Gomarket</h1>
          <p className="text-zinc-400 mt-2">Farm produce, direct from farmer to buyer.</p>
        </div>
        <button
          onClick={login}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Sign in to continue
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 p-8">
      <h1 className="text-3xl font-bold text-white">I am a...</h1>
      <div className="flex gap-6">
        <button
          onClick={() => router.push("/marketplace")}
          className="w-40 h-40 flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-2xl transition-colors"
        >
          <span className="text-4xl">🛒</span>
          <span className="text-white font-semibold">Buyer</span>
        </button>
        <button
          onClick={() => router.push("/seller")}
          className="w-40 h-40 flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-blue-500 rounded-2xl transition-colors"
        >
          <span className="text-4xl">🌾</span>
          <span className="text-white font-semibold">Seller</span>
        </button>
      </div>
    </main>
  );
}