'use client';

import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Gauge, Globe2, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import Topbar from '@/components/Topbar';
import StatCard from '@/components/StatCard';
import MonitorTable from '@/components/MonitorTable';
import { useMonitors } from '@/lib/monitors-store';

export default function OverviewPage() {
  const { monitors, loading, error, refresh } = useMonitors();
  const [query, setQuery] = useState('');

  const withData = monitors.filter((m) => m.status !== 'PENDING');
  const up = monitors.filter((m) => m.status === 'UP').length;
  const avgUptime = withData.length
    ? (withData.reduce((s, m) => s + (m.uptimeRecent ?? 0), 0) / withData.length).toFixed(2)
    : '—';
  const avgLatency = withData.length
    ? Math.round(withData.reduce((s, m) => s + (m.latencyMs ?? 0), 0) / withData.length)
    : null;
  const regionCount = new Set(monitors.flatMap((m) => m.regions)).size;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return monitors;
    return monitors.filter((m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
  }, [monitors, query]);

  const stats = [
    { label: 'Monitors up', value: `${up}/${monitors.length}`, icon: ShieldCheck, accent: '#67E8F9' },
    { label: 'Avg uptime (recent)', value: avgUptime === '—' ? '—' : `${avgUptime}%`, icon: Activity, accent: '#c755f7' },
    { label: 'Avg latency', value: avgLatency !== null ? `${avgLatency}ms` : '—', icon: Gauge, accent: '#67E8F9' },
    { label: 'Regions', value: String(regionCount), icon: Globe2, accent: '#c755f7' },
  ];

  return (
    <main className="min-h-screen">
      <Topbar title="Overview" subtitle={`${monitors.length} monitors across ${regionCount} regions`} />

      <div className="space-y-8 px-6 py-8 lg:px-8">
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-300">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </span>
            <button
              onClick={() => refresh()}
              className="flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1 text-[12px] hover:bg-red-400/10"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <StatCard {...s} />
            </div>
          ))}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '220ms' }}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#6b6480]">Monitors</p>
            <div className="relative w-full max-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b6480]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search monitors"
                className="w-full rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-8 pr-3 text-[12.5px] text-[#f8f5ff] placeholder:text-[#6b6480] focus:border-[#c755f7]/50 focus:outline-none"
              />
            </div>
          </div>

          {loading && monitors.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-12 text-center">
              <p className="font-mono text-[12.5px] text-[#6b6480]">Loading monitors…</p>
            </div>
          ) : (
            <MonitorTable monitors={filtered} emptyMessage={query ? `No monitors match "${query}".` : undefined} />
          )}
        </div>
      </div>
    </main>
  );
}
