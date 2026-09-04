import { Router } from "express";
import { prisma } from "@pulsewatch/db";
import { asyncHandler } from "../middleware/errorHandler";

export const healthRouter = Router();

// GET /health
healthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  })
);
