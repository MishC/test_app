"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";


type Props = {
  product: Doc<"products"> & {
    user: (Doc<"users"> & { hasStripeKey: boolean }) | null;
  };
};

export function BuyButton({ product }: Props) {
  const [isLoading, setLoading]=useState(false);  
  const pay = useAction(api.stripe.pay);
  const { isLoaded, user } = useUser();

  async function handleBuy() {
    if (!user?.id || !product.user?.clerkId) {
      return;
    }

    try {
        setLoading(true);
      const url = await pay({
        storeClerkId: product.user.clerkId,
        customerClerkId: user.id,
        productId: product._id,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
        setLoading(false);
      const message =
        error instanceof Error ? error.message : "Could not start checkout";
      toast.error(message,{position:"bottom-right"});

    }
  }

  if (!product.published) {
    return <Button disabled>Unpublished</Button>;
  }

  if (isLoaded && !user) {
    return (
      <SignInButton>
        <Button>Sign in to buy</Button>
      </SignInButton>
    );
  }

  return (
    <Button onClick={handleBuy} disabled={!isLoaded || !product.user?.hasStripeKey}>
        {!isLoaded&&<LoaderCircle className="size-4 mr-2 animate-spin"/>}
      Buy now
    </Button>
  );
}
