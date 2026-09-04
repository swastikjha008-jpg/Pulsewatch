import IORedis from "ioredis";
import { Queue } from "bullmq";

export const CHECK_QUEUE_NAME = "monitor-checks";

/** Payload for a single "check this monitor from this region" job. */
export interface CheckJobData {
  monitorId: string;
  url: string;
  region: string;
  expectedStatusCode: number;
}

let connection: IORedis | null = null;

/** Shared ioredis connection. BullMQ requires maxRetriesPerRequest: null. */
export function getRedisConnection(): IORedis {
  if (!connection) {
    const url = process.env.REDIS_URL ?? "redis://localhost:6379";
    connection = new IORedis(url, { maxRetriesPerRequest: null });
  }
  return connection;
}

let checkQueue: Queue<CheckJobData> | null = null;

/** Shared BullMQ Queue used by the API (to publish) and inspected by the worker. */
export function getCheckQueue(): Queue<CheckJobData> {
  if (!checkQueue) {
    checkQueue = new Queue<CheckJobData>(CHECK_QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return checkQueue;
}

/** Deterministic id for the repeatable job covering one monitor+region pair. */
export function repeatableJobId(monitorId: string, region: string): string {
  return `monitor:${monitorId}:region:${region}`;
}
