import "dotenv/config";
import { Worker, type Job } from "bullmq";
import { CheckStatus, prisma } from "@pulsewatch/db";
import { CHECK_QUEUE_NAME, getRedisConnection, type CheckJobData } from "@pulsewatch/queue";
import { performCheck } from "./checker";

const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY ?? 10);

const worker = new Worker<CheckJobData>(
  CHECK_QUEUE_NAME,
  async (job: Job<CheckJobData>) => {
    const { monitorId, url, region, expectedStatusCode } = job.data;

    const result = await performCheck(url, expectedStatusCode);

    await prisma.check.create({
      data: {
        monitorId,
        region,
        status: result.up ? CheckStatus.UP : CheckStatus.DOWN,
        latencyMs: result.latencyMs,
        statusCode: result.statusCode ?? undefined,
      },
    });

    return result;
  },
  {
    connection: getRedisConnection(),
    concurrency: CONCURRENCY,
  }
);

worker.on("completed", (job, result: import("./checker").CheckResult) => {
  console.log(
    `[worker] ${result.up ? "UP  " : "DOWN"} monitor=${job.data.monitorId} region=${job.data.region} ${result.latencyMs}ms status=${result.statusCode ?? "n/a"}`
  );
});

worker.on("failed", (job, err) => {
  console.error(
    `[worker] job failed monitor=${job?.data.monitorId} region=${job?.data.region}:`,
    err
  );
});

worker.on("error", (err) => {
  console.error("[worker] worker error:", err);
});

console.log(`[worker] started (concurrency=${CONCURRENCY}), waiting for jobs...`);

async function shutdown(): Promise<void> {
  console.log("[worker] shutting down...");
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
