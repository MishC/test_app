import type { Metadata } from "next";
import { ContentLayout } from "../content-layout";
import  Link  from "next/link";
import { Button } from "@/components/ui/button";
import { NewProductForm } from "./new/new-product-form";
export const metadata: Metadata = {
    title: "Products",
    description: "This is the products page."
}
export  default function ProductsPage() {
    return (
        <ContentLayout title="Products" description="Manage products in your store." action={<Link href="/products/new">
            <Button className="px-5 py-5">New Product</Button></Link>}>
            <p><NewProductForm/></p>
        </ContentLayout>
    )
}