import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./register.js";

// ESM Specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.post("/api/register", {}, async (request, reply) => {
      try {
        await registerUser(request.body.email, request.body.password);
      } catch (error) {
        console.error(error);
      }
    });

    // app.get("/", {}, (request, reply) => {
    //   reply.send({
    //     data: "Hello world",
    //   });
    // });

    await app.listen(3000, (error, address) => {
      console.log(`🚀 Server listening on port: ${address}`);
    });
  } catch (error) {
    console.error(error);
  }
}

connectDb().then(() => {
  startApp();
});
