import { ContentLayout } from "../../content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewProductForm, ProductForm } from "./new-product-form";

export default function NewProductPage() {
  return (
    <ContentLayout
      title="New Product"
      description="Add a new product."
      action={
        <Link href="../products">
          <Button className="px-5 py-5">Products</Button>
        </Link>
      }
    >
      <div>
        {" "}
     
          <ProductForm />
        
      </div>
    </ContentLayout>
  );
}
