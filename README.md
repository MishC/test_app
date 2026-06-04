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

Clerk sends webhook events to Convex when something happens in Clerk, for
example when a user signs up. In this project, the Convex HTTP route is:

```ts
// convex/http.ts
http.route({
  path: "/clerk",
  method: "POST",
  handler: onCreateUser,
});
```

The handler lives in `convex/clerk.ts`. It receives the Clerk event, verifies it
with `CLERK_WEBHOOK_SECRET`, reads `event.data`, and then calls an internal
Convex mutation.

Example from this app:

```ts
// convex/clerk.ts
export const onCreateUser = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  const data = event.data as UserJSON;

  await ctx.runMutation(internal.users.createUser, {
    clerkId: data.id,
    username: data.username || "",
    email: data.email_addresses[0].email_address,
    name: `${data.first_name} ${data.last_name}`,
    about: "",
    logo: data.image_url,
  });

  return new Response(null, { status: 200 });
});
```

That means Clerk sends user data like:

- `data.id` -> saved as `clerkId`
- `data.username` -> saved as `username`
- `data.email_addresses[0].email_address` -> saved as `email`
- `data.first_name` and `data.last_name` -> combined into `name`
- `data.image_url` -> saved as `logo`

The actual database write happens in `convex/users.ts`:

```ts
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
    return await ctx.db.insert("users", {
      clerkId,
      username: username || generateUsername(),
      email,
      name,
      about,
      logo,
    });
  },
});
```

Use this webhook flow when Clerk owns the event and Convex needs to sync its
database. For example, after a Clerk `user.created` event, Convex creates a row
in the `users` table so the rest of the app can query user profile data by
`clerkId`.

Use `queryWithUser` or `mutationWithUser` for normal logged-in app actions.
Use Clerk webhooks for background sync from Clerk to Convex.

Links:

