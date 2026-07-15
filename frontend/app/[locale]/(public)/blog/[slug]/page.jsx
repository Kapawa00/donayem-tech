import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import BlogCard from '@/components/ui/BlogCard';
import Button from '@/components/ui/Button';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import { parseHeadings } from '@/lib/blogContent';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';
import { getBlogPost, getBlogPosts } from '@/lib/queries';
import { SITE_URL } from '@/lib/seo';

export async function generateStaticParams() {
  const slugs = [];
  let page = 1;
  let lastPage = 1;

  try {
    do {
      const { data, meta } = await getBlogPosts({ page });
      data.forEach((post) => slugs.push({ slug: post.slug }));
      lastPage = meta?.last_page ?? 1;
      page += 1;
    } while (page <= lastPage);
  } catch (error) {
    return slugs;
  }

  return slugs;
}

async function fetchPost(slug, locale) {
  try {
    const { data } = await getBlogPost(slug, locale);
    return data;
  } catch (error) {
    return null;
  }
}

async function fetchRelatedPosts(post, locale) {
  if (!post.category) return [];

  try {
    const { data } = await getBlogPosts({ category: post.category, per_page: 4 }, locale);
    return data.filter((item) => item.slug !== post.slug).slice(0, 3);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await fetchPost(params.slug, params.locale);

  if (!post) {
    return {};
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'BlogPostPage' });
  const post = await fetchPost(params.slug, locale);

  if (!post) {
    notFound();
  }

  const { content, headings } = parseHeadings(post.content ?? '');
  const relatedPosts = await fetchRelatedPosts(post, locale);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <section className="bg-navy-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <nav className="flex flex-wrap items-center gap-2 font-inter text-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-gold-400">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="transition-colors hover:text-gold-400">
              {t('breadcrumbBlog')}
            </Link>
            <ChevronRight size={14} />
            <span className="line-clamp-1 text-gold-400">{post.title}</span>
          </nav>

          {post.category && (
            <Badge variant="gold" className="mt-4">
              {post.category}
            </Badge>
          )}

          <h1 className="mt-4 font-syne text-4xl font-extrabold leading-tight md:text-4xl">
            {post.title}
          </h1>

          {post.published_at && (
            <p className="mt-4 font-inter text-sm text-gray-400">
              {new Date(post.published_at).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {post.author && ` · ${post.author}`}
            </p>
          )}
        </div>
      </section>

      {post.cover_image && (
        <div className="mx-auto -mt-8 max-w-4xl px-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-md">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-8">
              <TableOfContents headings={headings} />
              <ShareButtons url={postUrl} title={post.title} />
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-syne text-2xl font-bold text-navy-900">{t('relatedPostsHeading')}</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-gold-400 to-gold-500 px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="font-syne text-3xl font-extrabold text-navy-900">{t('ctaHeading')}</h2>
          <Button href="/contact" variant="dark">
            {t('ctaButton')}
          </Button>
        </div>
      </section>
    </>
  );
}
