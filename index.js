import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { logUserOut } from "./accounts/logUserOut.js";
import { getUserFromCookies } from "./accounts/user.js";

// ESM Specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userId = await registerUser(
          request.body.email,
          request.body.password
        );
        if (userId) {
          await logUserIn(userId, request, reply);
          reply.send({
            data: {
              status: "SUCCESS",
              userId,
            },
          });
        }
      } catch (error) {
        console.error(error);
        reply.send({
          data: {
            status: "FAILED",
            userId,
          },
        });
      }
    });

    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply);
        reply.send({
          data: {
            status: "SUCCESS",
          },
        });
      } catch (error) {
        console.error(error);
        reply.send({
          data: {
            status: "FAILED",
            userId,
          },
        });
      }
    });

    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        console.log(request.body.email, request.body.password);
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        );

        if (isAuthorized) {
          await logUserIn(userId, request, reply);
          reply.send({
            data: {
              status: "SUCCESS",
              userId,
            },
          });
        }
      } catch (error) {
        console.error(error);
        reply.send({
          data: {
            status: "FAILED",
            userId,
          },
        });
      }
    });

    app.get("/test", {}, async (request, reply) => {
      try {
        const user = await getUserFromCookies(request, reply);
        // Verify user login
        // Return user email, if it exist, otherwise return unathorized
        if (user?._id) {
          reply.send({
            data: user,
          });
        } else {
          reply.send({
            data: "User Lookup Failed",
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

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
