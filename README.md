`bun run dev`
will run frontend and backend on this Next JS app

# Convex API backend functions/HOOKS:
db: schema.ts
GET:Query: customQuery({args:{}, handler:async(ctx, args)=>{}})
POST,PUSH:Mutations: internalMutation({args:{}, handler:async(ctx, args)=>{await ctx.db.insert("table", {});}})

## Convex `query` vs `queryWithUser`

Use Convex `query` when the function can be public or does not need the logged-in
user. A plain `query` gets the normal Convex context, like `ctx.db`, but it does
not automatically require authentication.

Example:

```ts
import { query } from "./_generated/server";

export const getStorePage = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").take(20);
  },
});
```

Use this app's `queryWithUser` when the function should only run for a logged-in
user or when the data belongs to the current user. `queryWithUser` is defined in
`convex/utils.ts`. It wraps Convex `query`, checks auth, and adds `ctx.clerkId`
to the handler. If the user is not authenticated, it throws `Not authenticated`.

Example:

```ts
import { queryWithUser } from "./utils";

export const getProducts = queryWithUser({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", ctx.clerkId))
      .collect();
  },
});
```

Rule of thumb:

- Use `query` for public reads, store pages, product pages, or data that anyone
  is allowed to view.
- Use `queryWithUser` for dashboard, sales, library, settings, and any read that
  must be scoped to the current logged-in user.
- Do not pass `userId` or `clerkId` from the frontend for authorization. Get the
  identity inside Convex through auth, or use `queryWithUser` so the server owns
  the user check.

# Clerk: authentication
## Clerk backend

# Clerk&Convex sync via Clerk's webhooks with events

Links:


