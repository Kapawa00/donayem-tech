import { memo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import Badge from '@/components/ui/Badge';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';

function formatDate(dateString, locale) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function BlogCard({ post }) {
  const locale = useLocale();
  const t = useTranslations('BlogCard');

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="relative aspect-video w-full overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <div className="h-full w-full bg-navy-900/5" />
        )}
        {post.category && (
          <Badge variant="gold" className="absolute left-3 top-3">
            {post.category}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {post.published_at && (
          <span className="font-inter text-xs text-muted">{formatDate(post.published_at, locale)}</span>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-syne text-lg font-bold text-navy-900 transition-colors group-hover:text-gold-500">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="flex-1 font-inter text-sm leading-relaxed text-muted">{post.excerpt}</p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-1 font-inter text-sm font-medium text-gold-600 transition-colors hover:text-gold-400"
        >
          {t('readMore')} →
        </Link>
      </div>
    </article>
  );
}

export default memo(BlogCard);
