import { Auth } from "convex/server";
import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { action, DatabaseReader, mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const getUserByUsername = async (
  db: DatabaseReader,
  username: string
) => {
  return await db
    .query("users")
    .withIndex("by_username", (q) => q.eq("username", username))
    .first();
};


export async function getClerkIdOrNull(ctx: { auth: Auth }) {
  const authInfo = await ctx.auth.getUserIdentity();

  if (!authInfo?.subject) {
    return null;
  }

  return authInfo.subject;
}

async function getClerkId(ctx: { auth: Auth }) {
  const clerkId = await getClerkIdOrNull(ctx);

  if (!clerkId) {
    throw new ConvexError("Not authenticated");
  }

  return clerkId;
}

export const queryWithUser = customQuery(
  query,
  customCtx(async (ctx) => {
    return {
      clerkId: await getClerkId(ctx),
    };
  })
);

export const mutationWithUser = customMutation(
  mutation,
  customCtx(async (ctx) => {
    return {
      clerkId: await getClerkId(ctx),
    };
  })
);

export const actionWithUser = customAction(
  action,
  customCtx(async (ctx) => {
    return {
      clerkId: await getClerkId(ctx),
    };
  })
);

export const getCurrentUser = queryWithUser({
  args: {},
  handler: async (ctx) => {
    return await getUserByClerkId(ctx.db, ctx.clerkId);
  },
});

export const getUserByClerkId = async (
  db: DatabaseReader,
  clerkId: string
) => {
  const user= await db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .first();
    const key= await getKeyByClerkId(db, clerkId);
    const hasStripeKey=!!key?.stripeKey;
    if (!user) {
      return null;
    }
    return {...user, hasStripeKey};
};

export const getUserByEmail = async (
  db: DatabaseReader,
  email: string
) => {
  return await db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();
};

export const getProductsByClerkId = async (
  db: DatabaseReader,
  clerkId: string
) => {
  return await db
    .query("products")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .collect();
};

export const getSalesByStoreClerkId = async (
  db: DatabaseReader,
  clerkId: string
) => {
  return await db
    .query("sales")
    .withIndex("by_storeClerkId", (q) => q.eq("storeClerkId", clerkId))
    .collect();
};

export const getSalesByCustomerClerkId = async (
  db: DatabaseReader,
  clerkId: string
) => {
  return await db
    .query("sales")
    .withIndex("by_customerClerkId", (q) => q.eq("customerClerkId", clerkId))
    .collect();
};

export const getSalesByProductId = async (
  db: DatabaseReader,
  productId: Id<"products">
) => {
  return await db
    .query("sales")
    .withIndex("by_productId", (q) => q.eq("productId", productId))
    .collect();
};

export const getKeyByClerkId = async (
  db: DatabaseReader,
  clerkId: string
) => {
  return await db
    .query("keys")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .first();
};
