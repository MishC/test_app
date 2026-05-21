import { getAuthToken } from "@/lib/getAuthToken";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ContentLayout } from "../../../content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
type Props={
    params:{productId:string;}
}
export default async function Page({params}:Props){
    const token = await getAuthToken();
    if (token) {
    const user= await fetchQuery(api.products.getProduct,{productId:params.productId},{token});}
    else {const user=""}
    return (
      <ContentLayout
      title="Edit Product"
      description="Edit your product and update its details"
       action={
        <Link href="/products/new">
          <Button className="px-5 py-5">New Product</Button>
        </Link>
      }>
    <p></p>
    </ContentLayout>
    )
}
