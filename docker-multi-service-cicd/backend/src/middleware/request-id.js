import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req, res, next) {
  const incomingId = req.get("x-request-id");

  const requestId =
    incomingId && /^[a-zA-Z0-9-]{1,64}$/.test(incomingId)
      ? incomingId
      : randomUUID();

  req.requestId = requestId;

  res.setHeader("X-Request-ID", requestId);

  next();
}
