"use node";

import Stripe from "stripe";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";

const MINIMUM_PRODUCT_PRICE_USD = 0.5;

type PayArgs = {
  storeClerkId: string;
  customerClerkId: string;
  productId: Id<"products">;
};

type FulfillResult =
  | { success: true }
  | { success: false; error: string };

export const pay = action({
  args: {
    storeClerkId: v.string(),
    customerClerkId: v.string(),
    productId: v.id("products"),
  },
  handler: async (
    { runQuery }: ActionCtx,
    { storeClerkId, customerClerkId, productId }: PayArgs,
  ): Promise<string | null> => {
    const domain = process.env.HOST_URL ?? process.env.HOSTING_URL;
    if (!domain) {
      throw new Error("Missing HOST_URL");
    }

    const product = await runQuery(internal.stripe_utils.getProduct, { productId });
    const store = await runQuery(internal.stripe_utils.getStore, { storeClerkId });
    const storeStripeKey = await runQuery(internal.stripe_utils.getStoreStripeKey, {
      storeClerkId,
    });

    if (!product) {
      throw new Error("Product not found");
    }
    if (!store?.username) {
      throw new Error("Store not found");
    }
    if (!storeStripeKey) {
      throw new Error("Store doesn't have a Stripe key");
    }
    if (product.price < MINIMUM_PRODUCT_PRICE_USD) {
      throw new Error("This product is below Stripe's minimum checkout amount of $0.50.");
    }

    const stripe = new Stripe(storeStripeKey);
    const currency = product.currency ?? "USD";

    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: product.name,
              description: product.description,
              images: product.coverImage ? [product.coverImage] : [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        storeClerkId,
        customerClerkId,
        productId,
        price: String(product.price),
        currency,
      },
      mode: "payment",
      success_url: `${domain}/library`,
      cancel_url: `${domain}/${store.username}/${product._id}`,
    });

    return session.url;
  },
});

export const fulfill = internalAction({
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, { payload, signature }): Promise<FulfillResult> => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    try {
      const event = Stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (
          !metadata?.storeClerkId ||
          !metadata.customerClerkId ||
          !metadata.productId ||
          !metadata.price ||
          !metadata.currency
        ) {
          throw new Error("Missing checkout session metadata");
        }

        await ctx.runMutation(internal.stripe_utils.fulfillPurchase, {
          storeClerkId: metadata.storeClerkId,
          customerClerkId: metadata.customerClerkId,
          productId: metadata.productId as Id<"products">,
          price: Number(metadata.price),
          currency: metadata.currency,
        });
      }

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Stripe webhook error";
      console.error("Stripe webhook failed", message);
      return { success: false, error: message };
    }
  },
});
