export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
      requestId: req.requestId
    }
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;

  const isOperational = status < 500;

  if (!isOperational) {
    console.error(
      JSON.stringify({
        level: "error",
        requestId: req.requestId,
        message: err.message,
        stack: err.stack
      })
    );
  }

  res.status(status).json({
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: isOperational ? err.message : "Internal server error",
      requestId: req.requestId
    }
  });
}