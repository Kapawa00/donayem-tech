'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import SectionTitle from '@/components/ui/SectionTitle';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';
import { getPortfolio } from '@/lib/queries';

export default function PortfolioPreview() {
  const t = useTranslations('PortfolioPreview');
  const locale = useLocale();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await getPortfolio({ per_page: 6, featured: true }, locale);
      setItems(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} />

        {loading ? (
          <LoadingState count={6} className="mt-16" />
        ) : error ? (
          <ErrorState
            message={t('errorMessage')}
            onRetry={fetchItems}
          />
        ) : items.length === 0 ? (
          <p className="mt-16 text-center font-inter text-sm text-muted">
            {t('emptyMessage')}
          </p>
        ) : (
          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
              >
                <Image
                  src={item.thumbnail_url || item.media_url}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />

                <Badge variant="gold" className="absolute left-3 top-3">
                  {item.category}
                </Badge>

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1
                             bg-navy-900/80 px-4 text-center opacity-0 transition-opacity
                             duration-300 group-hover:opacity-100"
                >
                  <p className="font-syne text-lg font-bold text-white">{item.title}</p>
                  <p className="font-inter text-xs uppercase tracking-widest text-gold-400">
                    {item.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-16 flex justify-center">
          <Button href="/portfolio" variant="primary">
            {t('ctaLabel')}
          </Button>
        </div>
      </div>
    </section>
  );
}
