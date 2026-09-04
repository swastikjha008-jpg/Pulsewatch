'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api, ApiError } from './api';
import type { Check, CreateMonitorInput, Monitor, MonitorSummary } from './types';

// How many recent checks to sample per monitor for the overview table's
// status/latency/uptime/sparkline. Cheap Prisma query, kept small since it
// runs once per monitor on every refresh. The detail page fetches a much
// larger window directly via the API for its chart.
const SAMPLE_LIMIT = 20;
const POLL_INTERVAL_MS = 15_000;

function summarize(monitor: Monitor, checks: Check[]): MonitorSummary {
  if (checks.length === 0) {
    return { ...monitor, status: 'PENDING', latencyMs: null, uptimeRecent: null, recentLatencies: [] };
  }
  const ordered = [...checks].sort((a, b) => a.checkedAt.localeCompare(b.checkedAt));
  const latencies = ordered.map((c) => c.latencyMs);
  const upCount = ordered.filter((c) => c.status === 'UP').length;
  return {
    ...monitor,
    status: ordered[ordered.length - 1].status,
    latencyMs: Math.round(latencies.reduce((s, v) => s + v, 0) / latencies.length),
    uptimeRecent: Number(((upCount / ordered.length) * 100).toFixed(2)),
    recentLatencies: latencies,
  };
}

interface MonitorsContextValue {
  monitors: MonitorSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addMonitor: (input: CreateMonitorInput) => Promise<Monitor>;
  removeMonitor: (id: string) => Promise<void>;
}

const MonitorsContext = createContext<MonitorsContextValue | null>(null);

export function MonitorsProvider({ children }: { children: ReactNode }) {
  const [monitors, setMonitors] = useState<MonitorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Monotonic sequence, not just an in-flight boolean: a poll response that
  // resolves *after* a delete/create has landed would otherwise overwrite
  // that mutation with stale data. Every mutation bumps this too, so any
  // refresh() started before it gets discarded when it finally resolves.
  const requestSeq = useRef(0);

  const refresh = useCallback(async () => {
    const seq = ++requestSeq.current;
    try {
      const list = await api.listMonitors();
      const withStats = await Promise.all(
        list.map(async (m) => {
          try {
            const checks = await api.listChecks(m.id, SAMPLE_LIMIT);
            return summarize(m, checks);
          } catch {
            // A single monitor's check fetch failing shouldn't blank the whole table.
            return summarize(m, []);
          }
        })
      );
      if (seq !== requestSeq.current) return; // superseded by a mutation or a newer refresh
      setMonitors(withStats);
      setError(null);
    } catch (err) {
      if (seq !== requestSeq.current) return;
      setError(err instanceof ApiError ? err.message : 'Failed to load monitors.');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const addMonitor = useCallback(
    async (input: CreateMonitorInput) => {
      const monitor = await api.createMonitor(input);
      requestSeq.current++; // invalidate any refresh() in flight from before this
      setMonitors((prev) => [summarize(monitor, []), ...prev]);
      refresh();
      return monitor;
    },
    [refresh]
  );

  const removeMonitor = useCallback(async (id: string) => {
    await api.deleteMonitor(id);
    requestSeq.current++; // invalidate any refresh() in flight from before this
    setMonitors((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const value = useMemo(
    () => ({ monitors, loading, error, refresh, addMonitor, removeMonitor }),
    [monitors, loading, error, refresh, addMonitor, removeMonitor]
  );

  return <MonitorsContext.Provider value={value}>{children}</MonitorsContext.Provider>;
}

export function useMonitors() {
  const ctx = useContext(MonitorsContext);
  if (!ctx) throw new Error('useMonitors must be used within MonitorsProvider');
  return ctx;
}
