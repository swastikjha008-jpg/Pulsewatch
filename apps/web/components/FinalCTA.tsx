import StartMonitoringButton from './StartMonitoringButton';

export default function FinalCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-32">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d0817] to-[#05030a] px-8 py-16 text-center sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_0%,#c755f7,transparent_60%)]" />

        <div className="relative">
          <p className="font-mono text-[11.5px] tracking-wide text-[#c755f7]">GET STARTED</p>
          <h2 className="mx-auto mt-3 max-w-lg text-2xl font-semibold text-[#f8f5ff] sm:text-3xl">
            Find out about outages before your users tell you
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] text-[#9891ad]">
            Add your first monitor in under a minute. No credit card required.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <StartMonitoringButton className="rounded-full bg-[#c755f7] px-6 py-2.5 text-[14px] font-medium text-[#05030a] shadow-[0_0_30px_-6px_rgba(199,85,247,0.7)] transition-transform hover:scale-[1.03]" />
            <a
              href="#how-it-works"
              className="rounded-full border border-white/15 px-6 py-2.5 text-[14px] font-medium text-[#f8f5ff] transition-colors hover:border-white/30 hover:bg-white/[0.04]"
            >
              View Architecture
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
