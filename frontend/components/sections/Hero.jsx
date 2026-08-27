'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronDown, Palette, ShoppingBag, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeDown, fadeLeft, fadeUp } from '@/lib/animations';

const SERVICE_ICON_COMPONENTS = [
  { icon: Palette, key: 'serviceWebdesign' },
  { icon: TrendingUp, key: 'serviceMarketing' },
  { icon: BookOpen, key: 'serviceFormation' },
  { icon: ShoppingBag, key: 'serviceShopify' },
];

// Positions + timings déterministes (pas de Math.random) pour éviter les écarts SSR/CSR,
// tout en donnant à chaque étoile une durée et un délai qui semblent aléatoires.
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 41) % 100,
  top: (i * 67) % 100,
  size: 2 + (i % 3),
  delay: (i % 6) * 0.4,
  duration: 3 + ((i * 7) % 5),
}));

const cardVariants = {
  hidden: { ...fadeLeft.hidden, scale: 0.95 },
  visible: { ...fadeLeft.visible, scale: 1 },
};

function scrollToNextSection() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
}

export default function Hero() {
  const t = useTranslations('Hero');
  const shouldReduceMotion = useReducedMotion();

  const SERVICE_ICONS = SERVICE_ICON_COMPONENTS.map(({ icon, key }) => ({
    icon,
    label: t(key),
  }));

  return (
    <section className="relative -mt-24 flex min-h-screen items-center overflow-hidden bg-navy-900">
      <div className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 animate-gradient-move" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold-400"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.5 }
                : { y: [-5, 5, -5], opacity: [0.3, 0.8, 0.3] }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 py-32 md:grid-cols-2 md:items-center">
        <div>
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeDown}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-pill border border-gold-400/30
                       bg-gold-400/15 px-4 py-1.5 font-inter text-xs font-medium uppercase
                       tracking-widest text-gold-400"
          >
            ✦ {t('badge')}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 font-syne text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl"
          >
            {t('headingPrefix')} <span className="text-gold-400">{t('headingHighlight')}</span>
            {t('headingSuffix')}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 max-w-lg font-inter text-lg text-gray-300"
          >
            {t('description')}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button href="/services" variant="primary" size="lg">
              {t('ctaPrimary')}
            </Button>
            <Button href="/devis" variant="outline" size="lg">
              {t('ctaSecondary')}
            </Button>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.65, duration: 0.6, ease: 'easeOut' }}
            className="mt-8 font-inter text-sm text-gray-400"
          >
            {t('statsLine')}
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="grid grid-cols-2 gap-4"
          >
            {SERVICE_ICONS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl bg-navy-800 p-4 text-center"
              >
                <Icon className="text-gold-400" size={28} />
                <span className="font-inter text-sm font-medium text-white">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={scrollToNextSection}
        aria-label={t('scrollAriaLabel')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 transition-colors hover:text-gold-400"
      >
        <motion.span
          className="block"
          animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} />
        </motion.span>
      </button>
    </section>
  );
}
