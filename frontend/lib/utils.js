import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getLocalizedText(value, locale = 'fr') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[locale] ?? Object.values(value)[0] ?? '';
  }
  return '';
}

export function getInitials(name) {
  if (!name) return '?';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
