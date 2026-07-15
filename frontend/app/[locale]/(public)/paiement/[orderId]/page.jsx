'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { trackPaymentInitiate } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function PaiementPage({ params }) {
  const { orderId } = params;
  const t = useTranslations('PaiementOrderPage');
  const locale = useLocale();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const PAYMENT_METHODS = [
    {
      id: 'orange_money',
      label: t('orangeMoneyLabel'),
      description: t('orangeMoneyDescription'),
      mark: <OrangeMoneyMark />,
    },
    {
      id: 'mtn_momo',
      label: t('mtnMomoLabel'),
      description: t('mtnMomoDescription'),
      mark: <MtnMomoMark />,
    },
    {
      id: 'card',
      label: t('cardLabel'),
      description: t('cardDescription'),
      mark: <CardBrandMarks />,
    },
  ];

  useEffect(() => {
    let active = true;

    async function fetchOrder() {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        if (active) setOrder(data.data ?? data);
      } catch (error) {
        if (active) toast.error(t('loadError'));
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrder();
    return () => {
      active = false;
    };
  }, [orderId, t]);

  async function handlePay() {
    if (!method || !order) return;
    setSubmitting(true);

    try {
      const { data } = await api.post('/payments/initiate', {
        order_id: order.id,
        payment_method: method,
      });
      trackPaymentInitiate(method);
      window.location.href = data.payment_url;
    } catch (error) {
      toast.error(t('genericError'));
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <section className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-syne text-2xl font-bold text-navy-900">{t('orderNotFoundHeading')}</h1>
        <p className="font-inter text-sm text-muted">{t('orderNotFoundDescription')}</p>
        <Button href="/contact" variant="primary">
          {t('contactButton')}
        </Button>
      </section>
    );
  }

  return (
    <section className="bg-surface px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-start">
        <div className="rounded-2xl bg-navy-900 p-8 text-white md:sticky md:top-28">
          <p className="font-inter text-xs font-medium uppercase tracking-widest text-gold-400">
            {t('orderSummary')}
          </p>
          <p className="mt-2 font-syne text-xl font-bold">{order.reference}</p>

          <dl className="mt-8 space-y-4 font-inter text-sm text-gray-300">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <dt>{t('serviceLabel')}</dt>
              <dd className="text-right text-white">{order.service_description}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <dt>{t('clientLabel')}</dt>
              <dd className="text-white">{order.client_name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2">
              <dt className="font-syne text-base font-bold text-white">{t('totalLabel')}</dt>
              <dd className="font-syne text-2xl font-extrabold text-gold-400">
                {Number(order.amount).toLocaleString(locale)} XAF
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h1 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">
            {t('chooseMethodHeading')}
          </h1>

          <div className="mt-8 flex flex-col gap-4">
            {PAYMENT_METHODS.map((option) => {
              const isSelected = method === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMethod(option.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border-2 border-transparent bg-white p-4',
                    'text-left shadow-sm transition-colors',
                    isSelected ? 'border-gold-400' : 'hover:border-gold-400/30'
                  )}
                >
                  {option.mark}
                  <span className="flex-1">
                    <span className="block font-syne text-base font-bold text-navy-900">
                      {option.label}
                    </span>
                    <span className="block font-inter text-xs text-muted">{option.description}</span>
                  </span>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      isSelected ? 'border-gold-400 bg-gold-400' : 'border-border'
                    )}
                  >
                    {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-10 w-full"
            disabled={!method}
            loading={submitting}
            onClick={handlePay}
          >
            {t('payButton')}
          </Button>
        </div>
      </div>
    </section>
  );
}

function OrangeMoneyMark() {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: '#FF7900' }}
    >
      OM
    </div>
  );
}

function MtnMomoMark() {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-center text-[10px] font-bold leading-tight text-dark"
      style={{ backgroundColor: '#FFCB00' }}
    >
      MoMo
    </div>
  );
}

function CardBrandMarks() {
  return (
    <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
      <svg width="34" height="22" viewBox="0 0 48 30">
        <rect width="48" height="30" rx="4" fill="#1A1F71" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fontSize="12"
          fontStyle="italic"
          fontWeight="700"
          fill="#fff"
          fontFamily="Arial, sans-serif"
        >
          VISA
        </text>
      </svg>
      <svg width="34" height="22" viewBox="0 0 48 30">
        <rect width="48" height="30" rx="4" fill="#fff" stroke="#E5E7EB" />
        <circle cx="19" cy="15" r="9" fill="#EB001B" />
        <circle cx="29" cy="15" r="9" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
      <svg width="34" height="22" viewBox="0 0 48 30">
        <rect width="48" height="30" rx="4" fill="#050A22" />
        <text
          x="24"
          y="19"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#D4A336"
          fontFamily="Arial, sans-serif"
        >
          IBAN
        </text>
      </svg>
    </div>
  );
}
