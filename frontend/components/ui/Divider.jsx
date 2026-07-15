import { cn } from '@/lib/utils';

export default function Divider({ className }) {
  return <div className={cn('mx-auto my-4 h-0.5 w-12 bg-gold-400', className)} />;
}
