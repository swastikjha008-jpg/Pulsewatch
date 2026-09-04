import { Globe2, Gauge, BellRing, Code2, History } from 'lucide-react';

const FEATURES = [
  {
    tag: 'REGIONAL',
    icon: Globe2,
    title: 'Multi-region checks',
    body: 'Every monitor is polled from several regions in parallel, so you know if an outage is global or local to one edge.',
  },
  {
    tag: 'LATENCY',
    icon: Gauge,
    title: 'Response time tracking',
    body: 'Every check stores its latency in a time-series store, so you can see drift over weeks, not just the last ping.',
  },
  {
    tag: 'INCIDENTS',
    icon: BellRing,
    title: 'Incident detection',
    body: 'Pulsewatch confirms failures across regions before alerting, so a flaky router in one region won\u2019t page you at 3am.',
  },
  {
    tag: 'API',
    icon: Code2,
    title: 'API & endpoint checks',
    body: 'Monitor REST and JSON endpoints with custom headers, expected status codes, and response-body assertions.',
  },
  {
    tag: 'HISTORY',
    icon: History,
    title: 'Uptime history',
    body: 'A full timeline of every check, incident, and recovery \u2014 queryable, exportable, and kept for as long as you need.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-14 max-w-xl">
        <p className="font-mono text-[11.5px] tracking-wide text-[#c755f7]">FEATURES</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#f8f5ff] sm:text-3xl">
          Built for what a poller actually needs to do
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[#9891ad]">
          Not a status page bolted onto a cron job &mdash; a system designed around regions,
          time-series data, and confirmed incidents from the ground up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ tag, icon: Icon, title, body }) => (
          <div
            key={title}
            className="group relative bg-[#07050e] p-6 transition-colors hover:bg-[#0b0813]"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[#c755f7]" strokeWidth={1.6} />
              <span className="font-mono text-[10px] tracking-widest text-[#6b6480]">{tag}</span>
            </div>
            <h3 className="mt-5 text-[15px] font-medium text-[#f8f5ff]">{title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#9891ad]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
