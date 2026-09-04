export type CheckStatus = 'UP' | 'DOWN';

// Suggested region codes for the "add monitor" form. The API accepts any
// non-empty string for a region — this list is just a sane default set of
// polling locations, not an enum enforced server-side.
export const SUGGESTED_REGIONS = ['iad1', 'fra1', 'sin1', 'lhr1', 'gru1'] as const;

export interface Monitor {
  id: string;
  name: string;
  url: string;
  regions: string[];
  expectedStatusCode: number;
  intervalSeconds: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Check {
  id: string;
  monitorId: string;
  region: string;
  status: CheckStatus;
  latencyMs: number;
  statusCode: number | null;
  checkedAt: string; // ISO
}

export interface CreateMonitorInput {
  name: string;
  url: string;
  regions: string[];
  expectedStatusCode: number;
  intervalSeconds: number;
}

/**
 * The API only returns raw Monitor rows and raw Check rows — it doesn't
 * pre-aggregate status/latency/uptime. This is a Monitor plus a client-side
 * summary computed from a small recent sample of its checks, used by the
 * overview table. A monitor with no checks yet (just created, worker hasn't
 * polled it) is 'PENDING' rather than assumed up or down.
 */
export interface MonitorSummary extends Monitor {
  status: CheckStatus | 'PENDING';
  latencyMs: number | null;
  uptimeRecent: number | null; // % up across the sampled checks; null if no checks yet
  recentLatencies: number[]; // oldest → newest, for the sparkline
}
