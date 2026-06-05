import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { formatPrice } from "@/lib/formatPrice";
import Link from "next/link";
import { Package2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductStatusBadge } from "./product-status-badge";

type Props = {
  product: Doc<"products">;
  store: Doc<"users">;
  showStatus?: boolean;
};

export function ProductCard({ product, store, showStatus = false }: Props) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3">
          <span className="line-clamp-1">{product.name}</span>
          <span className="whitespace-nowrap text-lg font-semibold">
            {formatPrice({
              price: product.price,
              currency: product.currency ?? "USD",
            })}
          </span>
        </CardTitle>

        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>

        {showStatus && (
          <CardAction>
            <ProductStatusBadge
              productId={product._id}
              published={product.published}
            />
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {product.coverImage ? (
          <img
            src={product.coverImage}
            alt={product.name}
            className={cn("h-40 rounded-md border object-contain")}
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}

        <Button asChild size="sm" className="w-full">
          <Link href={`/${store.username}/${product._id}`}>View Product</Link>
        </Button>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"></div>

        <Link
          href={`/`}
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
        >
          <Package2 className="size-4 shrink-0" />
          <span className="truncate"></span>{" "}
        </Link>
      </CardFooter>
    </Card>
  );
}
