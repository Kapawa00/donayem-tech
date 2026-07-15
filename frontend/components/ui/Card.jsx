import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export default function Card({ children, className, onClick, href, ...props }) {
  const classes = cn(
    'rounded-xl border border-gray-100 bg-white p-8 shadow-sm',
    'transition-shadow duration-200 hover:shadow-md',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}
