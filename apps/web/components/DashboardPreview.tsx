'use client';

import { useEffect, useRef, useState } from 'react';

type Monitor = {
  name: string;
  url: string;
  status: 'up' | 'degraded';
  region: string;
  latency: number;
  uptime: string;
  history: number[];
};

const INITIAL_MONITORS: Monitor[] = [
  {
    name: 'api.pulsewatch.io',
    url: '/v1/health',
    status: 'up',
    region: 'fra1',
    latency: 84,
    uptime: '99.99%',
    history: [40, 44, 38, 52, 46, 41, 39, 45, 42, 40],
  },
  {
    name: 'checkout-service',
    url: '/orders/ping',
    status: 'up',
    region: 'iad1',
    latency: 112,
    uptime: '99.97%',
    history: [60, 58, 64, 70, 62, 66, 59, 63, 61, 60],
  },
  {
    name: 'auth-gateway',
    url: '/oauth/status',
    status: 'degraded',
    region: 'sin1',
    latency: 486,
    uptime: '98.41%',
    history: [50, 55, 130, 210, 340, 480, 460, 400, 470, 486],
  },
  {
    name: 'marketing-site',
    url: '/',
    status: 'up',
    region: 'lhr1',
    latency: 61,
    uptime: '100.0%',
    history: [30, 28, 32, 29, 31, 27, 30, 29, 28, 30],
  },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 24 - ((v - min) / range) * 22 - 1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 24" className="h-6 w-20" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardPreview() {
  const [monitors, setMonitors] = useState(INITIAL_MONITORS);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Live-feeling latency jitter — mirrors what a poller actually produces
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitors((prev) =>
        prev.map((m) => {
          const jitter = m.status === 'degraded' ? 40 : 8;
          const next = Math.max(20, Math.round(m.latency + (Math.random() - 0.5) * jitter));
          return { ...m, latency: next, history: [...m.history.slice(1), next] };
        })
      );
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      className={`mx-auto -mt-16 w-full max-w-4xl px-6 transition-all duration-700 ease-out sm:-mt-24 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* gradient-border shell */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#c755f7]/50 via-white/10 to-[#67E8F9]/40 p-px shadow-[0_0_90px_-20px_rgba(199,85,247,0.4)]">
        <div className="relative z-10 overflow-hidden rounded-[15px] bg-[#0a0714]/95 backdrop-blur-xl">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#6b6480]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              monitors &middot; live
            </span>
          </div>

          {/* Column labels */}
          <div className="hidden grid-cols-[1fr_90px_100px_90px_80px] gap-4 px-5 pt-4 font-mono text-[10.5px] uppercase tracking-wider text-[#6b6480] sm:grid">
            <span>Monitor</span>
            <span>Region</span>
            <span>Trend</span>
            <span>Latency</span>
            <span className="text-right">Uptime</span>
          </div>

          <ul className="divide-y divide-white/[0.05] px-5 py-2">
            {monitors.map((m) => (
              <li
                key={m.name}
                className="grid grid-cols-2 items-center gap-3 py-3 sm:grid-cols-[1fr_90px_100px_90px_80px] sm:gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      m.status === 'up' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-[#f8f5ff]">{m.name}</p>
                    <p className="truncate font-mono text-[11px] text-[#6b6480]">{m.url}</p>
                  </div>
                </div>

                <span className="hidden font-mono text-[12px] text-[#9891ad] sm:block">{m.region}</span>

                <span className="hidden sm:block">
                  <Sparkline data={m.history} color={m.status === 'up' ? '#67E8F9' : '#f59e0b'} />
                </span>

                <span className="text-right font-mono text-[12.5px] tabular-nums text-[#f8f5ff] sm:text-left">
                  {m.latency}ms
                </span>

                <span className="hidden text-right font-mono text-[12.5px] tabular-nums text-[#9891ad] sm:block">
                  {m.uptime}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
