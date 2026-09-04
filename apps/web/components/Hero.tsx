'use client';

import CRTWarp from './CRTWarp';
import WarpText from './WarpText';
import GlowCursor from './GlowCursor';
import StartMonitoringButton from './StartMonitoringButton';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[92vh] w-full overflow-hidden pt-16">
      {/* CRT warp background */}
      <div className="absolute inset-0">
        <CRTWarp
          color="#c755f7"
          backgroundColor="#05010a"
          speed={0.45}
          curvature={0.22}
          scanlineStrength={0.18}
          scanlineFrequency={220}
          waveAmplitude={0.22}
          waveFrequency={2.2}
          bloom={1.3}
          bloomRadius={1}
          noise={0.06}
          vignette={0.35}
          brightness={1.05}
          pixelation={1}
          rgbShift={0.008}
          mouseReact
          mouseStrength={0.35}
          dpr={1}
          fps={30}
        />
      </div>

      {/* Top/bottom fades so the warp blends into the page rather than hard-cutting */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#05030a] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05030a] to-transparent" />

      <GlowCursor
        color="#c755f7"
        secondaryColor="#67E8F9"
        trailLength={36}
        trailWidth={5}
        trailTaper={0.75}
        followSpeed={0.18}
        glowIntensity={1.4}
        glowSpread={1.0}
        hotspot={0.5}
        brightness={1.1}
        opacity={0.85}
        pulseSpeed={0.9}
        noiseStrength={0.02}
        idleFade
        idleTimeout={600}
        fadeDuration={800}
        blendMode="screen"
      >
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-20 text-center">
          {/* Live status eyebrow — encodes real product state, not decoration */}
          <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11.5px] tracking-wide text-[#9891ad]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            4 regions monitoring &middot; 99.98% avg uptime
          </div>

          <WarpText
            text="Know when your services go down."
            color="#f8f5ff"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            ripple
            fontSize="clamp(2.4rem, 6.4vw, 5.4rem)"
            fontWeight={800}
            style={{ height: '220px' }}
          />

          <p className="-mt-6 max-w-xl text-balance text-[15.5px] leading-relaxed text-[#9891ad] sm:text-base">
            <span className="text-[#f8f5ff]">Before your users do.</span> Pulsewatch checks your
            websites and APIs from multiple regions, tracks latency over time, and tells you the
            moment something breaks &mdash; not when a customer emails support.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <StartMonitoringButton className="rounded-full bg-[#c755f7] px-6 py-2.5 text-[14px] font-medium text-[#05030a] shadow-[0_0_30px_-6px_rgba(199,85,247,0.7)] transition-transform hover:scale-[1.03]" />
            <a
              href="#how-it-works"
              className="rounded-full border border-white/15 px-6 py-2.5 text-[14px] font-medium text-[#f8f5ff] transition-colors hover:border-white/30 hover:bg-white/[0.04]"
            >
              View Architecture
            </a>
          </div>
        </div>
      </GlowCursor>
    </section>
  );
}
