import { getTranslations } from 'next-intl/server';
import BlogGrid from '@/components/sections/BlogGrid';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/blog' },
    openGraph: { url: 'https://donayemtech.com/blog' },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return (
    <>
      <section className="bg-navy-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-syne text-3xl font-extrabold md:text-4xl">{t('heading')}</h1>
          <p className="mx-auto mt-3 max-w-xl font-inter text-gray-300">{t('subtitle')}</p>
        </div>
      </section>

      <BlogGrid />
    </>
  );
}
