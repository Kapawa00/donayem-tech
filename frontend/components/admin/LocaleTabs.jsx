'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

export default function LocaleTabs({ children, value, onChange }) {
  const [internalActive, setInternalActive] = useState('fr');
  const active = value ?? internalActive;
  const setActive = onChange ?? setInternalActive;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-lg bg-surface p-1">
        {LOCALES.map((locale) => (
          <button
            key={locale.code}
            type="button"
            onClick={() => setActive(locale.code)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 font-inter text-xs font-medium transition-colors',
              active === locale.code ? 'bg-white text-navy-900 shadow-sm' : 'text-muted hover:text-dark'
            )}
          >
            {locale.label}
            {locale.code === 'fr' && <span className="ml-1 text-red-500">*</span>}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
