import { internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { generateUsername } from "friendly-username-generator";
import { getUserByClerkId, mutationWithUser, queryWithUser } from "./utils";

export const getUser = queryWithUser({
  args: {},
  handler: (ctx) => { 
    return getUserByClerkId(ctx.db, ctx.clerkId!);
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
});

export const updateUser = mutationWithUser({
  args: { //all fields are optional, we only update the ones that are provided
    userId:v.id('users'),
    name: v.optional(v.string()),
    about: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  // email and cler_id are indexes in user table, so we can easily check if 
  // the new username is already taken by another user, by querying the users table with the by_email index and filtering out the current user with the clerkId from the auth context
  handler: async (ctx, { name, about, username }) => {
    const isUsernameTaken = await ctx.db.query("users").withIndex('by_username', q=> q.eq("username", username!)).
    filter(q=>q.neq(q.field('clerkId'), ctx.clerkId!)).first();
    if (isUsernameTaken) {
      throw new ConvexError("USERNAME_TAKEN");

    }
    const user = await getUserByClerkId(ctx.db, ctx.clerkId!);
    if (!user) {
      throw new ConvexError("User not found");
    }
    await ctx.db.patch(user._id, { name, about, username }); //update the user with the new values
  }  
}); 
  
  export const updateUserLogo= mutationWithUser({
    args: {
      userId: v.id('users'),
      logo: v.string()
    },
    handler: async (ctx, { userId, logo }) => 
      {
      const user = await getUserByClerkId(ctx.db, ctx.clerkId!);
      if (!user) {
        throw new ConvexError("User not found");
      }
      await ctx.db.patch(userId, { logo });
    }
  });
