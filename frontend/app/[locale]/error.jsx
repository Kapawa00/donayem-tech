'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeDown } from '@/lib/animations';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-6 text-center">
      <motion.div
        className="flex flex-col items-center"
        variants={fadeDown}
        initial="hidden"
        animate="visible"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-400/10">
          <AlertTriangle size={48} className="text-gold-400" strokeWidth={1.5} />
        </div>

        <h1 className="mt-8 font-syne text-3xl font-bold text-white">Une erreur s&apos;est produite</h1>
        <p className="mt-4 max-w-md font-inter text-gray-300">
          Quelque chose s&apos;est mal passé de notre côté. Vous pouvez réessayer ou revenir à
          l&apos;accueil.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button type="button" variant="primary" onClick={reset}>
            Réessayer
          </Button>
          <Button href="/" variant="outline">
            Retour à l&apos;accueil
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
