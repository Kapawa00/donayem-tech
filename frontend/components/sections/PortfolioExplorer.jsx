'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { getPortfolio, getPortfolioCategories } from '@/lib/queries';
import { cn } from '@/lib/utils';

// Chargé uniquement à la première ouverture (déjà 'use client' ici, donc ssr:false est autorisé).
const Lightbox = dynamic(() => import('@/components/ui/Lightbox'), { ssr: false });

const PAGE_SIZE = 6;

export default function PortfolioExplorer() {
  const t = useTranslations('PortfolioExplorer');
  const locale = useLocale();
  const [categories, setCategories] = useState(['Tous']);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const [hasOpenedLightbox, setHasOpenedLightbox] = useState(false);

  useEffect(() => {
    getPortfolioCategories()
      .then(({ data }) => setCategories(['Tous', ...data]))
      .catch(() => setCategories(['Tous']));
  }, []);

  const fetchItems = useCallback(async (category, targetPage, append) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(false);
    }

    try {
      const { data, meta } = await getPortfolio(
        {
          category: category === 'Tous' ? undefined : category,
          page: targetPage,
          per_page: PAGE_SIZE,
        },
        locale
      );

      const mapped = data.map((item) => ({ ...item, image: item.thumbnail_url || item.media_url }));
      setItems((prev) => (append ? [...prev, ...mapped] : mapped));
      setLastPage(meta?.last_page ?? 1);
      setPage(targetPage);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchItems(activeCategory, 1, false);
  }, [activeCategory, fetchItems]);

  function handleCategoryChange(category) {
    setActiveCategory(category);
  }

  function handleLoadMore() {
    fetchItems(activeCategory, page + 1, true);
  }

  function openLightbox(item) {
    setHasOpenedLightbox(true);
    setLightboxIndex(items.findIndex((i) => i.id === item.id));
  }

  function handlePrev() {
    setDirection(-1);
    setLightboxIndex((index) => (index - 1 + items.length) % items.length);
  }

  function handleNext() {
    setDirection(1);
    setLightboxIndex((index) => (index + 1) % items.length);
  }

  const hasMore = page < lastPage;

  return (
    <section className="bg-surface px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            const label = category === 'Tous' ? t('allCategory') : category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  'rounded-pill border px-4 py-2 font-inter text-sm font-medium transition-colors',
                  isActive
                    ? 'border-gold-400 bg-gold-400 text-navy-900'
                    : 'border-border bg-transparent text-muted hover:border-gold-400/40 hover:text-navy-900'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <LoadingState count={6} className="mt-12" />
        ) : error ? (
          <ErrorState
            message={t('errorMessage')}
            onRetry={() => fetchItems(activeCategory, 1, false)}
          />
        ) : (
          <>
            <motion.div
              key={activeCategory}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {items.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <PortfolioCard item={item} onClick={() => openLightbox(item)} />
                </motion.div>
              ))}
            </motion.div>

            {items.length === 0 && (
              <p className="mt-12 text-center font-inter text-sm text-muted">
                {t('emptyMessage')}
              </p>
            )}

            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" loading={loadingMore} onClick={handleLoadMore}>
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {hasOpenedLightbox && (
        <Lightbox
          items={items}
          activeIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          direction={direction}
        />
      )}
    </section>
  );
}
