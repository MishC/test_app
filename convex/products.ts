import {mutationWithUser} from "./utils";
import {v} from "convex/values";
import { queryWithUser } from "./utils";
import { Id } from "./_generated/dataModel";

export const getProduct = queryWithUser({
    args:{
        productId:v.string(),
    },
    handler:(ctx,{productId})=>{
        const product= ctx.db.get(productId as Id<'products'>)
    }
})
export const createProduct =    mutationWithUser({
    args:{ name:v.string(),
        description:v.string(),
        price:v.number(),
        coverImage:v.string(),
        content:v.string(),
        published:v.boolean()
    },
    handler: async (ctx, {name, description, price,coverImage,content,published})=>{
        await ctx.db.insert("products",{
            clerkId:ctx.userId,
            name,
            description,
            currency:"USD",
            price: Number(price.toFixed(2)),
           
            coverImage,
            content,
            published,

        })
    }
})