import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import ServiceOverviewBlock from '@/components/sections/ServiceOverviewBlock';
import { getServices } from '@/lib/queries';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ServicesPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/services' },
    openGraph: { url: 'https://donayemtech.com/services' },
  };
}

async function fetchServices(locale) {
  try {
    const { data } = await getServices(locale);
    return data;
  } catch (error) {
    return [];
  }
}

export default async function ServicesPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ServicesPage' });
  const services = await fetchServices(locale);

  return (
    <>
      <section className="bg-navy-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 font-inter text-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-gold-400">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gold-400">{t('breadcrumbCurrent')}</span>
          </nav>

          <h1 className="mt-4 font-syne text-4xl font-extrabold md:text-5xl">{t('heading')}</h1>
          <p className="mt-4 max-w-2xl font-inter text-gray-300">{t('subheading')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl divide-y divide-gray-100 px-6">
        {services.map((service, index) => (
          <ServiceOverviewBlock key={service.slug} service={service} reversed={index % 2 === 1} />
        ))}
      </section>
    </>
  );
}
