import { GenericDatabaseReader } from "convex/server";
import { GenericId } from "convex/values";
import { getSalesByStoreClerkId, getProductsByClerkId, queryWithUser } from "./utils";
import {formatPrice} from "../lib/formatPrice"

export  const getDashboardStats=queryWithUser({
    args:{},
handler:async(ctx)=>{
    const sales= await getSalesByStoreClerkId(ctx.db, ctx.clerkId!);
    const products=await getProductsByClerkId(ctx.db,ctx.clerkId);

    const revenue= sales?.reduce((acc,sale)=>acc+sale.price,0);
    const formattedRevenue=formatPrice({price:revenue});
    return {totalRevenue:formattedRevenue, totalSales:sales.length, totalProducts:products.length,}

}
})




