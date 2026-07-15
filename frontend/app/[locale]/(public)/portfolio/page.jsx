import { getTranslations } from 'next-intl/server';
import PortfolioExplorer from '@/components/sections/PortfolioExplorer';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PortfolioPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/portfolio' },
    openGraph: { url: 'https://donayemtech.com/portfolio' },
  };
}

export default async function PortfolioPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PortfolioPage' });

  return (
    <>
      <section className="bg-navy-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-syne text-4xl font-extrabold md:text-5xl">{t('heading')}</h1>
          <p className="mx-auto mt-4 max-w-2xl font-inter text-gray-300">{t('subtitle')}</p>
        </div>
      </section>

      <PortfolioExplorer />
    </>
  );
}
