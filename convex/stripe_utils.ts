//For RunQueries

import { v } from "convex/values";
import { getKeyByClerkId, getUserByClerkId } from "./utils";
import { internalMutation, internalQuery } from "./_generated/server";

export const getStoreStripeKey= internalQuery({
    args:{
        storeClerkId:v.string(),
    },

    handler: async(ctx,{storeClerkId}) => {
        const key = await getKeyByClerkId(ctx.db, storeClerkId);
        return key?.stripeKey;
    
},
});

export const getStore= internalQuery({
    args:{storeClerkId:v.string(),},

    handler: (ctx,{storeClerkId}) => {
        return getUserByClerkId(ctx.db,storeClerkId)
    
},
})

export const getProduct= internalQuery({
    args:{productId:v.id("products")

    },

    handler: (ctx,{productId}) => {
        return ctx.db.get(productId);
    
},
})

export const fulfillPurchase=internalMutation({
    args:{
        stripeSessionId:v.string(),
        storeClerkId:v.string(),
        customerClerkId: v.string(),
        productId:v.id("products"),
        price:v.number(),
        currency:v.string(),


    },
    handler:async(ctx, args)=>{
        const existingSale = await ctx.db
            .query("sales")
            .withIndex("by_stripeSessionId", (q) =>
                q.eq("stripeSessionId", args.stripeSessionId)
            )
            .first();

        if (existingSale) {
            return existingSale._id;
        }

        const product = await ctx.db.get(args.productId);

        if (!product) {
            throw new Error("Product not found");
        }

        await ctx.db.patch(args.productId, {
            amount: Math.max((product.amount ?? 0) - 1, 0),
        });

        return await ctx.db.insert("sales",{...args})
    }
})
