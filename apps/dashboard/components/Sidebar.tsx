'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, LayoutGrid, Plus, Settings, Siren } from 'lucide-react';
import Logo from './Logo';

const NAV = [{ label: 'Overview', href: '/', icon: LayoutGrid }];

const SOON = [
  { label: 'Incidents', icon: Siren },
  { label: 'Regions', icon: Globe2 },
  { label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 shrink-0 flex-col border-r border-white/[0.06] bg-[#05030a] lg:flex">
      <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
                active
                  ? 'bg-[#c755f7]/10 text-[#f8f5ff]'
                  : 'text-[#9891ad] hover:bg-white/[0.04] hover:text-[#f8f5ff]'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c755f7]" />}
            </Link>
          );
        })}

        <p className="px-3 pt-5 pb-1 font-mono text-[10px] uppercase tracking-widest text-[#4a4560]">Roadmap</p>
        {SOON.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-[#4a4560]"
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            {label}
            <span className="ml-auto font-mono text-[10px] text-[#4a4560]">soon</span>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <Link
          href="/monitors/new"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#c755f7] px-3 py-2 text-[13px] font-medium text-[#05030a] shadow-[0_0_24px_-6px_rgba(199,85,247,0.7)] transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
          Add monitor
        </Link>
      </div>
    </aside>
  );
}
