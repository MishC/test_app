import { HttpRouter } from "convex/server";

import { onCreateUser } from "./clerk.js";
const http= new HttpRouter();
http.route({ path:"/clerk", method:"POST",
    handler:onCreateUser,
})
export default http;