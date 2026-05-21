import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ContentLayout } from "../../../content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditProductForm } from "./edit-product-form";
import { redirect } from "next/navigation";

type Props = {
  params: {
    productId: string;
  };
};

export default async function Page({ params }: Props) {
  const { productId } = await params;

  const token = await getAuthToken();

  if (!token) {
    redirect("/sign-in");
  }

  const product = await fetchQuery(
    api.products.getProduct,
    { productId },
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
      {product ? <EditProductForm product={product} /> : null}
    </ContentLayout>
  );
}