import { XCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Button from '@/components/ui/Button';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PaiementAnnulePage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
  };
}

export default async function PaiementAnnulePage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PaiementAnnulePage' });

  return (
    <section className="bg-surface px-6 py-24">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle size={40} className="text-red-500" />
        </div>

        <h1 className="font-syne text-3xl font-bold text-navy-900">{t('heading')}</h1>
        <p className="font-inter text-sm text-muted">{t('description')}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/devis" variant="primary">
            {t('retryButton')}
          </Button>
          <Button href="/contact" variant="outline-dark">
            {t('contactButton')}
          </Button>
        </div>
      </div>
    </section>
  );
}
