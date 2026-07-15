import { getTranslations } from 'next-intl/server';
import AboutHero from '@/components/sections/AboutHero';
import AboutLocationSection from '@/components/sections/AboutLocationSection';
import AboutStorySection from '@/components/sections/AboutStorySection';
import AboutTeamSection from '@/components/sections/AboutTeamSection';
import AboutValuesSection from '@/components/sections/AboutValuesSection';
import CtaSection from '@/components/sections/CtaSection';
import StatsSection from '@/components/sections/StatsSection';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/a-propos' },
    openGraph: { url: 'https://donayemtech.com/a-propos' },
  };
}

export default async function AProposPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return (
    <>
      <AboutHero />
      <AboutStorySection />
      <AboutValuesSection />
      <StatsSection />
      <AboutTeamSection />
      <AboutLocationSection />
      <CtaSection
        title={t('ctaTitle')}
        subtitle={t('ctaSubtitle')}
        primaryLabel={t('ctaPrimaryLabel')}
        primaryHref="/devis"
        secondaryLabel={t('ctaSecondaryLabel')}
        secondaryHref="/contact"
      />
    </>
  );
}
