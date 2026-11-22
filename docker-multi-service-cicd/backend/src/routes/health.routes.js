import { Router } from "express";
import { checkDatabase } from "../db/pool.js";

const router = Router();

// Liveness: Is the Node process responding?
router.get("/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    requestId: req.requestId
  });
});

// Readiness: Is the service ready to handle traffic?
router.get("/ready", async (req, res) => {
  try {
    await checkDatabase();

    res.status(200).json({
      status: "ready",
      dependencies: {
        postgres: "connected"
      },
      requestId: req.requestId
    });
  } catch {
    res.status(503).json({
      status: "not_ready",
      dependencies: {
        postgres: "unavailable"
      },
      requestId: req.requestId
    });
  }
});

export default router;