import {
  queryWithUser,
  mutationWithUser,
  getKeyByClerkId,
  requireAdmin,
} from "./utils";
import { ConvexError, v } from "convex/values";

function normalizeStripeSecretKey(stripeKey: string) {
  return stripeKey.trim();
}

function isStripeSecretKey(stripeKey: string) {
  return stripeKey.startsWith("sk_test_") || stripeKey.startsWith("sk_live_");
}

export const getStripeSecretKey = queryWithUser({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    return await getKeyByClerkId(ctx.db, ctx.clerkId);
  },
});

export const createStripeSecretKey = mutationWithUser({
  args: {
    stripeKey: v.string(),
  },
  handler: async (ctx, { stripeKey }) => {
    await requireAdmin(ctx.db, ctx.clerkId);

    const normalizedStripeKey = normalizeStripeSecretKey(stripeKey);

    if (!isStripeSecretKey(normalizedStripeKey)) {
      throw new ConvexError(
        "Stripe secret key must start with sk_test_ or sk_live_"
      );
    }

    const existingKey = await getKeyByClerkId(ctx.db, ctx.clerkId);

    if (existingKey) {
      await ctx.db.patch(existingKey._id, { stripeKey: normalizedStripeKey });
      return existingKey._id;
    }

    return await ctx.db.insert("keys", {
      clerkId: ctx.clerkId,
      stripeKey: normalizedStripeKey,
    });
  },
});
