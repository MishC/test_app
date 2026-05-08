import type { Metadata } from "next";
import { ContentLayout } from "../content-layout";
export const metadata: Metadata = {
    title: "Products",
    description: "This is the products page."
}
export  default function ProductsPage() {
    return (
        <ContentLayout title="Products" description="Manage products in your store.">
            <p>List of products will go here.</p>
        </ContentLayout>
    )
}