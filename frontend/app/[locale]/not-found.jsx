'use client';

import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fadeDown } from '@/lib/animations';

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-6 text-center">
      <motion.div
        className="flex flex-col items-center"
        variants={fadeDown}
        initial="hidden"
        animate="visible"
      >
        <span
          aria-hidden="true"
          className="select-none font-syne text-9xl font-extrabold text-gold-400/20"
        >
          404
        </span>

        <SearchX size={72} className="-mt-8 text-gold-400" strokeWidth={1.5} />

        <h1 className="mt-8 font-syne text-3xl font-bold text-white">Page introuvable</h1>
        <p className="mt-4 max-w-md font-inter text-gray-300">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary">
            Retour à l&apos;accueil
          </Button>
          <Button href="/contact" variant="outline">
            Nous contacter
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
