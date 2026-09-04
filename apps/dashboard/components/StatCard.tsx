import type { LucideIcon } from 'lucide-react';

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = '#c755f7',
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-widest text-[#6b6480]">{label}</p>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${accent}1a` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 font-mono text-[26px] tabular-nums text-[#f8f5ff]">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-[#6b6480]">{hint}</p>}
    </div>
  );
}
