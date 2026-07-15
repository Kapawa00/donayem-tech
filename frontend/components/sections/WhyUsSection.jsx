'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Sparkles, Zap } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { fadeUp, staggerContainer } from '@/lib/animations';

const REASON_ICONS = [
  { icon: Sparkles, key: 'reason1' },
  { icon: Award, key: 'reason2' },
  { icon: Zap, key: 'reason3' },
];

export default function WhyUsSection() {
  const t = useTranslations('WhyUsSection');

  const REASONS = REASON_ICONS.map(({ icon, key }) => ({
    icon,
    title: t(`${key}Title`),
    text: t(`${key}Text`),
  }));

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
        />

        <motion.div
          className="mt-16 grid gap-12 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {REASONS.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="rounded-full bg-gold-400/10 p-4">
                <Icon className="text-gold-500" size={32} />
              </div>
              <h3 className="font-syne text-xl font-bold text-navy-900">{title}</h3>
              <p className="font-inter text-muted">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
