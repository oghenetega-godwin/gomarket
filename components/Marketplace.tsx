"use client";

import { useState, useCallback } from "react";
import { ListingForm } from "@/components/ListingForm";
import { ListingsFeed } from "@/components/ListingsFeed";

/**
 * Combines the listing form and feed, refreshing the feed
 * whenever a new listing is successfully created.
 */
export function Marketplace() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleListingCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <ListingForm onSuccess={handleListingCreated} />
      <ListingsFeed key={refreshKey} />
    </div>
  );
}