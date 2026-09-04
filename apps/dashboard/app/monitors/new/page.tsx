import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Topbar from '@/components/Topbar';
import MonitorForm from '@/components/MonitorForm';

export default function NewMonitorPage() {
  return (
    <main className="min-h-screen">
      <div className="px-6 pt-5 lg:px-8">
        <Link href="/" className="flex items-center gap-1.5 text-[12.5px] text-[#6b6480] hover:text-[#f8f5ff]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Overview
        </Link>
      </div>
      <Topbar
        title="Add monitor"
        subtitle="Checks run from every region you select, on the interval you set."
        hideAction
      />
      <div className="px-6 py-8 lg:px-8">
        <MonitorForm />
      </div>
    </main>
  );
}
