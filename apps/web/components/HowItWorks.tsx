import { Globe, Cpu, MapPinned, Database, LayoutDashboard } from 'lucide-react';

const STEPS = [
  { icon: Globe, label: 'Website / API', note: 'Any URL you add' },
  { icon: Cpu, label: 'Poller worker', note: 'Job queue, scheduled checks' },
  { icon: MapPinned, label: 'Regions', note: 'Requests fan out in parallel' },
  { icon: Database, label: 'Time-series DB', note: 'Latency & status stored' },
  { icon: LayoutDashboard, label: 'Dashboard', note: 'Uptime, incidents, trends' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-16 max-w-xl">
        <p className="font-mono text-[11.5px] tracking-wide text-[#67E8F9]">ARCHITECTURE</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#f8f5ff] sm:text-3xl">
          What happens on every check
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[#9891ad]">
          A single monitor fans out into parallel regional checks, gets written to a
          time-series store, and surfaces in your dashboard in real time.
        </p>
      </div>

      <div className="relative">
        {/* connecting line, desktop */}
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-white/10 lg:block">
          <div className="pulse-travel h-full w-10 bg-gradient-to-r from-transparent via-[#c755f7] to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {STEPS.map(({ icon: Icon, label, note }, i) => (
            <div key={label} className="relative flex flex-col items-start lg:items-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-[#0a0714]">
                <Icon className="h-5 w-5 text-[#f8f5ff]" strokeWidth={1.6} />
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-widest text-[#6b6480] lg:text-center">
                STEP {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-1 text-[14px] font-medium text-[#f8f5ff] lg:text-center">{label}</p>
              <p className="mt-1 max-w-[160px] text-[12.5px] leading-relaxed text-[#9891ad] lg:text-center">
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-travel {
          0% { transform: translateX(-40px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw)); opacity: 0; }
        }
        .pulse-travel {
          animation: pulse-travel 4.5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-travel { animation: none; }
        }
      `}</style>
    </section>
  );
}
