'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import ContactMap from '@/components/sections/ContactMap';
import { fadeLeft, fadeRight } from '@/lib/animations';

const MAPS_EMBED_SRC =
  'https://www.google.com/maps?q=H%C3%B4tel+S%C3%A9lect+Ange+Rapha%C3%ABl+Douala+Cameroun&output=embed';

export default function AboutLocationSection() {
  const t = useTranslations('AboutLocationSection');

  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <span className="font-inter text-xs font-medium uppercase tracking-widest text-gold-600">
            {t('eyebrow')}
          </span>
          <h2 className="mt-3 font-syne text-3xl font-bold text-navy-900 md:text-4xl">
            {t('heading')}
          </h2>

          <p className="mt-6 font-inter leading-relaxed text-muted">{t('paragraph')}</p>

          <p className="mt-4 flex items-start gap-3 font-inter text-sm text-dark">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold-500" />
            {t('address')}
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-border shadow-sm"
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="h-80 w-full">
            <ContactMap title={t('mapTitle')} src={MAPS_EMBED_SRC} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
