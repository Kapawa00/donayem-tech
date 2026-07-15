import { useTranslations } from 'next-intl';
import { BUSINESS, SITE_URL } from '@/lib/seo';

export default function LocalBusinessSchema() {
  const t = useTranslations('LocalBusinessSchema');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description: t('description'),
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressCountry: BUSINESS.addressCountry,
    },
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    openingHours: BUSINESS.openingHours,
    sameAs: BUSINESS.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
