import { getSalesByCustomerClerkId, queryWithUser } from "./utils";

export const getLibraryPrducts=queryWithUser({args:{},
handler: async(ctx)=>{const sales=await getSalesByCustomerClerkId(ctx.db, ctx.userId!)}})