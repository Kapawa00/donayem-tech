'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { fadeUp } from '@/lib/animations';

export default function CtaSection({
  title,
  subtitle,
  primaryLabel,
  primaryHref = '/devis',
  secondaryLabel,
  secondaryHref = '/contact',
}) {
  const t = useTranslations('CtaSection');
  const resolvedTitle = title ?? t('title');
  const resolvedSubtitle = subtitle ?? t('subtitle');
  const resolvedPrimaryLabel = primaryLabel ?? t('primaryLabel');
  const resolvedSecondaryLabel = secondaryLabel ?? t('secondaryLabel');

  return (
    <section className="bg-gradient-to-br from-gold-400 to-gold-500 px-6 py-20">
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-syne text-4xl font-extrabold text-navy-900">{resolvedTitle}</h2>
        <p className="font-inter text-lg text-navy-900/80">{resolvedSubtitle}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Button href={primaryHref} variant="dark">
            {resolvedPrimaryLabel}
          </Button>
          <Button href={secondaryHref} variant="outline-dark">
            {resolvedSecondaryLabel}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
