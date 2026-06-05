import { CustomImage } from "@/components/ui/custom-image";
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { getAuthToken } from "@/lib/getAuthToken";
import { StoreIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "./product-card";
import Link from "next/link";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function StorePage({ params }: Props) {
  const { username } = await params;
  const token = await getAuthToken();

  const { store, products, canManageStore } = await fetchQuery(
    api.products.getStorePage,
    { username },
    token ? { token } : undefined
  );

  if (!store) {
    notFound();
  }
    return (
        <div className="StoraPage">
            <header className="p-8 bg-zinc-200 flex items-center justify-between border-b  border-zinc-300 ">
<div className="flex items-center gap-3 max-w-30 rounded-full object-cover">
  <Link href="/" >
  <CustomImage
    src="public/cart3.png"
    width={60}
    height={60}
    size="medium"
    alt={store.name ?? "Store logo"}
    
  /></Link>
</div>

<div className="flex items-center gap-3">
    <StoreIcon/>
    <span className="font-semibold">{products.length} Product{products.length===1?"":"s"}</span>
</div>
            </header>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-3 p-8">
                {products.map(product=>(<ProductCard key={product._id} store={store} product={product} showStatus={canManageStore && product.clerkId === store.clerkId}/>))}
            </div>
        </div>
        
    )
}
