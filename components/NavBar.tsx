"use client";

import { useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export function NavBar() {
  const { logout } = usePrivy();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
      <Link href="/login" className="text-white font-bold">Gomarket</Link>
      <button
        onClick={() => setOpen(!open)}
        className="text-white text-2xl leading-none"
        aria-label="Menu"
      >
        ☰
      </button>
      {open && (
        <div className="absolute top-full right-4 mt-2 flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-10">
          <Link href="/marketplace" onClick={() => setOpen(false)} className="px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800">
            Marketplace
          </Link>
          <Link href="/seller" onClick={() => setOpen(false)} className="px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800">
            Seller Dashboard
          </Link>
          <button onClick={logout} className="px-5 py-3 text-sm text-red-400 hover:bg-zinc-800 text-left">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}