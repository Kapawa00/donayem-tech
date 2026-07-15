import { cn } from '@/lib/utils';

export default function Switch({ id, checked, onChange, label, ariaLabel }) {
  return (
    <label htmlFor={id} className="flex w-fit cursor-pointer items-center gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label ? undefined : ariaLabel}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-pill transition-colors',
          checked ? 'bg-gold-400' : 'bg-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && <span className="font-inter text-sm text-dark">{label}</span>}
    </label>
  );
}
