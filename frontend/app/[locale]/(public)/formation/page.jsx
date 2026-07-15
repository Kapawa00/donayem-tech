import { getTranslations } from 'next-intl/server';
import AcademicServicesSection from '@/components/sections/AcademicServicesSection';
import FormationHero from '@/components/sections/FormationHero';
import FormationLocationSection from '@/components/sections/FormationLocationSection';
import FormationModulesSection from '@/components/sections/FormationModulesSection';
import FormationRegistrationSection from '@/components/sections/FormationRegistrationSection';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'FormationPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/formation' },
    openGraph: { url: 'https://donayemtech.com/formation' },
  };
}

export default function FormationPage() {
  return (
    <>
      <FormationHero />
      <FormationModulesSection />
      <AcademicServicesSection />
      <FormationRegistrationSection />
      <FormationLocationSection />
    </>
  );
}
