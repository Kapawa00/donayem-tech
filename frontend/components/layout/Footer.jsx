import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tServices = useTranslations('ServiceLinks');
  const year = new Date().getFullYear();

  const serviceLinks = [
    { href: '/services/webdesign-infographie', label: tServices('webdesign') },
    { href: '/services/marketing-digital', label: tServices('marketing') },
    { href: '/services/formation-bureautique', label: tServices('formation') },
    { href: '/services/boutique-shopify', label: tServices('shopify') },
  ];

  const navLinks = [
    { href: '/portfolio', label: tNav('portfolio') },
    { href: '/formation', label: tNav('formation') },
    { href: '/blog', label: t('blog') },
    { href: '/a-propos', label: tNav('about') },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="inline-flex items-center">
            <Image src="/images/logo.png" alt="DONAYEM TECH" width={773} height={323} className="h-20 w-auto" />
          </div>
          <p className="mt-4 font-inter text-sm text-gray-400">{t('tagline')}</p>
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gold-400">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-gold-400">
              <Instagram size={20} />
            </a>
            <a
              href="https://wa.me/237681181456"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gray-400 hover:text-gold-400"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-gold-400">
            {t('servicesHeading')}
          </p>
          <ul className="mt-4 space-y-2 font-inter text-sm text-gray-400">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-gold-400">
            {t('navHeading')}
          </p>
          <ul className="mt-4 space-y-2 font-inter text-sm text-gray-400">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-gold-400">
            {t('contactHeading')}
          </p>
          <ul className="mt-4 space-y-3 font-inter text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
              {t('address')}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-gold-400" />
              681 181 456 / 696 580 487
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-gold-400" />
              contact@donayemtech.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-400/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-center font-inter text-xs text-gray-400 md:flex-row">
          <p>© {year} DONAYEM TECH. {t('rights')}</p>
          <p>{t('madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
