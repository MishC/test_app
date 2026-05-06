import { HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
const http= new HttpRouter();
http.route({ path:"/clerk", method:"POST",
    handler: httpAction(async (ctx, request) => {
  return new Response("Hello, world!");} ),
});
export default http;