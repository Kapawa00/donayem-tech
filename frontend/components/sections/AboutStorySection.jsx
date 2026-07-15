'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fadeLeft, fadeRight } from '@/lib/animations';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';

export default function AboutStorySection() {
  const t = useTranslations('AboutStorySection');

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="font-inter text-xs font-medium uppercase tracking-widest text-gold-600">
            {t('eyebrow')}
          </span>
          <h2 className="mt-3 font-syne text-3xl font-bold text-navy-900 md:text-4xl">
            {t('heading')}
          </h2>

          <p className="mt-6 font-inter leading-relaxed text-muted">{t('paragraph1')}</p>
          <p className="mt-4 font-inter leading-relaxed text-muted">{t('paragraph2')}</p>
        </motion.div>

        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Image
            src="https://picsum.photos/seed/donayem-histoire/800/600"
            alt={t('imageAlt')}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </motion.div>
      </div>
    </section>
  );
}
