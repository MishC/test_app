import { getAuthToken } from "@/lib/getAuthToken";
import { ContentLayout } from "../../content-layout";
import { fetchQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Props={
    params:Promise<{productId:string}>
}

export default async function LibraryProduct({params}:Props){
    const { productId } = await params;
    const token= await getAuthToken();
    if (!token){
        redirect("/sign-in");
    }
    const product= await fetchQuery(api.library.getLibraryProduct,{productId:productId as Id<"products">},{token})
     if (!product){
        notFound()
     }
    return(
        <ContentLayout title={product.name} description={product.description}>
            <div className="prose">
                <div dangerouslySetInnerHTML={{__html:product.content}}/>
            </div>
            </ContentLayout>
    )

}
