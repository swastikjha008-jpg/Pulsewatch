'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { useMonitors } from '@/lib/monitors-store';
import { api, ApiError } from '@/lib/api';
import type { Check, Monitor } from '@/lib/types';
import StatusBadge, { type BadgeStatus } from '@/components/StatusBadge';
import LatencyChart from '@/components/LatencyChart';
import RegionGrid from '@/components/RegionGrid';

const CHART_LIMIT = 200;

export default function MonitorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { removeMonitor } = useMonitors();

  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  const load = async () => {
    setError(null);
    try {
      const [m, c] = await Promise.all([api.getMonitor(params.id), api.listChecks(params.id, CHART_LIMIT)]);
      setMonitor(m);
      setChecks(c);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setError(err instanceof ApiError ? err.message : 'Failed to load this monitor.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => clearTimeout(resetTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDeleteClick = async () => {
    if (!confirming) {
      setConfirming(true);
      resetTimer.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearTimeout(resetTimer.current);
    if (monitor) await removeMonitor(monitor.id);
    router.push('/');
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="font-mono text-[13px] text-[#6b6480]">Loading…</p>
      </main>
    );
  }

  if (notFound || !monitor) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[14px] text-[#9891ad]">Monitor not found.</p>
          <Link href="/" className="mt-3 inline-block text-[13px] text-[#c755f7] hover:underline">
            ← Back to overview
          </Link>
        </div>
      </main>
    );
  }

  const ordered = [...checks].sort((a, b) => a.checkedAt.localeCompare(b.checkedAt));
  const latencies = ordered.map((c) => c.latencyMs);
  const avgLatency = latencies.length ? Math.round(latencies.reduce((s, v) => s + v, 0) / latencies.length) : null;
  const uptime = ordered.length
    ? Number(((ordered.filter((c) => c.status === 'UP').length / ordered.length) * 100).toFixed(2))
    : null;
  const currentStatus: BadgeStatus = ordered.length ? ordered[ordered.length - 1].status : 'PENDING';
  const recentChecks = [...checks].reverse().slice(0, 8);

  return (
    <main className="min-h-screen">
      <div className="border-b border-white/[0.06] px-6 py-5 lg:px-8">
        <Link href="/" className="mb-4 flex items-center gap-1.5 text-[12.5px] text-[#6b6480] hover:text-[#f8f5ff]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Overview
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[19px] font-semibold text-[#f8f5ff]">{monitor.name}</h1>
              <StatusBadge status={currentStatus} label={currentStatus.toLowerCase()} />
            </div>
            <p className="mt-1 font-mono text-[12.5px] text-[#6b6480]">{monitor.url}</p>
          </div>
          <button
            onClick={handleDeleteClick}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] transition-colors ${
              confirming
                ? 'border-red-400/50 bg-red-400/10 text-red-300'
                : 'border-white/10 text-[#9891ad] hover:border-red-400/40 hover:text-red-300'
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirming ? 'Click again to confirm' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="space-y-8 px-6 py-8 lg:px-8">
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-300">
            {error}
            <button
              onClick={() => {
                setLoading(true);
                load();
              }}
              className="flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1 text-[12px] hover:bg-red-400/10"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        )}

        <div className="grid animate-fade-in-up grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-[#6b6480]">Avg latency</p>
            <p className="mt-2 font-mono text-[20px] tabular-nums text-[#f8f5ff]">
              {avgLatency !== null ? `${avgLatency}ms` : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-[#6b6480]">Uptime</p>
            <p className="mt-2 font-mono text-[20px] tabular-nums text-[#f8f5ff]">
              {uptime !== null ? `${uptime}%` : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="font-mono text-[10.5px] uppercase tracking-widest text-[#6b6480]">Interval</p>
            <p className="mt-2 font-mono text-[20px] tabular-nums text-[#f8f5ff]">{monitor.intervalSeconds}s</p>
          </div>
        </div>

        <div
          className="relative animate-fade-in-up rounded-2xl bg-gradient-to-br from-[#c755f7]/40 via-white/10 to-[#67E8F9]/30 p-px"
          style={{ animationDelay: '80ms' }}
        >
          <div className="rounded-[15px] bg-[#0a0714]/95 p-5">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#6b6480]">Latency, all regions</p>
            <LatencyChart history={ordered} color="#c755f7" />
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '140ms' }}>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[#6b6480]">By region</p>
          <RegionGrid regions={monitor.regions} checks={checks} />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[#6b6480]">Recent checks</p>
          <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
            {recentChecks.length === 0 ? (
              <p className="px-5 py-6 text-center font-mono text-[12.5px] text-[#6b6480]">
                No checks yet — the worker polls on the next interval.
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.05]">
                {recentChecks.map((c) => (
                  <li key={c.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${c.status === 'UP' ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      />
                      <span className="font-mono text-[12px] text-[#9891ad]">{c.region}</span>
                      <span className="font-mono text-[12px] text-[#6b6480]">
                        {new Date(c.checkedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className="font-mono text-[12.5px] tabular-nums text-[#f8f5ff]">{c.latencyMs}ms</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
