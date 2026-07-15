import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getTranslations, getMessages } from 'next-intl/server';
import { Check, ChevronRight } from 'lucide-react';
import Accordion from '@/components/ui/Accordion';
import Badge from '@/components/ui/Badge';
import ServiceViewTracker from '@/components/analytics/ServiceViewTracker';
import QuickQuoteForm from '@/components/forms/QuickQuoteForm';
import { servicePortfolioCategories } from '@/data/serviceFaqs';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';
import { ICONS } from '@/lib/icon-map';
import { getPortfolio, getService, getServices } from '@/lib/queries';

export async function generateStaticParams({ params }) {
  try {
    const { data } = await getServices(params?.locale);
    return data.map((service) => ({ slug: service.slug }));
  } catch (error) {
    return [];
  }
}

async function fetchService(slug, locale) {
  try {
    const { data } = await getService(slug, locale);
    return data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const service = await fetchService(params.slug, params.locale);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.short_description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      url: `https://donayemtech.com/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ServiceDetailPage' });
  const service = await fetchService(params.slug, locale);

  if (!service) {
    notFound();
  }

  const Icon = ICONS[service.icon] ?? ICONS.Palette;
  const messages = await getMessages({ locale });
  const faq = messages.ServiceFaqs?.[service.slug] ?? [];
  const relatedCategories = servicePortfolioCategories[service.slug] ?? [];

  let relatedPortfolio = [];
  if (relatedCategories.length > 0) {
    try {
      const { data } = await getPortfolio({ per_page: 50 }, locale);
      relatedPortfolio = data
        .filter((item) => relatedCategories.includes(item.category))
        .slice(0, 4);
    } catch (error) {
      relatedPortfolio = [];
    }
  }

  return (
    <>
      <ServiceViewTracker slug={service.slug} />

      <section className="bg-navy-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <nav className="flex flex-wrap items-center gap-2 font-inter text-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-gold-400">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight size={14} />
            <Link href="/services" className="transition-colors hover:text-gold-400">
              {t('breadcrumbServices')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gold-400">{service.title}</span>
          </nav>

          <div className="mt-6 inline-flex rounded-xl bg-white/10 p-3">
            <Icon className="text-gold-400" size={32} />
          </div>
          <h1 className="mt-4 font-syne text-4xl font-extrabold md:text-5xl">{service.title}</h1>
          <p className="mt-4 max-w-2xl font-inter text-gray-300">{service.short_description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="font-inter leading-relaxed text-gray-700">{service.long_description}</p>

            <h2 className="mt-10 font-syne text-2xl font-bold text-navy-900">{t('includedHeading')}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {(service.features ?? []).map((feature) => (
                <li key={feature} className="flex items-start gap-2 font-inter text-sm text-gray-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-gold-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <p className="mt-8 font-syne text-lg font-bold text-navy-900">
              {service.starting_price
                ? t('startingPrice', { price: Number(service.starting_price).toLocaleString(locale) })
                : t('customQuote')}
            </p>

            {relatedPortfolio.length > 0 && (
              <div className="mt-14">
                <h2 className="font-syne text-2xl font-bold text-navy-900">{t('portfolioHeading')}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {relatedPortfolio.map((item) => (
                    <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={item.thumbnail_url || item.media_url}
                        alt={item.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                      <Badge variant="gold" className="absolute left-3 top-3">
                        {item.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {faq.length > 0 && (
              <div className="mt-14">
                <h2 className="font-syne text-2xl font-bold text-navy-900">{t('faqHeading')}</h2>
                <div className="mt-6">
                  <Accordion items={faq} />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <QuickQuoteForm serviceCategory={service.category} serviceSlug={service.slug} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
