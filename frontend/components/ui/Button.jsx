'use client';

import NextLink from 'next/link';
import { Link as IntlLink } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Loader from './Loader';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-gold-400 text-navy-900 hover:bg-gold-300',
  outline: 'border border-gold-400 text-gold-400 hover:bg-gold-400/10',
  ghost: 'bg-transparent text-muted hover:text-dark',
  dark: 'bg-navy-900 text-white hover:bg-navy-800',
  'outline-dark': 'border border-navy-900 text-navy-900 hover:bg-navy-900/10',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

function Shimmer() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r
                 from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out
                 group-hover:translate-x-[400%]"
    />
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  href,
  className,
  children,
  onClick,
  ...props
}) {
  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill',
    'font-inter font-semibold uppercase tracking-widest text-sm',
    'transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  );

  const content = loading ? <Loader size={18} /> : children;
  const isDisabled = disabled || loading;
  const showShimmer = variant === 'primary' && !isDisabled;

  if (href && !isDisabled) {
    // Les routes /admin/* ne sont pas préfixées par une locale (panneau interne,
    // français uniquement) : on utilise next/link brut pour ne pas y injecter /fr, /en, /de.
    const LinkComponent = href.startsWith('/admin') ? NextLink : IntlLink;

    return (
      <motion.span whileTap={{ scale: 0.97 }} className="inline-block">
        <LinkComponent href={href} className={classes}>
          {showShimmer && <Shimmer />}
          {content}
        </LinkComponent>
      </motion.span>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {showShimmer && <Shimmer />}
      {content}
    </motion.button>
  );
}
