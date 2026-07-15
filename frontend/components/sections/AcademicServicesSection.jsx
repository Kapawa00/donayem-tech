'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ErrorState from '@/components/ui/ErrorState';
import SectionTitle from '@/components/ui/SectionTitle';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { getFormations } from '@/lib/queries';

export default function AcademicServicesSection() {
  const t = useTranslations('AcademicServicesSection');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await getFormations({ type: 'academic_service' });
      setServices(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <section className="bg-surface px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionTitle eyebrow={t('eyebrow')} title={t('heading')} />

        {loading ? (
          <div className="mt-12 animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={t('errorMessage')} onRetry={fetchServices} />
        ) : (
          <motion.ul
            className="mt-12 flex flex-col gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {services.map((service) => (
              <motion.li key={service.id} variants={fadeUp} className="flex items-start gap-4">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-gold-400" />
                <div>
                  <h3 className="font-syne text-lg font-bold text-navy-900">{service.title}</h3>
                  <p className="mt-1 font-inter text-sm text-muted">{service.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
