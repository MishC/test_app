"use node"
import Stripe from "stripe"
import { action } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server"
const domain=process.env.HOSTING_URL ?? "http://localhost:3000";
const MINIMUM_PRODUCT_PRICE_USD = 0.5;

export const pay = action({
    args: {
        storeClerkId: v.string(),
        customerClerkId: v.string(),
        productId: v.id("products")
    },
    handler: async ({ runQuery }:ActionCtx,
     { storeClerkId, customerClerkId, productId }):Promise<string|null>=> {
        const product = await runQuery(internal.stripe_utils.getProduct, { productId });
        const store = await runQuery(internal.stripe_utils.getStore, { storeClerkId });
        const storeStripeKey = await runQuery(internal.stripe_utils.getStoreStripeKey, { storeClerkId })
        if (!product){
            throw new Error("Product not found")
        }
        if (!store?.username) {
            throw new Error("Store not found")
        }
        if (!storeStripeKey){
            throw new Error("Store doesn't have a stripe key!")
        }
        if (product.price < MINIMUM_PRODUCT_PRICE_USD) {
            throw new Error("This product is below Stripe's minimum checkout amount of $0.50.")
        }

        const stripe: Stripe = new Stripe(storeStripeKey);

//From Stripe API
       const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
            line_items:[
                {price_data:{
                    currency: product.currency ?? "USD", //change currency
                    product_data:{
                        name:product.name,
                        description: product.description,
                        images:product.coverImage?[product.coverImage]:[],
                    },
                    unit_amount:Math.round(product.price*100),
                }, quantity:1}
            ],
            metadata: {
                storeClerkId,
                customerClerkId,
                productId,
            },
            mode:"payment",
            success_url:`${domain}/library`,
            cancel_url:`${domain}/${store.username}/${product._id}`
        })
  return session.url;
    },
});
