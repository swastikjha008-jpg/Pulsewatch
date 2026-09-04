import {
  getCheckQueue,
  repeatableJobId,
  type CheckJobData,
} from "@pulsewatch/queue";

import type { Monitor } from "@pulsewatch/db";

/**
 * The "publisher": rather than a naive setInterval loop, we use BullMQ's
 * repeatable jobs. Each (monitor, region) pair gets its own repeatable job
 * keyed deterministically, ticking every `intervalSeconds`. This survives
 * API restarts (the schedule lives in Redis) and lets the worker scale
 * horizontally without any coordination logic.
 */

/** Adds/refreshes one repeatable job per region for a monitor. */
export async function scheduleMonitor(monitor: Monitor): Promise<void> {
  const queue = getCheckQueue();

  await Promise.all(
    monitor.regions.map((region) => {
      const jobData: CheckJobData = {
        monitorId: monitor.id,
        url: monitor.url,
        region,
        expectedStatusCode: monitor.expectedStatusCode,
      };

      return queue.add("check", jobData, {
        jobId: repeatableJobId(monitor.id, region),
        repeat: { every: monitor.intervalSeconds * 1000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 500 },
      });
    })
  );
}

/** Removes the repeatable jobs for the given monitor/regions. */
export async function unscheduleMonitor(
  monitorId: string,
  regions: string[]
): Promise<void> {
  const queue = getCheckQueue();

  const repeatableJobs = await queue.getRepeatableJobs();

  const idsToRemove = new Set(
    regions.map((region) => repeatableJobId(monitorId, region))
  );

  await Promise.all(
    repeatableJobs
    .filter(
      (job) =>
        job.id !== null &&
        job.id !== undefined &&
        job.key !== undefined &&
        idsToRemove.has(job.id)
    )
    .map((job) => queue.removeRepeatableByKey(job.key!))
  );
}

/** Used on update: tears down the old region schedule, then re-adds the current one. */
export async function rescheduleMonitor(
  monitor: Monitor,
  previousRegions: string[]
): Promise<void> {
  await unscheduleMonitor(monitor.id, previousRegions);
  await scheduleMonitor(monitor);
}

/** Called once on API boot to make Redis's schedule match the DB exactly. */
export async function syncAllSchedules(
  monitors: Monitor[]
): Promise<void> {
  const queue = getCheckQueue();

  const existing = await queue.getRepeatableJobs();

  await Promise.all(
    existing
      .filter((job) => job.key !== undefined)
      .map((job) => queue.removeRepeatableByKey(job.key))
  );

  await Promise.all(
    monitors.map((monitor) => scheduleMonitor(monitor))
  );

  console.log(
    `[api] synced schedule: ${monitors.length} monitor(s), ${existing.length} stale job(s) cleared`
  );
}