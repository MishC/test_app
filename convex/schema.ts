import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";

export default defineSchema({

  users: defineTable({
    clerkId: v.string(),
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    about: v.optional(v.string()),
    logo: v.optional(v.string()),

  }).index("by_clerkId", ["clerkId"],).index("by_email", ["email"]),
  products: defineTable({
    clerkId: v.string(),
    name: v.string(),
    description: v.string(),
    content: v.string(),
    price: v.number(),
    currency: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    published: v.boolean(),

  }).index("by_clerkId", ["clerkId"],),

  sales: defineTable({
    storeClerkId: v.string(),

    customerClerkId: v.string(),
    productId: v.string(),
    price: v.number(),
    currency: v.optional(v.string()),
  }).index("by_storeClerkId", ["storeClerkId"]).index("by_customerClerkId", ["customerClerkId"]).index("by_productId", ["productId"]),
  keys: defineTable({
    clerkId: v.string(),
    stripeKey: v.string(),
  }).index("by_clerkId", ["clerkId"]),
});
