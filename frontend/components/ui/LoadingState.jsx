import { cn } from '@/lib/utils';

export default function LoadingState({ count = 6, className }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
