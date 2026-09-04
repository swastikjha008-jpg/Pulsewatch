export interface CheckResult {
  up: boolean;
  latencyMs: number;
  statusCode: number | null;
}

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Performs a single HTTP GET against `url`, measuring wall-clock latency and
 * comparing the response status code against `expectedStatusCode`.
 * Network errors, non-2xx-by-default status handling, and timeouts are all
 * treated as a DOWN result rather than throwing, so a single bad check never
 * fails the BullMQ job (which would trigger pointless retries).
 */
export async function performCheck(
  url: string,
  expectedStatusCode: number
): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const start = performance.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });

    const latencyMs = Math.round(performance.now() - start);

    return {
      up: response.status === expectedStatusCode,
      latencyMs,
      statusCode: response.status,
    };
  } catch {
    // Covers DNS failure, connection refused, TLS errors, and the abort timeout.
    const latencyMs = Math.round(performance.now() - start);
    return {
      up: false,
      latencyMs,
      statusCode: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}
