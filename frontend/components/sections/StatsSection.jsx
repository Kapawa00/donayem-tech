'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { flipInY, staggerContainer } from '@/lib/animations';
import { getStats } from '@/lib/queries';

const STATS_KEYS = [
  { key: 'clients_count', suffixKey: 'clientsSuffix', labelKey: 'clientsLabel' },
  { key: 'projects_count', suffixKey: 'projectsSuffix', labelKey: 'projectsLabel' },
  { key: 'years_experience', suffixKey: 'experienceSuffix', labelKey: 'experienceLabel' },
  { key: 'satisfaction_rate', suffixKey: 'satisfactionSuffix', labelKey: 'satisfactionLabel' },
];

function Counter({ target, suffix, isInView }) {
  const count = useCountUp(target, 1500, isInView);

  return (
    <span className="font-syne text-4xl font-extrabold text-gold-400">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const t = useTranslations('StatsSection');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  const [values, setValues] = useState({});

  const STATS_CONFIG = STATS_KEYS.map(({ key, suffixKey, labelKey }) => ({
    key,
    suffix: t(suffixKey),
    label: t(labelKey),
  }));

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getStats();
      setValues(data);
    } catch (err) {
      setValues({});
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <section className="bg-navy-900 py-14">
      <motion.div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-gold-400/20 px-6 md:grid-cols-4"
        style={{ perspective: 800 }}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {STATS_CONFIG.map((stat) => (
          <motion.div
            key={stat.key}
            variants={shouldReduceMotion ? undefined : flipInY}
            className="flex flex-col items-center justify-center gap-2 px-4 py-4 text-center"
          >
            <Counter target={values[stat.key] ?? 0} suffix={stat.suffix} isInView={isInView} />
            <span className="font-inter text-sm uppercase tracking-widest text-gray-300">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
