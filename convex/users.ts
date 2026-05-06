import {query} from "./_generated/server";
import {v} from "convex/values";

export const getUsers = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, {userId}) => {
    const users = await ctx.db.get(userId);
    return users;
  }
})
