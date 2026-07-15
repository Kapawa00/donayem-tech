'use client';

// Next.js interdit `ssr: false` dans un Server Component : ce wrapper client isole
// le lazy-load pour que la page d'accueil (server) reste inchangée.
import dynamic from 'next/dynamic';

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-navy-900" />,
});

export default function LazyTestimonialsSection() {
  return <TestimonialsSection />;
}
