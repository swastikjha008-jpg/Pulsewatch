'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Check } from '@/lib/types';

export default function LatencyChart({ history, color = '#c755f7' }: { history: Check[]; color?: string }) {
  if (history.length === 0) {
    return (
      <div className="flex h-56 w-full items-center justify-center">
        <p className="font-mono text-[12.5px] text-[#6b6480]">No checks yet — the worker polls on the next interval.</p>
      </div>
    );
  }

  const data = history.map((c) => ({
    time: new Date(c.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: c.latencyMs,
    down: c.status === 'DOWN',
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: '#6b6480', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#6b6480', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v) => `${v}ms`}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0714',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: '#f8f5ff',
            }}
            labelStyle={{ color: '#9891ad', marginBottom: 4 }}
            formatter={(value: number) => [`${value}ms`, 'latency']}
          />
          <Area type="monotone" dataKey="latency" stroke={color} strokeWidth={1.8} fill="url(#latencyFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
