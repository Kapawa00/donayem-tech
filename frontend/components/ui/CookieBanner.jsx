'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import FacebookPixel from '@/components/analytics/FacebookPixel';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import Button from '@/components/ui/Button';

const CONSENT_KEY = 'donayem_cookie_consent';

export default function CookieBanner({ gaId, fbPixelId }) {
  const t = useTranslations('CookieBanner');
  // undefined = pas encore lu le localStorage (évite le flash du bandeau à l'hydratation
  // pour un visiteur qui a déjà répondu) ; null = aucune préférence enregistrée.
  const [consent, setConsent] = useState(undefined);

  useEffect(() => {
    setConsent(window.localStorage.getItem(CONSENT_KEY));
  }, []);

  function respond(value) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {consent === 'accepted' && gaId && <GoogleAnalytics gaId={gaId} />}
      {consent === 'accepted' && fbPixelId && <FacebookPixel pixelId={fbPixelId} />}

      <AnimatePresence>
        {consent === null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white px-6 py-4 shadow-lg"
          >
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="font-inter text-sm text-dark">{t('message')}</p>
              <div className="flex shrink-0 gap-3">
                <Button variant="ghost" size="sm" onClick={() => respond('refused')}>
                  {t('decline')}
                </Button>
                <Button variant="primary" size="sm" onClick={() => respond('accepted')}>
                  {t('accept')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
