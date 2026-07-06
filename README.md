# Gomarket

![Status](https://img.shields.io/badge/status-hackathon--build-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

A Solana-powered marketplace connecting Nigerian farmers directly with buyers — built for Superhack.

## Problem

Farmers often rely on middlemen to reach buyers, losing margin and market access. Gomarket lets farmers list produce directly and get paid instantly via Solana, with no crypto experience required.

## Features

- **Social login** — sign in with email/Google via Privy; a Solana wallet is created automatically, no seed phrase needed
- **Listings** — farmers post crop, quantity, unit, price, and location
- **Live marketplace feed** — buyers browse all active listings
- **On-chain payments** — buyers pay sellers directly in SOL on Solana devnet, confirmed in seconds

## Tech Stack

- **Frontend/Backend**: Next.js 15 (TypeScript, App Router, Tailwind CSS)
- **Blockchain**: Solana (devnet), `@solana/web3.js`
- **Wallet/Auth**: Privy (`@privy-io/react-auth`) — embedded, non-custodial wallets
- **Storage**: In-memory (demo scope — see Limitations)

## Prerequisites

- Node.js 20 LTS
- npm
- A Privy account ([dashboard.privy.io](https://dashboard.privy.io)) with Solana + embedded wallets enabled

## Getting Started

1. Clone the repo and install dependencies:
```bash
   npm install --legacy-peer-deps
```
2. Create `.env.local`:
3. Run the dev server:
```bash
   npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. Sign in with email or Google (Privy creates an embedded Solana wallet)
2. Farmers submit a listing via the form — saved through `/api/listings`
3. Buyers browse the live feed and click "Buy" on any listing
4. Payment is sent directly to the seller's wallet as a real SOL transaction on Solana devnet, confirmed on-chain

## Known Limitations

- **In-memory storage**: listings reset when the server restarts — a production version would use a persistent database
- **No price conversion**: listing prices are entered directly as SOL amounts for demo purposes, not converted from Naira
- **No natural-language search**: buyers browse listings directly; AI-assisted search was scoped out to keep the hackathon build simple and reliable

## Project Structure
app/
page.tsx              — homepage
layout.tsx            — root layout, wraps app in Privy provider
api/listings/route.ts — listings API (GET/POST)
components/
LoginButton.tsx        — Privy sign-in/out
BalanceDisplay.tsx      — shows connected wallet's SOL balance
ListingForm.tsx         — create a new listing
ListingsFeed.tsx        — displays all listings
BuyButton.tsx           — sends SOL payment to seller
Marketplace.tsx         — combines form + feed
Providers.tsx           — Privy provider wrapper (client component)

## Built With

Built for the Superhack hackathon, using Claude, Gemini, and ChatGPT for development assistance.

## Contributing

This is a hackathon submission. Issues and PRs are welcome after the event.

## License

MIT