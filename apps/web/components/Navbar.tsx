'use client';

import Logo from './Logo';
import StartMonitoringButton from './StartMonitoringButton';

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: '#docs' },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#05030a]/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" aria-label="pulsewatch home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13.5px] text-[#9891ad] transition-colors hover:text-[#f8f5ff]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#docs"
            className="hidden text-[13.5px] text-[#9891ad] transition-colors hover:text-[#f8f5ff] sm:block"
          >
            Sign in
          </a>
          <StartMonitoringButton className="rounded-full border border-[#c755f7]/40 bg-[#c755f7]/10 px-4 py-1.5 text-[13.5px] font-medium text-[#f8f5ff] transition-colors hover:bg-[#c755f7]/20" />
        </div>
      </nav>
    </header>
  );
}
