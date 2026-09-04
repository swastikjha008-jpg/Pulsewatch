import { prisma } from "@pulsewatch/db";
import type { CreateMonitorInput, UpdateMonitorInput } from "../validators/monitor.schema";
import { rescheduleMonitor, scheduleMonitor, unscheduleMonitor } from "./scheduler.service";

export function listMonitors() {
  return prisma.monitor.findMany({ orderBy: { createdAt: "desc" } });
}

export function getMonitor(id: string) {
  return prisma.monitor.findUnique({ where: { id } });
}

export async function createMonitor(input: CreateMonitorInput) {
  const monitor = await prisma.monitor.create({ data: input });
  await scheduleMonitor(monitor);
  return monitor;
}

export async function updateMonitor(id: string, input: UpdateMonitorInput) {
  const existing = await prisma.monitor.findUnique({ where: { id } });
  if (!existing) return null;

  const updated = await prisma.monitor.update({ where: { id }, data: input });
  await rescheduleMonitor(updated, existing.regions);
  return updated;
}

export async function deleteMonitor(id: string) {
  const existing = await prisma.monitor.findUnique({ where: { id } });
  if (!existing) return null;

  await unscheduleMonitor(id, existing.regions);
  await prisma.monitor.delete({ where: { id } });
  return existing;
}

/** Bonus: recent time-series rows for a monitor, newest first. */
export function listChecksForMonitor(monitorId: string, limit = 50) {
  return prisma.check.findMany({
    where: { monitorId },
    orderBy: { checkedAt: "desc" },
    take: limit,
  });
}
