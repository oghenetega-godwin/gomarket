"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useStandardWallets } from "@privy-io/react-auth/solana";
import {
  Connection,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import bs58 from "bs58";

interface BuyButtonProps {
  listingId: string;
  amountSol: number;
  sellerWallet: string;
  onPaid?: () => void;
}

export function BuyButton({ listingId, amountSol, sellerWallet, onPaid }: BuyButtonProps) {
  const { authenticated } = usePrivy();
  const { wallets } = useStandardWallets();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleBuy() {
    const wallet = wallets[0];
    if (!authenticated || !wallet) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const fromPubkey = new PublicKey(wallet.accounts[0].address);
      const toPubkey = new PublicKey(sellerWallet);

      const instruction = SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: Math.round(amountSol * LAMPORTS_PER_SOL),
      });

      const feature = wallet.features["solana:signAndSendTransaction"];
      if (!feature) throw new Error("Wallet does not support signAndSendTransaction");

      const { blockhash } = await connection.getLatestBlockhash();
      const messageV0 = new TransactionMessage({
        payerKey: fromPubkey,
        recentBlockhash: blockhash,
        instructions: [instruction],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const [result] = await feature.signAndSendTransaction({
        transaction: transaction.serialize(),
        account: wallet.accounts[0],
        chain: "solana:devnet",
      });

      await connection.confirmTransaction(bs58.encode(result.signature), "confirmed");

      await fetch("/api/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listingId, status: "paid" }),
      });

      setStatus("success");
      onPaid?.();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Transaction failed");
    }
  }

  if (!authenticated) return null;

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={status === "sending"}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
      >
        {status === "sending" ? "Processing..." : `Buy for ${amountSol} SOL`}
      </button>
      {status === "success" && <p className="text-sm text-emerald-400 mt-1">Payment sent — awaiting release</p>}
      {status === "error" && <p className="text-sm text-red-400 mt-1">{errorMessage}</p>}
    </div>
  );
}