import { cn } from '@/lib/utils';

export default function Loader({ size = 48, className }) {
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full border-4 border-navy-900/20
                   border-t-navy-500 animate-spin"
      />
      <div
        className="absolute inset-2 rounded-full border-4 border-gold-400/20
                   border-b-gold-400 animate-spin-reverse"
      />
    </div>
  );
}

export function PageLoader({ size = 64 }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white/80">
      <Loader size={size} />
    </div>
  );
}
