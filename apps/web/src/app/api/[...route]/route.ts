import { handle } from "hono/vercel";
import { app } from "@avuny/application";
import { swaggerUI } from "@hono/swagger-ui";
// import { Hono } from "hono";

// const app = new Hono().basePath("/api");
// app.get("/hello", (c) => {
//   return c.json({
//     message: "Hello from Hono!",
//   });
// });

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
