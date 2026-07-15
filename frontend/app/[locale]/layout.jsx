import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import CookieBanner from '@/components/ui/CookieBanner';
import { routing } from '@/i18n/routing';
import { syne, inter } from '@/lib/fonts';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import '../globals.css';

const DEFAULT_TITLE = 'DONAYEM TECH — Agence Digitale à Douala, Cameroun';
const DEFAULT_DESCRIPTION =
  'Webdesign, infographie, marketing digital, formation bureautique, développement web et mobile, hébergement de sites et boutiques Shopify à Douala. Votre partenaire digital au Cameroun.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'agence digitale douala',
    'webdesign cameroun',
    'marketing digital douala',
    'flyers douala',
    'shopify cameroun',
    'formation bureautique douala',
    'développement web douala',
    'développement mobile cameroun',
    'hébergement site web douala',
    'création compte google business douala',
    'création page facebook professionnelle cameroun',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'fr_CM',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  return (
    <html lang={locale} className={`${syne.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        <NextIntlClientProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          {(gaId || fbPixelId) && <CookieBanner gaId={gaId} fbPixelId={fbPixelId} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
