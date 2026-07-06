"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useStandardWallets } from "@privy-io/react-auth/solana";
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

/**
 * Displays the SOL balance of the user's embedded Solana wallet.
 * Fetches from devnet via web3.js, keyed off Privy auth state.
 */
export function BalanceDisplay() {
  const { authenticated } = usePrivy();
  const { wallets } = useStandardWallets();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const solanaWallet = wallets[0];
    const account = solanaWallet?.accounts?.[0];

    if (!authenticated || !account) {
      setBalance(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const publicKey = new PublicKey(account.address);

    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
      })
      .catch((error) => {
        console.error("Failed to fetch Solana balance:", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated, wallets]);

  if (!authenticated) {
    return <p className="text-sm text-gray-400">Connect a wallet to see your balance</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading balance...</p>;
  }

  return (
    <p className="text-lg font-medium">
      {balance !== null ? `Balance: ${balance.toFixed(4)} SOL` : "No Solana wallet found."}
    </p>
  );
}