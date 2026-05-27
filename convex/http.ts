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
const signature=request.headers.get("stripe-signature");
if (!signature) {
    return new Response("Missing Stripe signature", {status:400});
}

try {
    const result=await ctx.runAction(internal.stripe.fulfill,{
        payload: await request.text(),
        signature,
    });

    if (result?.success === true){
        return new Response(null, {status:200});
    }

    return new Response("Webhook Error", {status:400});
} catch (error) {
    console.error("Stripe webhook failed", error);
    return new Response("Invalid Stripe webhook", {status:400});
}
    }),
})
export default http;
