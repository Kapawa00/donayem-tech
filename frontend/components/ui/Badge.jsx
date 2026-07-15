import { cn } from '@/lib/utils';

const variants = {
  navy: 'bg-navy-900/10 text-navy-700',
  gold: 'bg-gold-400/15 text-gold-600',
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-600',
};

export default function Badge({ children, variant = 'navy', className }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-1',
        'font-inter text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
