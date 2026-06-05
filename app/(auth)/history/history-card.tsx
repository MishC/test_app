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
import { Badge } from "@/components/ui/badge";
import { Doc } from "@/convex/_generated/dataModel";
import { formatPrice } from "@/lib/formatPrice";
import Link from "next/link";
import { StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  product: Doc<"products">;
  store: Doc<"users">;
};
export function HistoryCard({product, store}:Props){
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

        <CardAction>
          <Badge variant={product.published ? "default" : "outline"}>
            {product.published ? "Published" : "Draft"}
          </Badge>
        </CardAction>
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
          <Link href={`/history/${product._id}`}>Description</Link>
        </Button>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
    

        <Link
          href={`/${store.username}`}
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          Visit store
        </Link>
      </CardFooter>
    </Card>)
}
