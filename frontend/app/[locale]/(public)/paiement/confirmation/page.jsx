import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import PaymentConfirmation from '@/components/sections/PaymentConfirmation';
import Loader from '@/components/ui/Loader';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'PaiementConfirmationPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
  };
}

export default function PaiementConfirmationPage() {
  return (
    <section className="bg-surface">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader size={48} />
          </div>
        }
      >
        <PaymentConfirmation />
      </Suspense>
    </section>
  );
}
