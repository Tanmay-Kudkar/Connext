import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import errorHandler from "./plugins/error-handler.js";
import authPlugin from "./plugins/auth.js";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { communityRoutes } from "./routes/communities.js";
import { postRoutes } from "./routes/posts.js";
import { creditRoutes } from "./routes/credits.js";
import { aiRoutes } from "./routes/ai.js";
import { integrationRoutes } from "./routes/integrations.js";
import { githubRoutes } from "./routes/github.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
      redact: ["req.headers.cookie", "req.headers.authorization"],
      ...(process.env.NODE_ENV !== "production"
        ? {
            transport: {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname,reqId",
              },
            },
          }
        : {}),
    },
    genReqId: () => crypto.randomUUID(),
  });

  await app.register(cors, {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  });
  await app.register(cookie);
  await app.register(rateLimit, {
    max: 400,
    timeWindow: "1 minute",
  });
  await app.register(swagger, {
    openapi: {
      info: { title: "Connext API", version: "0.1.0" },
    },
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });
  await app.register(errorHandler);
  await app.register(authPlugin);
  await authRoutes(app);
  await userRoutes(app);
  await communityRoutes(app);
  await postRoutes(app);
  await creditRoutes(app);
  await aiRoutes(app);
  await integrationRoutes(app);
  await githubRoutes(app);

  app.get("/health", async () => ({ status: "ok", service: "connext-api" }));
  app.get("/api/health", async () => ({ status: "ok", service: "connext-api" }));

  return app;
}
