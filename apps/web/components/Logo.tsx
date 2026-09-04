export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="22" height="22" rx="6" fill="#c755f7" fillOpacity="0.12" />
        <rect x="0.5" y="0.5" width="21" height="21" rx="5.5" stroke="#c755f7" strokeOpacity="0.35" />
        <path
          d="M3 11.5H6.4L8 6.5L11.2 16.5L13 11.5H14.6L15.4 9.5L16.2 11.5H19"
          stroke="#c755f7"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-mono text-[15px] tracking-tight text-[#f8f5ff]">
        pulse<span className="text-[#c755f7]">watch</span>
      </span>
    </div>
  );
}
