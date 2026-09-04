export type BadgeStatus = 'UP' | 'DOWN' | 'PENDING';

const STYLES: Record<BadgeStatus, { dot: string; text: string; label: string }> = {
  UP: { dot: 'bg-emerald-400', text: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300', label: 'operational' },
  DOWN: { dot: 'bg-amber-400', text: 'border-amber-400/30 bg-amber-400/10 text-amber-300', label: 'degraded' },
  PENDING: { dot: 'bg-[#6b6480]', text: 'border-white/10 bg-white/[0.03] text-[#9891ad]', label: 'pending' },
};

export default function StatusBadge({ status, label }: { status: BadgeStatus; label?: string }) {
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${style.text}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === 'UP' && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
      </span>
      {label ?? style.label}
    </span>
  );
}
