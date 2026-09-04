import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DashboardPreview from '@/components/DashboardPreview';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05030a]">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <Features />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  );
}
