import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { generateUsername } from "friendly-username-generator";

export const getUsers = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const users = await ctx.db.get(userId);
    return users;
  }
})

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
