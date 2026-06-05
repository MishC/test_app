"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StoreIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Doc } from "@/convex/_generated/dataModel";
import { ProductCard } from "./product-card";

type Props = {
  store: Doc<"users">;
  products: Doc<"products">[];
  canManageStore?: boolean;
};

export function StoreProducts({
  store,
  products,
  canManageStore = false,
}: Props) {
  const [filter, setFilter] = useState("");
  const normalizedFilter = filter.trim().toLowerCase();

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!normalizedFilter) {
          return true;
        }

        return product.name.toLowerCase().includes(normalizedFilter);
      })
      .sort((firstProduct, secondProduct) =>
        firstProduct.name.localeCompare(secondProduct.name, undefined, {
          sensitivity: "base",
        })
      );
  }, [normalizedFilter, products]);

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-zinc-300 bg-zinc-200 p-8 sm:flex-row sm:items-center sm:justify-between">
      

        <div className="w-full sm:max-w-xs">
          <Input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter products..."
            aria-label="Filter products"
            className="h-10 border-zinc-500 bg-gray-100 shadow-sm outline outline-2 outline-zinc-300 transition-all placeholder:text-zinc-500 hover:border-zinc-700 hover:outline-4 hover:outline-zinc-400 focus-visible:border-zinc-900 focus-visible:outline-4 focus-visible:outline-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500/40"
          />
        </div>
          <div className="flex max-w-30 items-center gap-3 rounded-full object-cover">
          <Link href="/">
            <StoreIcon size={30} />
          </Link>
        </div>
      </header>

      <div className="grid gap-3 p-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product._id}
            store={store}
            product={product}
            showStatus={canManageStore && product.clerkId === store.clerkId}
          />
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p className="px-8 pb-8 text-sm text-muted-foreground">
          No products match this filter.
        </p>
      )}
    </>
  );
}
