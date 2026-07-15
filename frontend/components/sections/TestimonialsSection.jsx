'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import SectionTitle from '@/components/ui/SectionTitle';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { getTestimonials } from '@/lib/queries';

import 'swiper/css';
import 'swiper/css/pagination';

export default function TestimonialsSection() {
  const t = useTranslations('TestimonialsSection');
  const locale = useLocale();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await getTestimonials(locale);
      setTestimonials(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return (
    <section className="bg-gradient-to-b from-navy-900 to-navy-800 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle theme="dark" eyebrow={t('eyebrow')} title={t('title')} />

        {loading ? (
          <LoadingState count={3} className="mt-16 lg:grid-cols-3" />
        ) : error ? (
          <ErrorState
            message={t('errorMessage')}
            onRetry={fetchTestimonials}
          />
        ) : testimonials.length === 0 ? (
          <p className="mt-16 text-center font-inter text-sm text-gray-300">
            {t('emptyMessage')}
          </p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop={testimonials.length > 3}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonials-swiper mt-16 pb-4"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto py-2">
                <TestimonialCard
                  name={testimonial.client_name}
                  company={testimonial.client_company}
                  content={testimonial.content}
                  rating={testimonial.rating}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
