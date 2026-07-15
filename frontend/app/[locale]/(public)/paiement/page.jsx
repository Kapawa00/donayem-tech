import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PaiementPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
  };
}

export default async function PaiementPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PaiementPage' });

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="font-syne text-3xl font-bold text-navy-900 md:text-4xl">{t('heading')}</h1>
      <p className="mt-4 font-inter text-sm text-muted">{t('description')}</p>
    </section>
  );
}
