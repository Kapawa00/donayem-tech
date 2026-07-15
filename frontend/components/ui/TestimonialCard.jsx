import { memo } from 'react';
import { Star } from 'lucide-react';

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ name, company, content, rating }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-gold-400 text-gold-400' : 'text-white/20'}
          />
        ))}
      </div>

      <p className="flex-1 font-inter text-sm italic leading-relaxed text-gray-200">
        &ldquo;{content}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/20 font-syne text-sm font-bold text-gold-400">
          {getInitials(name)}
        </div>
        <div>
          <p className="font-inter text-sm font-semibold text-white">{name}</p>
          <p className="font-inter text-xs text-gray-400">{company}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(TestimonialCard);
