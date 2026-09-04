import type { Request, Response } from "express";
import { AppError, asyncHandler } from "../middleware/errorHandler";
import * as monitorService from "../services/monitor.service";

export const listMonitorsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const monitors = await monitorService.listMonitors();
  res.json(monitors);
});

export const getMonitorHandler = asyncHandler(async (req: Request, res: Response) => {
  const monitor = await monitorService.getMonitor(req.params.id);
  if (!monitor) throw new AppError("Monitor not found", 404);
  res.json(monitor);
});

export const createMonitorHandler = asyncHandler(async (req: Request, res: Response) => {
  const monitor = await monitorService.createMonitor(req.body);
  res.status(201).json(monitor);
});

export const updateMonitorHandler = asyncHandler(async (req: Request, res: Response) => {
  const monitor = await monitorService.updateMonitor(req.params.id, req.body);
  if (!monitor) throw new AppError("Monitor not found", 404);
  res.json(monitor);
});

export const deleteMonitorHandler = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await monitorService.deleteMonitor(req.params.id);
  if (!deleted) throw new AppError("Monitor not found", 404);
  res.status(204).send();
});

export const listChecksHandler = asyncHandler(async (req: Request, res: Response) => {
  const rawLimit = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 50;

  const monitor = await monitorService.getMonitor(req.params.id);
  if (!monitor) throw new AppError("Monitor not found", 404);

  const checks = await monitorService.listChecksForMonitor(req.params.id, limit);
  res.json(checks);
});
