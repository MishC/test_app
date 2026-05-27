import { ConvexError, v } from "convex/values";
import {
  getSalesByCustomerClerkId,
  getUserByClerkId,
  queryWithUser,
} from "./utils";

export const getLibraryProducts = queryWithUser({
  args: {},
  handler: async (ctx) => {
    const sales = await getSalesByCustomerClerkId(ctx.db, ctx.clerkId);

    const libraryProducts = await Promise.all(
      sales.map(async (sale) => {
        const product = await ctx.db.get(sale.productId);
        if (!product) {
          return null;
        }

        const store = await getUserByClerkId(ctx.db, product.clerkId);
        if (!store) {
          return null;
        }

        return { product, store };
      }),
    );

    return libraryProducts.filter((item) => item !== null);
  },
});

export const getLibraryProduct=queryWithUser({
    args:{productId:v.id("products")},
    handler: async(ctx,{productId})=>{
        const product = await ctx.db.get(productId);
        if (!product) {
            throw new ConvexError("Product not found");
        }
        //product._id===productId

        const sales=await getSalesByCustomerClerkId(ctx.db,ctx.clerkId);
        const hasPurchasedProduct=sales.find((sale)=>sale.productId===productId);
        if (!hasPurchasedProduct){
            throw new ConvexError("Unauthorized");
        }
        return product;
    }
})
