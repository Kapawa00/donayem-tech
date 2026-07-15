'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeUp } from '@/lib/animations';

export default function FormationHero() {
  const t = useTranslations('FormationHero');

  return (
    <section className="bg-navy-900 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center gap-2 font-inter text-xs text-gray-400">
          <Link href="/" className="transition-colors hover:text-gold-400">
            {t('breadcrumbHome')}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gold-400">{t('breadcrumbCurrent')}</span>
        </nav>

        <motion.h1
          className="mt-4 font-syne text-4xl font-extrabold md:text-5xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {t('heading')}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-2xl font-inter text-gray-300"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          {t('subheading')}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Button href="#inscription" variant="primary" className="mt-8">
            {t('cta')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
