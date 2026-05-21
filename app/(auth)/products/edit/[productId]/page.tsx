import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ContentLayout } from "../../../content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditProductForm } from "./edit-product-form";
import { redirect} from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

type Props = {
  params: Promise<{
   productId: Id<"products">;
  }>;
};

export default async function Page({ params }: Props) {
  const { productId } =  await params;
  if (!productId){
    return(<div>Product doesn't exist!</div>)
  }
  const token = await getAuthToken();

  if (!token) {
    redirect("/sign-in");
  }

  const product = await fetchQuery(
    api.products.getProduct,
    { productId},
    { token }
  );



  return (
    <ContentLayout
      title="Edit Product"
      description="Edit your product and update its details"
      action={
        <Link href="/products/new">
          <Button className="px-5 py-5">New Product</Button>
        </Link>
      }
    >
      {product ? <EditProductForm product={product} /> : "Product not found"}
    </ContentLayout>
  );
}