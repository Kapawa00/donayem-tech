'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 60 : -60, opacity: 0, scale: 0.85 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({ x: direction > 0 ? -60 : 60, opacity: 0, scale: 0.85 }),
};

const reducedSlideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Lightbox({ items, activeIndex, isOpen, onClose, onPrev, onNext, direction = 1 }) {
  const item = activeIndex !== null ? items[activeIndex] : null;
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations('Lightbox');

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm sm:p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="absolute right-4 top-4 text-white/80 transition-colors hover:text-gold-400"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            aria-label={t('previous')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 transition-colors hover:text-gold-400"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative w-[95vw] max-w-3xl sm:w-full" onClick={(event) => event.stopPropagation()}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={item.id}
                custom={direction}
                variants={shouldReduceMotion ? reducedSlideVariants : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 95vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-syne text-xl font-bold text-white">{item.title}</p>
                  <p className="mt-1 font-inter text-sm uppercase tracking-widest text-gold-400">
                    {item.category}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            aria-label={t('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 transition-colors hover:text-gold-400"
          >
            <ChevronRight size={32} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
