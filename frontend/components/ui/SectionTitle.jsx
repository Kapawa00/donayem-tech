'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', theme = 'light', className }) {
  const isLeft = align === 'left';
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={cn('flex flex-col', isLeft ? 'items-start text-left' : 'items-center text-center', className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {eyebrow && (
        <span
          className={cn(
            'font-inter text-xs font-medium uppercase tracking-widest',
            isDark ? 'text-gold-400' : 'text-gold-600'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'mt-3 font-syne text-3xl font-bold md:text-4xl',
          isDark ? 'text-white' : 'text-navy-900'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl font-inter text-base',
            isDark ? 'text-gray-300' : 'text-muted',
            isLeft ? '' : 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
