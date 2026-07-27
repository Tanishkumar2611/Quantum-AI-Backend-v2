import { Router, type IRouter } from "express";
import { GetSystemStatusResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const SERVER_START = Date.now();
const VERSION = "1.0.0";

router.get("/v1/status", (_req, res) => {
  const uptimeSeconds = (Date.now() - SERVER_START) / 1000;
  const memMb = process.memoryUsage().rss / 1024 / 1024;

  const data = GetSystemStatusResponse.parse({
    name: "QuantumAI-Backend",
    version: VERSION,
    uptimeSeconds: Math.round(uptimeSeconds * 100) / 100,
    memoryUsageMb: Math.round(memMb * 100) / 100,
    nodeVersion: process.version,
    environment: process.env["NODE_ENV"] ?? "production",
  });

  res.json(data);
});

export default router;
