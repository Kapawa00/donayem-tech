'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import SectionTitle from '@/components/ui/SectionTitle';
import ServiceCard from '@/components/ui/ServiceCard';
import { fadeUpScale, staggerContainer } from '@/lib/animations';
import { ICONS } from '@/lib/icon-map';
import { getServices } from '@/lib/queries';

export default function ServicesSection() {
  const t = useTranslations('ServicesSection');
  const locale = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await getServices(locale);
      setServices(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {loading ? (
          <LoadingState count={4} className="mt-16 md:grid-cols-2" />
        ) : error ? (
          <ErrorState
            message={t('errorMessage')}
            onRetry={fetchServices}
          />
        ) : (
          <motion.div
            className="mt-16 grid gap-6 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {services.map((service) => (
              <motion.div
                key={service.slug}
                variants={fadeUpScale}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              >
                <ServiceCard
                  icon={ICONS[service.icon] ?? ICONS.Palette}
                  title={service.title}
                  description={service.short_description}
                  features={service.features ?? []}
                  href={`/services/${service.slug}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="font-inter text-base text-muted">
            {t('footerText')}
          </p>
          <Button href="/contact" variant="primary">
            {t('ctaLabel')}
          </Button>
        </div>
      </div>
    </section>
  );
}
