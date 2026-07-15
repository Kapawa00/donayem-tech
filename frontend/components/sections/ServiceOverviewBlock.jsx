'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeLeft, fadeRight } from '@/lib/animations';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';
import { ICONS } from '@/lib/icon-map';
import { cn } from '@/lib/utils';

export default function ServiceOverviewBlock({ service, reversed = false }) {
  const t = useTranslations('ServiceOverviewBlock');
  const locale = useLocale();
  const Icon = ICONS[service.icon] ?? ICONS.Palette;

  return (
    <div className="grid gap-10 py-16 md:grid-cols-2 md:items-center md:gap-12">
      <motion.div
        variants={reversed ? fadeRight : fadeLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className={cn('relative aspect-[4/3] overflow-hidden rounded-2xl', reversed && 'md:order-2')}
      >
        <Image
          src={`https://picsum.photos/seed/${service.slug}/800/600`}
          alt={service.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </motion.div>

      <motion.div
        variants={reversed ? fadeLeft : fadeRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className={cn(reversed && 'md:order-1')}
      >
        <div className="inline-flex rounded-xl bg-navy-900/5 p-3">
          <Icon className="text-gold-500" size={28} />
        </div>

        <h2 className="mt-4 font-syne text-2xl font-bold text-navy-900 md:text-3xl">
          {service.title}
        </h2>
        <p className="mt-4 font-inter leading-relaxed text-muted">{service.long_description}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {(service.features ?? []).map((feature) => (
            <li key={feature} className="flex items-start gap-2 font-inter text-sm text-gray-700">
              <Check size={16} className="mt-0.5 shrink-0 text-gold-500" />
              {feature}
            </li>
          ))}
        </ul>

        <p className="mt-6 font-syne text-lg font-bold text-navy-900">
          {service.starting_price
            ? t('startingPrice', { price: Number(service.starting_price).toLocaleString(locale) })
            : t('customQuote')}
        </p>

        <Button href={`/devis?service=${service.slug}`} variant="primary" className="mt-6">
          {t('requestQuoteCta')}
        </Button>
      </motion.div>
    </div>
  );
}
