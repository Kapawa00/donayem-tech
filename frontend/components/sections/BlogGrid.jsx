'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import BlogCard from '@/components/ui/BlogCard';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { getBlogCategories, getBlogPosts } from '@/lib/queries';
import { cn } from '@/lib/utils';

export default function BlogGrid() {
  const t = useTranslations('BlogGrid');
  const locale = useLocale();
  const [categories, setCategories] = useState(['Tous']);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBlogCategories()
      .then(({ data }) => setCategories(['Tous', ...data]))
      .catch(() => setCategories(['Tous']));
  }, []);

  const fetchPosts = useCallback(async (category, targetPage, append) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(false);
    }

    try {
      const { data, meta } = await getBlogPosts(
        {
          category: category === 'Tous' ? undefined : category,
          page: targetPage,
        },
        locale
      );

      setPosts((prev) => (append ? [...prev, ...data] : data));
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
    fetchPosts(activeCategory, 1, false);
  }, [activeCategory, fetchPosts]);

  function handleCategoryChange(category) {
    setActiveCategory(category);
  }

  function handleLoadMore() {
    fetchPosts(activeCategory, page + 1, true);
  }

  const hasMore = page < lastPage;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
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
          onRetry={() => fetchPosts(activeCategory, 1, false)}
        />
      ) : posts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <Newspaper size={40} className="text-border" />
          <p className="font-inter text-sm text-muted">{t('emptyMessage')}</p>
        </div>
      ) : (
        <>
          <motion.div
            key={activeCategory}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button variant="outline" loading={loadingMore} onClick={handleLoadMore}>
                {t('loadMore')}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
