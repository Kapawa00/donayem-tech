import { cn } from '@/lib/utils';

export default function TableOfContents({ headings }) {
  if (!headings?.length) return null;

  return (
    <nav aria-label="Table des matières">
      <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">
        Sommaire
      </p>
      <ul className="mt-3 space-y-2 border-l border-border pl-4">
        {headings.map((heading) => (
          <li key={heading.id} className={cn(heading.level === 'h3' && 'pl-3')}>
            <a
              href={`#${heading.id}`}
              className="font-inter text-sm text-muted transition-colors hover:text-gold-500"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
