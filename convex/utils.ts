import { Auth } from "convex/server";
import {customAction, customCtx,  customMutation, customQuery} from "convex-helpers/server/customFunctions";
import { action, mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

async function getUserId(ctx: {auth:Auth}) {
 const authInfo = await ctx.auth.getUserIdentity();
 return authInfo?.subject;
    }
export const queryWithUser=customQuery(
    query,
    customCtx(async (ctx) => {
        return{
   userId: await getUserId(ctx)
        };
    })
);

export const mutationWithUser=customMutation(
    mutation,
    customCtx(async (ctx) => {
        const userId= await getUserId(ctx);
        if (!userId) {
            throw new ConvexError(`Unauthorized. You must be logged in to perform this action.`);}
        return{ userId};
    })
);


export const actionWithUser=customAction(
    action,
    customCtx(async (ctx) => {
        const userId= await getUserId(ctx);
        if (!userId) {
            throw new ConvexError(`Unauthorized. You must be logged in to perform this action.`);}
        return{ userId};
    })
);