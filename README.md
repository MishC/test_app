`bun run dev`
will run frontend and backend on this Next JS app

## About

This application is a store administration platform. Store admins can sign in,
manage their store, add products, view the public store page, and test the
purchase flow from the storefront.

| Area | Purpose |
| --- | --- |
| Dashboard `/` | Home page for authenticated admins. Shows sales analytics, revenue, sales count, product count, and recent sales chart data. |
| Products `/products` | Admin product management. Store admins can view products, add new products, and edit existing products. |
| Store page `/[username]` | Public storefront for a store. Users can browse products published by the store admin. |
| Product purchase page `/[username]/[productId]` | Public product detail and checkout entry point. Users can buy products from the store. |
| Library `/library` | Authenticated customer library. Products bought by the current user are shown here after purchase. |
| Sales `/sales` | Admin sales table. Shows users/customers who bought products, including customer details, product name, sale date, status, and price. |
| Settings `/settings` | Admin settings area for profile/store configuration and connected keys. |

# Convex API backend functions/HOOKS:

Start with convex in your project: https://docs.convex.dev/quickstart/nextjs

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

## Custom Query List

This project uses `customQuery` from `convex-helpers` to create one protected
query wrapper: `queryWithUser`.

| Custom query | Defined in | What it adds | Use it when |
| --- | --- | --- | --- |
| `queryWithUser` | `convex/utils.ts` | Requires an authenticated Clerk user and adds `ctx.clerkId` to the handler. | The query reads data for the current logged-in user, like dashboard, sales, products, library, or settings. |

Queries currently built with `queryWithUser`:

| Query | File | Purpose |
| --- | --- | --- |
| `getCurrentUser` | `convex/utils.ts` | Returns the current authenticated user's Convex user record. |
| `getUser` | `convex/users.ts` | Returns the current user's profile/settings data. |
| `getProduct` | `convex/products.ts` | Returns one product only if it belongs to the current user. |
| `getProducts` | `convex/products.ts` | Returns products owned by the current user, including sales and revenue metadata. |
| `getDashboardData` | `convex/sales.ts` | Returns dashboard stats and chart sales data for the current store/admin user. |
| `getDashboardStats` | `convex/sales.ts` | Returns total revenue, total sales, and total products for the current user. |
| `getDashboardSales` | `convex/sales.ts` | Returns recent sales chart data for the current user. |
| `getAllSales` | `convex/sales.ts` | Returns all sales for the current store/admin user, including customer and product metadata. |
| `getLibraryProducts` | `convex/library.ts` | Returns products bought by the current user. |
| `getLibraryProduct` | `convex/library.ts` | Returns a purchased product only if the current user bought it. |

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

## Admin Roles

Admin access is manually controlled with the `ADMIN_EMAILS` Convex environment
variable. There is no automatic role sync. When a Clerk user is created, the
Clerk webhook calls `convex/users.ts:createUser`; Convex checks the user's email
against `ADMIN_EMAILS` and stores the role in `users.role`.

Set `ADMIN_EMAILS` in Convex environment variables:

```txt
ADMIN_EMAILS=johndoe@gmail.com,another-admin@example.com
```

Rules:

- If the new user's email is in `ADMIN_EMAILS`, Convex creates the user with
  `role: "admin"`.
- If the email is not in `ADMIN_EMAILS`, Convex creates the user with
  `role: "customer"`.
- Changing `ADMIN_EMAILS` affects future user creation only. Existing users must
  be updated manually in the Convex dashboard or with a one-off admin mutation.
- Frontend redirects use `api.users.isAdmin` / `api.users.getPostAuthRedirect`,
  but protected backend functions must still check admin access in Convex.

## TODO: Admin Invitations

Future improvement: create a separate admin table and invite flow for managing
admins from inside the app.

Possible model:

```ts
admins: defineTable({
  userId: v.id("users"),
  invitedByUserId: v.id("users"),
  email: v.string(),
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_email", ["email"])
```

Goal:

- Existing admins can invite another user/email to become an admin.
- Only a current admin can create an admin invitation.
- Convex checks admin access server-side before creating the invitation.
- After the invited user signs up, Convex can match their email and grant admin
  access.
- This is not needed yet because the current app stores admin access directly in
  `users.role`, but it is useful when admin management needs to happen through
  the UI instead of manual env variables or manual dashboard edits.
