'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeLeft, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';

const LOCALE_LABELS = { fr: 'Français', en: 'English', de: 'Deutsch' };

function isLinkActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Nav');
  const tServices = useTranslations('ServiceLinks');
  const shouldReduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  function handleLocaleChange(nextLocale) {
    setLangOpen(false);
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  const serviceLinks = [
    { href: '/services/webdesign-infographie', label: tServices('webdesign') },
    { href: '/services/marketing-digital', label: tServices('marketing') },
    { href: '/services/formation-bureautique', label: tServices('formation') },
    { href: '/services/boutique-shopify', label: tServices('shopify') },
  ];

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services'), children: serviceLinks },
    { href: '/portfolio', label: t('portfolio') },
    { href: '/formation', label: t('formation') },
    { href: '/pricing', label: t('pricing') },
    { href: '/contact', label: t('contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-[72px] transition-colors duration-300',
          scrolled ? 'bg-navy-900/95 shadow-sm backdrop-blur-lg' : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="DONAYEM TECH" width={773} height={323} className="h-12 w-auto" priority />
          </Link>

          <ul className="hidden items-center gap-8 font-inter text-sm font-medium text-white md:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(pathname, link.href);

              if (link.children) {
                return (
                  <li
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    onFocus={() => setServicesOpen(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setServicesOpen(false);
                      }
                    }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'relative flex items-center gap-1 py-2 transition-colors hover:text-gold-400',
                        active ? 'text-gold-400' : 'text-white'
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform', servicesOpen && 'rotate-180')}
                      />
                    </Link>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute left-0 top-full w-64 rounded-lg bg-white p-2 shadow-lg"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-md px-4 py-2 font-inter text-sm text-dark transition-colors hover:bg-navy-900/5 hover:text-navy-900"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative py-2 transition-colors hover:text-gold-400',
                      active ? 'text-gold-400' : 'text-white'
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-gold-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-5 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                aria-label={t('changeLanguage')}
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 py-2 font-inter text-sm font-medium uppercase text-white transition-colors hover:text-gold-400"
              >
                <Globe size={16} />
                {locale}
                <ChevronDown size={14} className={cn('transition-transform', langOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full w-40 rounded-lg bg-white p-2 shadow-lg"
                  >
                    {routing.locales.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleLocaleChange(loc)}
                        className={cn(
                          'block w-full rounded-md px-4 py-2 text-left font-inter text-sm transition-colors hover:bg-navy-900/5 hover:text-navy-900',
                          loc === locale ? 'font-semibold text-gold-600' : 'text-dark'
                        )}
                      >
                        {LOCALE_LABELS[loc]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button href="/devis" variant="outline" size="sm">
              {t('requestQuote')}
            </Button>
          </div>

          <button
            type="button"
            aria-label={t('openMenu')}
            className="text-white md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-navy-900 px-6 py-6 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/images/logo.png" alt="DONAYEM TECH" width={773} height={323} className="h-9 w-auto" />
                </div>
                <button
                  type="button"
                  aria-label={t('closeMenu')}
                  className="text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={26} />
                </button>
              </div>

              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-10 flex flex-col gap-1 font-inter text-sm font-medium text-white"
              >
                {navLinks.map((link) => {
                  const active = isLinkActive(pathname, link.href);

                  if (link.children) {
                    return (
                      <motion.li
                        key={link.href}
                        variants={shouldReduceMotion ? undefined : fadeLeft}
                        className="border-b border-white/10 py-3"
                      >
                        <button
                          type="button"
                          className={cn(
                            'flex w-full items-center justify-between transition-colors',
                            active ? 'text-gold-400' : 'text-white'
                          )}
                          onClick={() => setMobileServicesOpen((prev) => !prev)}
                        >
                          {link.label}
                          <ChevronDown
                            size={16}
                            className={cn('transition-transform', mobileServicesOpen && 'rotate-180')}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {link.children.map((child) => (
                                <li key={child.href} className="py-2">
                                  <Link href={child.href} className="text-white/70 hover:text-gold-400">
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  }

                  return (
                    <motion.li
                      key={link.href}
                      variants={shouldReduceMotion ? undefined : fadeLeft}
                      className="border-b border-white/10 py-3"
                    >
                      <Link
                        href={link.href}
                        className={cn('transition-colors', active ? 'text-gold-400' : 'text-white')}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="mt-6 flex items-center gap-2">
                <Globe size={16} className="text-white/50" />
                {routing.locales.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocaleChange(loc)}
                    className={cn(
                      'rounded-pill px-3 py-1.5 font-inter text-xs font-semibold uppercase tracking-widest transition-colors',
                      loc === locale ? 'bg-gold-400 text-navy-900' : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <Button href="/devis" variant="primary" className="mt-6 w-full">
                {t('requestQuote')}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
