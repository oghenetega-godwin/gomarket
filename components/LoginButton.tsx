"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LoginButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) {
    return <button disabled>Loading...</button>;
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">
          {user?.email?.address ?? user?.google?.email ?? "Signed in"}
        </span>
        <button onClick={logout} className="text-sm underline">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium"
    >
      Sign in
    </button>
  );
}