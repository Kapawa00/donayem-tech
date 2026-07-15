'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import SectionTitle from '@/components/ui/SectionTitle';
import { fadeUp, staggerContainer } from '@/lib/animations';

const VALUE_EMOJIS = ['✨', '🏆', '⚡'];
const VALUE_KEYS = ['value1', 'value2', 'value3'];

export default function AboutValuesSection() {
  const t = useTranslations('AboutValuesSection');

  const values = VALUE_KEYS.map((key, index) => ({
    emoji: VALUE_EMOJIS[index],
    title: t(`${key}Title`),
    text: t(`${key}Text`),
  }));

  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t('eyebrow')} title={t('heading')} />

        <motion.div
          className="mt-16 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {values.map(({ emoji, title, text }) => (
            <motion.div key={title} variants={fadeUp}>
              <Card className="flex h-full flex-col items-center gap-3 text-center">
                <span className="text-4xl" aria-hidden="true">
                  {emoji}
                </span>
                <h3 className="font-syne text-xl font-bold text-navy-900">{title}</h3>
                <p className="font-inter text-muted">{text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
