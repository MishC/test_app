import {mutation} from "./_generated/server";
import { v } from "convex/values";
//CONVEX API FOR FILE STORAGE
export const generateUploadUrl = mutation(async(ctx)=>{
    return await ctx.storage.generateUploadUrl();

})

export const getFileUrl = mutation({
    args:{storageId:v.string()},
    handler: (ctx, {storageId})=>{
        return  ctx.storage.getUrl(storageId);
    }
});