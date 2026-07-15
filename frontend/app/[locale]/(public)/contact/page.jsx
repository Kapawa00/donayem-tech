import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/forms/ContactForm';
import ContactMap from '@/components/sections/ContactMap';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/contact' },
    openGraph: { url: 'https://donayemtech.com/contact' },
  };
}

const MAPS_EMBED_SRC =
  'https://www.google.com/maps?q=H%C3%B4tel+S%C3%A9lect+Ange+Rapha%C3%ABl+Douala+Cameroun&output=embed';

export default async function ContactPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const whatsappHref = `https://wa.me/237681181456?text=${encodeURIComponent(t('whatsappMessage'))}`;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <ContactForm />

        <div className="rounded-2xl bg-navy-900 p-8 text-white">
          <h3 className="font-syne text-xl font-bold">{t('detailsHeading')}</h3>

          <ul className="mt-6 space-y-4 font-inter text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
              {t('address')}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-gold-400" />
              <span className="flex flex-col gap-0.5">
                <a href="tel:+237681181456" className="transition-colors hover:text-gold-400">
                  681 181 456
                </a>
                <a href="tel:+237696580487" className="transition-colors hover:text-gold-400">
                  696 580 487
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-gold-400" />
              <a
                href="mailto:contact@donayemtech.com"
                className="transition-colors hover:text-gold-400"
              >
                contact@donayemtech.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="shrink-0 text-gold-400" />
              {t('hours')}
            </li>
          </ul>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-pill bg-[#25D366]
                       px-6 py-3 font-inter text-sm font-semibold text-white transition-colors
                       hover:bg-[#1EBE58]"
          >
            <MessageCircle size={18} />
            {t('whatsappCta')}
          </a>

          <div className="mt-6 flex gap-4 border-t border-white/10 pt-6">
            <a
              href="#"
              aria-label={t('facebookAriaLabel')}
              className="text-gray-400 transition-colors hover:text-gold-400"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              aria-label={t('instagramAriaLabel')}
              className="text-gray-400 transition-colors hover:text-gold-400"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 h-80 overflow-hidden rounded-xl border border-border shadow-sm">
        <ContactMap title={t('mapTitle')} src={MAPS_EMBED_SRC} />
      </div>
    </section>
  );
}
