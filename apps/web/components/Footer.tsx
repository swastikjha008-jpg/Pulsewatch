import Logo from './Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: ['Monitoring', 'Status pages', 'Incident alerts', 'API'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'Architecture', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-12 sm:flex-row">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-[13px] leading-relaxed text-[#6b6480]">
            Uptime and latency monitoring across multiple regions, with confirmed incident
            detection you can actually trust.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10.5px] tracking-widest text-[#6b6480]">
                {col.title.toUpperCase()}
              </p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#9891ad] transition-colors hover:text-[#f8f5ff]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-[#6b6480] sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Pulsewatch. All checks run, all the time.</p>
        <p className="font-mono">status.pulsewatch.io</p>
      </div>
    </footer>
  );
}
