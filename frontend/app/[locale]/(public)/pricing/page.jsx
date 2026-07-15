import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Check, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PricingPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/pricing' },
    openGraph: { url: 'https://donayemtech.com/pricing' },
  };
}

const PLAN_KEYS = ['starter', 'business', 'premium'];

export default async function PricingPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PricingPage' });
  const currency = t('currency');

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

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {PLAN_KEYS.map((key) => {
            const plan = t.raw(`plans.${key}`);
            const isPopular = key === 'business';

            return (
              <div
                key={key}
                className={cn(
                  'relative flex flex-col rounded-2xl bg-white p-8',
                  isPopular
                    ? 'border-2 border-gold-400 shadow-lg md:-translate-y-2'
                    : 'border border-gray-200'
                )}
              >
                {isPopular && (
                  <span
                    className="absolute inset-x-0 -top-4 mx-auto w-fit rounded-pill bg-gold-400 px-4 py-1.5
                               font-inter text-xs font-bold uppercase tracking-wide text-navy-900 shadow-sm"
                  >
                    {t('popularBadge')}
                  </span>
                )}

                <h2 className="font-syne text-2xl font-bold text-navy-900">{plan.name}</h2>

                <p className="mt-4 flex flex-nowrap items-baseline gap-2 whitespace-nowrap">
                  <span
                    className={cn(
                      'font-syne text-3xl font-extrabold sm:text-4xl',
                      isPopular ? 'text-gold-600' : 'text-navy-900'
                    )}
                  >
                    {plan.price}
                  </span>
                  <span className="font-inter text-sm text-muted">{currency}</span>
                </p>

                <p className="mt-2 font-inter text-sm text-muted">{plan.subtitle}</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 font-inter text-sm text-gray-700">
                      <Check size={18} className="shrink-0 text-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/devis"
                  className={cn(
                    'mt-10 inline-flex w-full items-center justify-center rounded-pill px-6 py-4',
                    'font-inter text-base font-bold underline decoration-2 underline-offset-4',
                    'transition-colors duration-200',
                    isPopular
                      ? 'bg-gold-400 text-navy-900 hover:bg-gold-300'
                      : 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white'
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 rounded-2xl bg-surface px-6 py-16 text-center">
          <h2 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">{t('footerHeading')}</h2>
          <p className="max-w-xl font-inter text-base text-muted">{t('footerText')}</p>
          <Button href="/contact" variant="primary">
            {t('footerCta')}
          </Button>
        </div>
      </section>
    </>
  );
}
