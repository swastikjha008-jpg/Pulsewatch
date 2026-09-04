import "dotenv/config";
import { prisma } from "@pulsewatch/db";
import { createApp } from "./app";
import { listMonitors } from "./services/monitor.service";
import { syncAllSchedules } from "./services/scheduler.service";

const PORT = Number(process.env.API_PORT ?? 4000);

async function main(): Promise<void> {
  const app = createApp();

  // On boot, make sure the BullMQ repeatable-job schedule reflects the
  // current DB state (covers the "worker/queue was down" and "fresh deploy" cases).
  const monitors = await listMonitors();
  await syncAllSchedules(monitors);

  app.listen(PORT, () => {
    console.log(`[api] listening on :${PORT}`);
  });
}

main().catch((err) => {
  console.error("[api] failed to start:", err);
  process.exit(1);
});

async function shutdown(): Promise<void> {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
