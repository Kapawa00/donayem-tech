import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import DevisForm from '@/components/forms/DevisForm';
import Loader from '@/components/ui/Loader';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'DevisPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/devis' },
    openGraph: { url: 'https://donayemtech.com/devis' },
  };
}

export default function DevisPage() {
  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md md:p-12">
        <Suspense fallback={<Loader size={48} className="mx-auto" />}>
          <DevisForm />
        </Suspense>
      </div>
    </section>
  );
}
