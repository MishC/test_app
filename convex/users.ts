import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { generateUsername } from "friendly-username-generator";
import { getUserByClerkId, queryWithUser } from "./utils";

export const getUser = queryWithUser({
  args: {},
  handler: (ctx) => { 
    return getUserByClerkId(ctx.db, ctx.userId!);
  }
});
export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    about: v.optional(v.string()),
    logo: v.optional(v.string()),



  },
  handler: async (ctx, { clerkId, username, email, name, about, logo }) => {
    const userId = await ctx.db.insert("users", {
      clerkId,
      username: username || generateUsername(),
      email,
      name,
      about,
      logo
    });
    return userId;
  },
})

