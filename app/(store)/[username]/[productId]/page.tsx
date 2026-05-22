import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    username: string;
    productId: string;
  }>;
};

export default async function StoreProductPage({ params }: Props) {
  const { productId } = await params;

  const product = await fetchQuery(api.products.getStoreProduct, {
    productId: productId as Id<"products">,
  });

  if (!product) {
    notFound();
  }

return (
    <div className="flex justify-center w-full sm:p-12 items-center ">
        <div className="w-full max-w-3xl border border-zinc-300 shadow-md overflow-hidden sm:rounded-lg">
{product.coverImage?
<img src={product.coverImage} alt="" className="mb-2 h-48 w-full shadow object-contain" />
:<div className="mb-2 h-48 bg-zinc-200"></div>}
      
    <div className="flex justify-between p-4 items-center">
        <h1 className="text-3xl font-semibold"></h1>
    </div>
      </div>
    </div>
)
}