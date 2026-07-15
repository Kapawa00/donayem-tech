'use client';

// Next.js interdit `ssr: false` dans un Server Component : ce wrapper client isole
// le lazy-load pour que la page Contact (server, avec metadata) reste inchangée.
import dynamic from 'next/dynamic';

const MapEmbed = dynamic(() => import('@/components/ui/MapEmbed'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
});

export default function ContactMap({ src, title }) {
  return <MapEmbed src={src} title={title} />;
}
