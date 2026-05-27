import { HttpRouter } from "convex/server";

import { onCreateUser } from "./clerk.js";
import {  httpAction } from "./_generated/server.js";
import { internal } from "./_generated/api.js";

const http= new HttpRouter();
http.route({ path:"/clerk", method:"POST",
    handler:onCreateUser,
});
http.route({ path:"/stripe", method:"POST",
    handler:httpAction( async (ctx,request)=>{
const signature=request.headers.get('stripe-signature');
const result=await ctx.runAction(internal.stripe.fulfill,{payload: await request.text(),signature});
if (result.success){
    return new Response(null, {status:200})
} else {
        return new Response("Webhook Error", {status:400})

}
    }),
})
export default http;