import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Topbar({
  title,
  subtitle,
  hideAction,
}: {
  title: string;
  subtitle?: string;
  hideAction?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5 lg:px-8">
      <div>
        <h1 className="text-[19px] font-semibold text-[#f8f5ff]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-[#9891ad]">{subtitle}</p>}
      </div>
      {!hideAction && (
        <Link
          href="/monitors/new"
          className="flex items-center gap-1.5 rounded-full bg-[#c755f7] px-4 py-2 text-[13px] font-medium text-[#05030a] shadow-[0_0_24px_-6px_rgba(199,85,247,0.7)] transition-transform hover:scale-[1.03] lg:hidden"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
          Add
        </Link>
      )}
    </div>
  );
}
