import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Add the auth routes
http.route({
  path: "/auth",
  method: "POST",
  handler: auth,
});

export default http;