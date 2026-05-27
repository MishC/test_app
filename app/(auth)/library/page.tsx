import { ContentLayout } from "../content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Library() {
    return(
        <div>
            <ContentLayout
      title="Library"
      description="View all your purchased products"
      action={
        <Link href="/products/new">
          <Button className="px-5 py-5">New Product</Button>
        </Link>
      }
    >
    <ul></ul>
         </ContentLayout>
  
        </div>
    )
}
