'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import SectionTitle from '@/components/ui/SectionTitle';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ICONS } from '@/lib/icon-map';
import { getFormations } from '@/lib/queries';

const LEVEL_BADGE = {
  Débutant: 'gold',
  Intermédiaire: 'navy',
};

export default function FormationModulesSection() {
  const t = useTranslations('FormationModulesSection');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await getFormations({ type: 'module' });
      setModules(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('heading')}
          subtitle={t('subtitle')}
        />

        {loading ? (
          <LoadingState count={5} className="mt-16 md:grid-cols-2 lg:grid-cols-3" />
        ) : error ? (
          <ErrorState message={t('errorMessage')} onRetry={fetchModules} />
        ) : (
          <motion.div
            className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {modules.map((module) => {
              const Icon = ICONS[module.icon] ?? ICONS.BookOpen;

              return (
                <motion.div
                  key={module.id}
                  variants={fadeUp}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm
                             transition-colors duration-300 hover:border-gold-400/40"
                >
                  <div className="inline-flex w-fit rounded-xl bg-navy-900/5 p-3">
                    <Icon className="text-gold-500" size={28} />
                  </div>

                  <h3 className="mt-4 font-syne text-xl font-bold text-navy-900">{module.title}</h3>
                  <p className="mt-2 font-inter text-sm leading-relaxed text-muted">{module.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {module.duration && (
                      <span className="flex items-center gap-1.5 font-inter text-xs text-muted">
                        <Clock size={14} />
                        {module.duration}
                      </span>
                    )}
                    {module.level && <Badge variant={LEVEL_BADGE[module.level] ?? 'navy'}>{module.level}</Badge>}
                  </div>

                  <Button href="#inscription" variant="outline" size="sm" className="mt-6 w-fit">
                    {t('cta')}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
