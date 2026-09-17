import { memo } from 'react';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';

function PortfolioCard({ item, onClick }) {
  const className = 'group relative block aspect-[4/3] w-full overflow-hidden rounded-xl text-left';

  const content = (
    <>
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />

      <Badge variant="gold" className="absolute left-3 top-3">
        {item.category}
      </Badge>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-1
                   bg-navy-900/80 px-4 text-center opacity-0 transition-opacity
                   duration-300 group-hover:opacity-100"
      >
        <p className="font-syne text-lg font-bold text-white">{item.title}</p>
        <p className="font-inter text-xs uppercase tracking-widest text-gold-400">
          {item.category}
        </p>
      </div>
    </>
  );

  if (item.project_url) {
    return (
      <a href={item.project_url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export default memo(PortfolioCard);
