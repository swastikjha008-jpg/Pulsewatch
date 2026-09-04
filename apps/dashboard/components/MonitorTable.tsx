'use client';

import Link from 'next/link';
import type { MonitorSummary } from '@/lib/types';
import Sparkline from './Sparkline';
import StatusBadge from './StatusBadge';

export default function MonitorTable({
  monitors,
  emptyMessage,
}: {
  monitors: MonitorSummary[];
  emptyMessage?: string;
}) {
  if (monitors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-[14px] text-[#9891ad]">{emptyMessage ?? 'No monitors yet.'}</p>
        {!emptyMessage && (
          <Link href="/monitors/new" className="mt-3 inline-block text-[13px] text-[#c755f7] hover:underline">
            Add your first monitor →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#c755f7]/40 via-white/10 to-[#67E8F9]/30 p-px">
      <div className="overflow-hidden rounded-[15px] bg-[#0a0714]/95">
        <div className="hidden grid-cols-[1fr_110px_90px_100px_90px_90px] gap-4 px-5 pt-4 font-mono text-[10.5px] uppercase tracking-wider text-[#6b6480] sm:grid">
          <span>Monitor</span>
          <span>Regions</span>
          <span>Status</span>
          <span>Trend</span>
          <span>Latency</span>
          <span className="text-right">Uptime</span>
        </div>

        <ul className="divide-y divide-white/[0.05] px-5 py-2">
          {monitors.map((m) => (
            <li key={m.id}>
              <Link
                href={`/monitors/${m.id}`}
                className="grid grid-cols-2 items-center gap-3 py-3.5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[1fr_110px_90px_100px_90px_90px] sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] text-[#f8f5ff]">{m.name}</p>
                  <p className="truncate font-mono text-[11px] text-[#6b6480]">{m.url}</p>
                </div>

                <span className="hidden font-mono text-[12px] text-[#9891ad] sm:block">
                  {m.regions.join(', ')}
                </span>

                <span className="hidden sm:block">
                  <StatusBadge status={m.status} label={m.status.toLowerCase()} />
                </span>

                <span className="hidden sm:block">
                  {m.recentLatencies.length > 1 ? (
                    <Sparkline data={m.recentLatencies} color={m.status === 'DOWN' ? '#f59e0b' : '#67E8F9'} />
                  ) : (
                    <span className="font-mono text-[11px] text-[#4a4560]">no data</span>
                  )}
                </span>

                <span className="text-right font-mono text-[12.5px] tabular-nums text-[#f8f5ff] sm:text-left">
                  {m.latencyMs !== null ? `${m.latencyMs}ms` : '—'}
                </span>

                <span className="hidden text-right font-mono text-[12.5px] tabular-nums text-[#9891ad] sm:block">
                  {m.uptimeRecent !== null ? `${m.uptimeRecent}%` : '—'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
