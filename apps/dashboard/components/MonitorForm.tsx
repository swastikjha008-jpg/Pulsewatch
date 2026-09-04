'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMonitors } from '@/lib/monitors-store';
import { ApiError } from '@/lib/api';
import { SUGGESTED_REGIONS } from '@/lib/types';

export default function MonitorForm() {
  const router = useRouter();
  const { addMonitor } = useMonitors();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [regions, setRegions] = useState<string[]>(['iad1', 'fra1']);
  const [interval, setInterval_] = useState(60);
  const [expectedStatusCode, setExpectedStatusCode] = useState(200);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRegion = (r: string) => {
    setRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || regions.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const monitor = await addMonitor({
        name,
        url,
        regions,
        intervalSeconds: interval,
        expectedStatusCode,
      });
      router.push(`/monitors/${monitor.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create monitor.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-[13px] text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6b6480]">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="checkout-service"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-[#f8f5ff] placeholder:text-[#4a4560] focus:border-[#c755f7]/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6b6480]">URL to check</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/health"
          type="url"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-[13px] text-[#f8f5ff] placeholder:text-[#4a4560] focus:border-[#c755f7]/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6b6480]">
          Check from regions
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED_REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleRegion(r)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-colors ${
                regions.includes(r)
                  ? 'border-[#c755f7]/50 bg-[#c755f7]/15 text-[#f8f5ff]'
                  : 'border-white/10 text-[#6b6480] hover:border-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6b6480]">
            Interval (seconds)
          </label>
          <input
            value={interval}
            onChange={(e) => setInterval_(Number(e.target.value))}
            type="number"
            min={10}
            step={5}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-[13px] text-[#f8f5ff] focus:border-[#c755f7]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6b6480]">
            Expected status
          </label>
          <input
            value={expectedStatusCode}
            onChange={(e) => setExpectedStatusCode(Number(e.target.value))}
            type="number"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-[13px] text-[#f8f5ff] focus:border-[#c755f7]/50 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || regions.length === 0}
        className="rounded-full bg-[#c755f7] px-6 py-2.5 text-[14px] font-medium text-[#05030a] shadow-[0_0_30px_-6px_rgba(199,85,247,0.7)] transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {submitting ? 'Creating…' : 'Create monitor'}
      </button>
    </form>
  );
}
