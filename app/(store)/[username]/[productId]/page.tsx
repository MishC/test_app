import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButton } from "./buy-button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { formatPrice } from "@/lib/formatPrice";

type Props = {
  params: Promise<{
    username: string;
    productId: string;
    product:Doc<"products">
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
  const { userId } = await auth();
return (
  <div>
    <div className="flex justify-center w-full sm:p-12 items-center ">
        <div className="w-full max-w-3xl border border-zinc-300 shadow-md overflow-hidden sm:rounded-lg">
{product.coverImage?
<img src={product.coverImage} alt="" className="mb-2 h-48 w-full shadow object-contain" />
:<div className="mb-2 h-48 bg-zinc-200"></div>}
      
    <div className="flex justify-between p-4 items-center">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
       <div className="flex items-center">
        <img src={product.user?.logo} alt="" className="rounded-full size-6 border-black border shadow-sm"/>
       <Button asChild variant="link"><Link href={`/${product.user?.username}`}>{product.user?.username}</Link></Button>
       </div>
</div>

{userId?
       (<BuyButton product={product} />)
       :
        (<SignInButton>
       <Button>Sign in to buy</Button>
       </SignInButton>)    
   
        }
                </div>

       
        <br/>
     <div className="text-sm font-medium sm:divide-y-0 border-zinc-300 grid sm:divide-x 
    sm:grid-cols-2  divide-zinc-300 border-y">
      <span className="flex items-center sm:justify-center px-4 py-2">
        {formatPrice({price: product.price} )}
      </span>
      <span className="flex items-center sm:justify-center px-4 py-2">
       {product.sales} sales
      </span>
    </div>
    <br/>
    <div className="p-4 sm:text-base text-small">{product.description}</div>
      </div>
    </div>
    </div>
)
}
