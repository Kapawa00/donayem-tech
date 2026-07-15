'use client';

import { useEffect } from 'react';
import { trackServiceView } from '@/lib/analytics';

export default function ServiceViewTracker({ slug }) {
  useEffect(() => {
    trackServiceView(slug);
  }, [slug]);

  return null;
}
