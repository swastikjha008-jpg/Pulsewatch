import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { MonitorsProvider } from '@/lib/monitors-store';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'pulsewatch — dashboard',
  description: 'Monitor overview, latency, and regional status.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative bg-[#05030a] font-sans text-[#f8f5ff] antialiased">
        {/* ambient depth — faint, fixed, echoes the landing page's palette without competing with data */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#c755f7]/[0.07] blur-[140px]" />
          <div className="absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-[#67E8F9]/[0.05] blur-[140px]" />
        </div>

        <MonitorsProvider>
          <Sidebar />
          <MobileNav />
          <div className="relative z-10 pt-14 lg:pl-60 lg:pt-0">{children}</div>
        </MonitorsProvider>
      </body>
    </html>
  );
}
