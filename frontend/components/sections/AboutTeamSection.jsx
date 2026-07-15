'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

export default function AboutTeamSection() {
  const t = useTranslations('AboutTeamSection');

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="rounded-full bg-gold-400/10 p-4">
          <Users className="text-gold-500" size={32} />
        </div>
        <span className="font-inter text-xs font-medium uppercase tracking-widest text-gold-600">
          {t('eyebrow')}
        </span>
        <h2 className="font-syne text-3xl font-bold text-navy-900 md:text-4xl">{t('heading')}</h2>
        <p className="mt-2 font-inter text-base text-muted">{t('text')}</p>
      </motion.div>
    </section>
  );
}
