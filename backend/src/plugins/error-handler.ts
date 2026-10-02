import fp from "fastify-plugin";
import { ZodError } from "zod";
import { ConnextError } from "../errors.js";

export default fp(async (app) => {
  app.setErrorHandler((err, request, reply) => {
    if (err instanceof ConnextError) {
      request.log.warn({ code: err.code, msg: err.message, requestId: request.id }, "connext_error");
      return reply.status(err.statusCode).send({
        error: err.code,
        message: err.message,
      });
    }
    if (err instanceof ZodError) {
      return reply.status(400).send({
        error: "ValidationError",
        message: err.issues.map((i) => i.message).join("; "),
      });
    }
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    const message = err instanceof Error ? err.message : "Something went wrong";
    request.log.error({ err, requestId: request.id }, "unhandled_error");
    return reply.status(status).send({
      error: "InternalError",
      message: status === 500 ? "Something went wrong" : message,
    });
  });
});
