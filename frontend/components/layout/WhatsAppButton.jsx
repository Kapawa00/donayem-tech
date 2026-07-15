'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const t = useTranslations('WhatsApp');
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '237681181456';
  const message = encodeURIComponent(t('prefillMessage'));
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="group fixed bottom-6 right-6 z-50 flex items-center">
      <span
        className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md
                   bg-navy-900 px-3 py-1.5 font-inter text-xs font-medium text-white opacity-0
                   shadow-md transition-opacity duration-200 group-hover:opacity-100"
      >
        {t('tooltip')}
      </span>

      <motion.a
        href={`https://wa.me/${number}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('ariaLabel')}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -4 }}
      >
        <MessageCircle size={26} />
      </motion.a>
    </div>
  );
}
