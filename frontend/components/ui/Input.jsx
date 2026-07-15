import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
  { label, id, className, textarea = false, options, error, ...props },
  ref
) {
  const Component = textarea ? 'textarea' : options ? 'select' : 'input';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="font-inter text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <Component
        id={id}
        ref={ref}
        className={cn(
          'rounded-md border border-border bg-white px-4 py-3',
          'font-inter text-sm text-dark placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400',
          textarea && 'min-h-[140px] resize-y',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/50',
          className
        )}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Component>
      {error && <span className="font-inter text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
