import { MapPin } from 'lucide-react';
import type { Check } from '@/lib/types';

export default function RegionGrid({ regions, checks }: { regions: string[]; checks: Check[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {regions.map((region) => {
        const points = checks.filter((c) => c.region === region);
        const last = points[points.length - 1];
        const avgLatency = points.length
          ? Math.round(points.reduce((s, c) => s + c.latencyMs, 0) / points.length)
          : null;

        return (
          <div key={region} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[12px] text-[#9891ad]">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {region}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  !last ? 'bg-[#4a4560]' : last.status === 'UP' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </div>
            <p className="mt-2 font-mono text-[18px] tabular-nums text-[#f8f5ff]">
              {avgLatency !== null ? `${avgLatency}ms` : '—'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
