'use client';

import { usePathname } from '@/i18n/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import PageTransitionLoader from '@/components/ui/PageTransitionLoader';
import ScrollProgress from '@/components/ui/ScrollProgress';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { pageVariants } from '@/lib/animations';

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <LocalBusinessSchema />
      <PageTransitionLoader />
      <ScrollProgress />
      <Navbar />
      <main className="pt-[72px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            variants={shouldReduceMotion ? undefined : pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
