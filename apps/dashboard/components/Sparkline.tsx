export default function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <svg viewBox="0 0 100 24" className="h-6 w-20" />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 24 - ((v - min) / range) * 22 - 1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 24" className="h-6 w-20" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
