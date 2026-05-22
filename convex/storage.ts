import {mutation} from "./_generated/server";
import { v } from "convex/values";
//Convex API for file storage
export const generateUploadUrl = mutation(async(ctx)=>{
    return await ctx.storage.generateUploadUrl();

})

export const getFileUrl = mutation({
    args:{storageId: v.id("_storage")},
    handler: (ctx, {storageId})=>{
        return  ctx.storage.getUrl(storageId);
    }
});