import type { Metadata } from "next";
import { ContentLayout } from "../content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import  ProductTable  from "./products-table";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

export const metadata: Metadata = {
  title: "Products",
  description: "This is the products page.",
};


export default async function ProductsPage() {
// 1. Fetch all the data about product

  const token = await getAuthToken();

   if (!token) {
     redirect("/sign-in");
   }
  const postAuthRedirect = await fetchQuery(api.users.getPostAuthRedirect, {}, { token });
  if (!postAuthRedirect?.isAdmin) {
    redirect(postAuthRedirect?.redirectTo ?? "/settings");
  }

  const products=await fetchQuery(api.products.getProducts,{},{token})

  return (
    <ContentLayout
      title="Products"
      description="Manage products in your store."
      action={
        <Link href="/products/new">
          <Button className="px-5 py-5">New Product</Button>
        </Link>
      }
    >
     {products? <ProductTable products={products}/>:<span></span>}
         </ContentLayout>
  );
}
