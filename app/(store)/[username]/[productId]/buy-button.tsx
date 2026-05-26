"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";

type Props = {
  product: Doc<"products"> & { user: Doc<"users"> | null };
};

export function BuyButton({ product }: Props) {
  const pay = useAction(api.stripe.pay);
  const { isLoaded, user } = useUser();

  async function handleBuy() {
    if (!user?.id || !product.user?.clerkId) {
      return;
    }

    try {
      const url = await pay({
        storeClerkId: product.user.clerkId,
        customerClerkId: user.id,
        productId: product._id,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not start checkout";
      toast.error(message);
    }
  }

  if (isLoaded && !user) {
    return (
      <SignInButton>
        <Button>Sign in to buy</Button>
      </SignInButton>
    );
  }

  return (
    <Button onClick={handleBuy} disabled={!isLoaded || !product.user}>
      Buy now
    </Button>
  );
}
