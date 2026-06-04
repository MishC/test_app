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

## Server side Clerk authentication

# Clerk&Convex sync via Clerk's webhooks with events 

Clerk webhooks are used when Clerk owns the event and Convex needs to sync its
database. Normal app actions should use `queryWithUser` or `mutationWithUser`;
webhooks are for background sync from Clerk to Convex.

| Clerk event | Convex webhook route | Convex handler | `ctx.runMutation` call | Convex mutation | Purpose |
| --- | --- | --- | --- | --- | --- |
| User is created in Clerk, for example after sign up | `POST /clerk` in `convex/http.ts` | `onCreateUser` in `convex/clerk.ts` | `ctx.runMutation(internal.users.createUser, {...})` | `createUser` in `convex/users.ts` | Creates a matching row in the Convex `users` table so the app can find profile data by `clerkId`. |

Data mapping from Clerk to Convex:

| Clerk data | Convex `users` field | Purpose |
| --- | --- | --- |
| `data.id` | `clerkId` | Stable Clerk user id used to connect auth identity with Convex data. |
| `data.username` | `username` | Public/store username. If missing, Convex generates one in `createUser`. |
| `data.email_addresses[0].email_address` | `email` | User email saved for profile/settings lookup. |
| `data.first_name` + `data.last_name` | `name` | Display name. |
| `data.image_url` | `logo` | Profile/store image. |

Flow:

```txt
Clerk user.created event
-> POST /clerk
-> convex/clerk.ts:onCreateUser
-> ctx.runMutation(internal.users.createUser, {...})
-> convex/users.ts:createUser
-> ctx.db.insert("users", {...})
```

`internalMutation` in this flow:

| Concept | Meaning |
| --- | --- |
| `internalMutation` | A private Convex mutation. It is server-side only and cannot be called directly from the frontend. |
| Where it comes from | Import it from `convex/_generated/server`, usually as `import { internalMutation } from "./_generated/server";`. The generated `server.js` / `server.d.ts` files expose Convex builders like `query`, `mutation`, `internalMutation`, and `httpAction`. |
| Generated internal reference | When you export `createUser` as an `internalMutation` from `convex/users.ts`, Convex generates the callable reference `internal.users.createUser`. |
| `ctx.runMutation(...)` | This is how one Convex server-side function calls a mutation from another Convex server-side function. The call must use a generated function reference like `internal.users.createUser`. |
| Clerk example | `ctx.runMutation(internal.users.createUser, {...})` is only one example. Here, `convex/clerk.ts` receives and verifies the Clerk webhook, then calls the private `createUser` mutation to write to the DB. |
| When to use it | Use it for trusted server-side work that should not be public, like writing a user row after a verified Clerk webhook, syncing Stripe webhook data, or other backend-to-DB writes. |
| Direct DB write | The actual write is still done inside the mutation handler with `ctx.db.insert`, `ctx.db.patch`, or `ctx.db.delete`. |

Important files:

| File | What it does |
| --- | --- |
| `convex/http.ts` | Registers the HTTP webhook route: `POST /clerk`. |
| `convex/clerk.ts` | Verifies the Clerk webhook with `CLERK_WEBHOOK_SECRET` and sends user data to Convex. |
| `convex/users.ts` | Defines `createUser`, the internal mutation that writes to the `users` table. |
| `convex/schema.ts` | Defines the `users` table and indexes like `by_clerkId`, `by_email`, and `by_username`. |

Links:
