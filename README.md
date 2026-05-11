`bun run dev`
will run frontend and backend on this Next JS app

# Convex API backend functions/HOOKS:
db: schema.ts
Query: customQuery({args:{}, handler:async(ctx, args)=>{}})
Mutations: internalMutation({args:{}, handler:async(ctx, args)=>{await ctx.db.insert("table", {});}})

# Clerk: authentication
## Clerk backend

# Clerk&Convex sync via Clerk's webhooks with events

Links:



