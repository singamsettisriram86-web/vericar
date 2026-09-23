// app/page.tsx
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSolutionSection from '@/components/ProblemSolutionSection';
import AbstractUIMockup from '@/components/AbstractUIMockup';
import BentoGrid from '@/components/BentoGrid';
import HowItWorks from '@/components/HowItWorks';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-[#171e19]">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <AbstractUIMockup />
      <BentoGrid />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  );
}

