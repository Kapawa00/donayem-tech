import CtaSection from '@/components/sections/CtaSection';
import Hero from '@/components/sections/Hero';
import LazyTestimonialsSection from '@/components/sections/LazyTestimonialsSection';
import PortfolioPreview from '@/components/sections/PortfolioPreview';
import ServicesSection from '@/components/sections/ServicesSection';
import StatsSection from '@/components/sections/StatsSection';
import WhyUsSection from '@/components/sections/WhyUsSection';

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: 'https://donayemtech.com' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <StatsSection />
      <WhyUsSection />
      <PortfolioPreview />
      <LazyTestimonialsSection />
      <CtaSection />
    </>
  );
}
