export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, { event_category: category, event_label: label, value });
  }
};

export const trackPixelEvent = (event, params) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
};

// Événements prédéfinis
export const trackQuoteSubmit = (service) => {
  trackEvent('submit', 'Quote', service);
  trackPixelEvent('Lead', { content_name: service });
};

export const trackPaymentInitiate = (method) => trackEvent('initiate', 'Payment', method);

export const trackContactSubmit = () => trackEvent('submit', 'Contact', 'form');

export const trackServiceView = (service) => trackEvent('view', 'Service', service);

export const trackPurchase = (value, transactionId) => {
  trackEvent('purchase', 'Payment', transactionId, value);
  trackPixelEvent('Purchase', { value, currency: 'XAF' });
};
