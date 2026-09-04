'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, LayoutGrid, Menu, Plus, Settings, Siren, X } from 'lucide-react';
import Logo from './Logo';

const NAV = [{ label: 'Overview', href: '/', icon: LayoutGrid }];
const SOON = [
  { label: 'Incidents', icon: Siren },
  { label: 'Regions', icon: Globe2 },
  { label: 'Settings', icon: Settings },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#05030a]/90 px-4 backdrop-blur-md lg:hidden">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-[#9891ad] hover:bg-white/[0.06] hover:text-[#f8f5ff]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-72 flex-col border-l border-white/[0.08] bg-[#05030a] p-4">
            <div className="flex items-center justify-between pb-4">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-[#9891ad] hover:bg-white/[0.06] hover:text-[#f8f5ff]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {NAV.map(({ label, href, icon: Icon }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] ${
                      active ? 'bg-[#c755f7]/10 text-[#f8f5ff]' : 'text-[#9891ad]'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    {label}
                  </Link>
                );
              })}
              <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-widest text-[#4a4560]">
                Roadmap
              </p>
              {SOON.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] text-[#4a4560]">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                  {label}
                  <span className="ml-auto font-mono text-[10px]">soon</span>
                </div>
              ))}
            </nav>

            <Link
              href="/monitors/new"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#c755f7] px-3 py-2.5 text-[13px] font-medium text-[#05030a]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
              Add monitor
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
