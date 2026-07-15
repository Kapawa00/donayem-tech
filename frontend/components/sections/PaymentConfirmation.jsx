'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import api from '@/lib/api';
import { trackPurchase } from '@/lib/analytics';

export default function PaymentConfirmation() {
  const t = useTranslations('PaymentConfirmation');
  const whatsappUrl = `https://wa.me/237681181456?text=${encodeURIComponent(t('whatsappMessage'))}`;
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('loading');
  const [transactionId, setTransactionId] = useState(searchParams.get('transaction_id'));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setStatus('failed');
      return;
    }

    let active = true;
    setStatus('loading');

    async function checkStatus() {
      try {
        const { data } = await api.get(`/payments/${orderId}/status`);
        const result = data.data ?? data;
        if (!active) return;
        if (result.transaction_id) setTransactionId(result.transaction_id);
        if (result.payment_status === 'success') {
          // Évite de recompter le même achat si la page confirmation est rechargée.
          const trackedKey = `donayem_purchase_tracked_${result.transaction_id}`;
          if (result.transaction_id && !window.sessionStorage.getItem(trackedKey)) {
            trackPurchase(result.amount, result.transaction_id);
            window.sessionStorage.setItem(trackedKey, '1');
          }
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        if (active) setStatus('failed');
      }
    }

    checkStatus();
    return () => {
      active = false;
    };
  }, [orderId, attempt]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <Loader size={48} />
        <p className="font-inter text-sm text-muted">{t('checkingStatus')}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <AnimatedCheck />

        <h1 className="font-syne text-3xl font-bold text-navy-900">{t('successTitle')}</h1>

        {transactionId && (
          <p className="font-inter text-sm text-muted">
            {t('transactionRefLabel')} <span className="font-medium text-dark">{transactionId}</span>
          </p>
        )}

        <p className="font-inter text-sm text-muted">{t('successMessage')}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-gold-400 px-8 py-4
                       font-inter text-sm font-semibold uppercase tracking-widest text-navy-900
                       transition-colors hover:bg-gold-300"
          >
            {t('whatsappCta')}
          </a>
          <Button href="/" variant="outline-dark">
            {t('backHome')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <AnimatedCross />

      <h1 className="font-syne text-3xl font-bold text-navy-900">{t('failedTitle')}</h1>
      <p className="font-inter text-sm text-muted">{t('failedMessage')}</p>

      <Button variant="primary" onClick={() => setAttempt((current) => current + 1)}>
        {t('retry')}
      </Button>
    </div>
  );
}

function AnimatedCheck() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <motion.circle
        cx="48"
        cy="48"
        r="44"
        stroke="#10B981"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <motion.path
        d="M30 50 L43 63 L67 35"
        stroke="#10B981"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function AnimatedCross() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <motion.circle
        cx="48"
        cy="48"
        r="44"
        stroke="#EF4444"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 34 L62 62 M62 34 L34 62"
        stroke="#EF4444"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeInOut' }}
      />
    </svg>
  );
}
