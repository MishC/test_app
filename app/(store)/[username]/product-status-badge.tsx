"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Props = {
  productId: Id<"products">;
  published: boolean;
};

export function ProductStatusBadge({ productId, published }: Props) {
  const router = useRouter();
  const setProductPublished = useMutation(api.products.setProductPublished);
  const [isPublished, setIsPublished] = useState(published);
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggle() {
    const nextPublished = !isPublished;

    setIsPublished(nextPublished);
    setIsSaving(true);

    try {
      await setProductPublished({
        productId,
        published: nextPublished,
      });
      toast.success(nextPublished ? "Product published" : "Product unpublished");
      router.refresh();
    } catch (error) {
      setIsPublished(!nextPublished);
      const message =
        error instanceof Error ? error.message : "Could not update product";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Badge
      asChild
      variant={isPublished ? "default" : "outline"}
      className="cursor-pointer disabled:cursor-wait disabled:opacity-70"
    >
      <button
        type="button"
        disabled={isSaving}
        onClick={handleToggle}
        title={isPublished ? "Click to unpublish" : "Click to publish"}
        aria-label={isPublished ? "Unpublish product" : "Publish product"}
      >
        {isPublished ? "Published" : "Unpublished"}
      </button>
    </Badge>
  );
}
