import { cn } from '@/lib/utils';

const COLORS = {
  gold: 'bg-gold-400/10 text-gold-500',
  green: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-gold-600/10 text-gold-700',
  navy: 'bg-navy-900/10 text-navy-700',
};

export default function KpiCard({ label, value, icon: Icon, color = 'navy' }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-inter text-sm text-muted">{label}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', COLORS[color])}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 font-syne text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}
