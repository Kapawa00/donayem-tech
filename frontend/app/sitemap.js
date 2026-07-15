import { services } from '@/data/services';
import { SITE_URL } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STATIC_PATHS = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/formation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'daily' },
  { path: '/a-propos', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/devis', priority: 0.7, changeFrequency: 'monthly' },
];

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchPublishedBlogPosts() {
  // Le sitemap est généré côté build/serveur : si l'API est injoignable, on ne doit
  // jamais bloquer indéfiniment — on retombe silencieusement sur une liste vide.
  const posts = [];
  let page = 1;
  let lastPage = 1;

  try {
    do {
      const response = await fetchWithTimeout(`${API_URL}/blog?page=${page}`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) break;

      const body = await response.json();
      (body.data ?? []).forEach((post) => {
        posts.push({ slug: post.slug, publishedAt: post.published_at });
      });

      lastPage = body.meta?.last_page ?? 1;
      page += 1;
    } while (page <= lastPage);
  } catch (error) {
    return posts;
  }

  return posts;
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const serviceEntries = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogPosts = await fetchPublishedBlogPosts();
  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
