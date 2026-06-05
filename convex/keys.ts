import {
  queryWithUser,
  mutationWithUser,
  getKeyByClerkId,
  requireAdmin,
} from "./utils";
import { v } from "convex/values";

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
