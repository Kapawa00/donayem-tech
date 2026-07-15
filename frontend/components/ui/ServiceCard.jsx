import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check } from 'lucide-react';

function ServiceCard({ icon: Icon, title, description, features, href }) {
  const t = useTranslations('ServiceCard');

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8
                 shadow-sm transition-colors duration-300 hover:border-gold-400/40"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold-400
                   transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="inline-flex rounded-xl bg-navy-900/5 p-3">
        <Icon className="text-gold-500" size={28} />
      </div>

      <h3 className="mt-4 font-syne text-xl font-bold text-navy-900">{title}</h3>
      <p className="mt-2 font-inter text-sm leading-relaxed text-muted">{description}</p>

      <ul className="mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 font-inter text-sm text-gray-600">
            <Check size={16} className="mt-0.5 shrink-0 text-gold-500" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="mt-4 inline-block font-inter text-sm font-medium text-gold-600 transition-colors hover:text-gold-400"
      >
        {t('learnMore')} →
      </Link>
    </div>
  );
}

export default memo(ServiceCard);
