import { Auth } from "convex/server";
import {customAction, customCtx,  customMutation, customQuery} from "convex-helpers/server/customFunctions";
import { action, DatabaseReader, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { get } from "http";

async function getUserId(ctx: {auth:Auth}) {
 const authInfo = await ctx.auth.getUserIdentity(); //here is the token->user id from the token!!
 return authInfo?.subject;
    }
// Helper function to get the current user based on the auth context
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

queryWithUser({
    args:{
        clerkId:v.string()}, 
handler: async (ctx,args)=>{
    const user= await getUserByClerkId(ctx.db, args.clerkId);
    return user;
},
});


export const getUserByClerkId= async(db:DatabaseReader, clerkId:string)=>{
    const user= await db.query('users')
    .withIndex('by_clerkId', (q)=>q.eq('clerkId', clerkId))
    .first();
    return user;
}


export const getUserByEmail= async(db:DatabaseReader, email:string)=>{
    const user= await db.query('users')
    .withIndex('by_email', (q)=>q.eq('email', email))
    .first();
    return user;
}

export const getProductsByClerkId= async(db:DatabaseReader, clerkId:string)=>{
    const products= await db.query('products')
    .withIndex('by_clerkId', (q)=>q.eq('clerkId', clerkId))
    .collect();
    return products;
}   

export const getSalesByStoreClerkId= async(db:DatabaseReader, clerkId:string)=>{
    const sales= await db.query('sales')
    .withIndex('by_storeClerkId', (q)=>q.eq('storeClerkId', clerkId))
    .collect();
    return sales;
}

export const getSalesByCustomerClerkId= async(db:DatabaseReader, clerkId:string)=>{
    const sales= await db.query('sales')
    .withIndex('by_customerClerkId', (q)=>q.eq('customerClerkId', clerkId))
    .collect();
    return sales;
}

export const getSalesByProductId= async(db:DatabaseReader, productId:string)=>{
    const sales= await db.query('sales')
    .withIndex('by_productId', (q)=>q.eq('productId', productId))
    .collect();
    return sales;
}



export const getKeyByClerkId= async(db:DatabaseReader, clerkId:string)=>{
    const key= await db.query('keys')
    .withIndex('by_clerkId', (q)=>q.eq('clerkId', clerkId))
    .first();
    return key;
}