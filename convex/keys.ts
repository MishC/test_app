import {
  queryWithUser,
  mutationWithUser,
  getKeyByClerkId,
} from "./utils";
import { v } from "convex/values";

export const getStripeSecretKey = queryWithUser({
  args: {},
  handler: async (ctx) => {
    return await getKeyByClerkId(ctx.db, ctx.clerkId);
  },
});

export const createStripeSecretKey = mutationWithUser({
  args: {
    stripeKey: v.string(),
  },
  handler: async (ctx, { stripeKey }) => {
    const existingKey = await getKeyByClerkId(ctx.db, ctx.clerkId);

    if (existingKey) {
      await ctx.db.patch(existingKey._id, { stripeKey });
      return existingKey._id;
    }

    return await ctx.db.insert("keys", {
      clerkId: ctx.clerkId,
      stripeKey,
    });
  },
});
