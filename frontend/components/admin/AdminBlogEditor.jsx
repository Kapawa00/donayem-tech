'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, FileX, ImagePlus } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import TagInput from '@/components/ui/TagInput';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import LocaleTabs from '@/components/admin/LocaleTabs';
import { BLOG_CATEGORIES } from '@/data/blogCategories';
import { slugify } from '@/lib/blogContent';
import adminApi from '@/lib/adminAuth';
import { cn } from '@/lib/utils';

const EMPTY_TRANSLATIONS = { fr: '', en: '', de: '' };

const EMPTY_FORM = {
  title: { ...EMPTY_TRANSLATIONS },
  slug: '',
  category: '',
  tags: [],
  excerpt: { ...EMPTY_TRANSLATIONS },
  content: { ...EMPTY_TRANSLATIONS },
  meta_title: { ...EMPTY_TRANSLATIONS },
  meta_description: { ...EMPTY_TRANSLATIONS },
};

const CATEGORY_OPTIONS = [
  { value: '', label: 'Sélectionnez une catégorie' },
  ...BLOG_CATEGORIES.map((category) => ({ value: category, label: category })),
];

function toTranslations(value) {
  return { ...EMPTY_TRANSLATIONS, ...(value ?? {}) };
}

export default function AdminBlogEditor({ id }) {
  const router = useRouter();
  const isEditing = id !== 'new';
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEditing);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState('draft');
  const [publishedAt, setPublishedAt] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(null);
  const [contentLocale, setContentLocale] = useState('fr');
  const [metaLocale, setMetaLocale] = useState('fr');

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    let active = true;

    adminApi
      .get(`/admin/blog/${id}`)
      .then(({ data }) => {
        if (!active) return;
        const post = data.data;
        setForm({
          title: toTranslations(post.title),
          slug: post.slug,
          category: post.category ?? '',
          tags: post.tags ?? [],
          excerpt: toTranslations(post.excerpt),
          content: toTranslations(post.content),
          meta_title: toTranslations(post.meta_title),
          meta_description: toTranslations(post.meta_description),
        });
        setStatus(post.status);
        setPublishedAt(post.published_at);
        setCoverPreview(post.cover_image);
        setSlugTouched(true);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  function handleTitleChange(locale, value) {
    setForm((prev) => ({
      ...prev,
      title: { ...prev.title, [locale]: value },
      slug: locale === 'fr' && !slugTouched ? slugify(value) : prev.slug,
    }));
  }

  function handleSlugChange(event) {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: event.target.value }));
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleTranslatedChange(field, locale, value) {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], [locale]: value } }));
  }

  function handleCoverFile(file) {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    handleCoverFile(event.dataTransfer.files?.[0]);
  }

  async function handleSave(targetStatus) {
    if (!form.title.fr.trim()) {
      toast.error('Le titre en français est requis.');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Le slug est requis.');
      return;
    }
    if (!form.content.fr.trim()) {
      toast.error("Le corps de l'article en français est requis.");
      return;
    }

    setSaving(targetStatus);

    const formData = new FormData();
    ['fr', 'en', 'de'].forEach((locale) => {
      formData.append(`title[${locale}]`, form.title[locale]);
      formData.append(`excerpt[${locale}]`, form.excerpt[locale]);
      formData.append(`content[${locale}]`, form.content[locale]);
      formData.append(`meta_title[${locale}]`, form.meta_title[locale]);
      formData.append(`meta_description[${locale}]`, form.meta_description[locale]);
    });
    formData.append('slug', form.slug);
    formData.append('category', form.category);
    formData.append('status', targetStatus);
    form.tags.forEach((tag) => formData.append('tags[]', tag));
    if (coverFile) formData.append('cover_image', coverFile);

    try {
      if (isEditing) {
        formData.append('_method', 'PUT');
        const { data } = await adminApi.post(`/admin/blog/${id}`, formData);
        setForm((prev) => ({ ...prev, slug: data.data.slug }));
        setStatus(data.data.status);
        setPublishedAt(data.data.published_at);
        setCoverFile(null);
        setCoverPreview(data.data.cover_image);
        setSlugTouched(true);
        toast.success(targetStatus === 'published' ? 'Article publié.' : 'Brouillon enregistré.');
      } else {
        const { data } = await adminApi.post('/admin/blog', formData);
        toast.success(targetStatus === 'published' ? 'Article publié.' : 'Brouillon créé.');
        router.replace(`/admin/blog/${data.data.slug}`);
      }
    } catch (error) {
      const message = error.response?.data?.message ?? "Impossible d'enregistrer l'article.";
      toast.error(message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/blog"
        className="mb-6 flex w-fit items-center gap-1.5 font-inter text-sm text-muted hover:text-dark"
      >
        <ArrowLeft size={16} />
        Retour aux articles
      </Link>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader size={40} />
        </div>
      ) : notFound ? (
        <EmptyState
          icon={FileX}
          title="Article introuvable"
          description="Cet article n'existe pas ou a été supprimé."
          action={
            <Button href="/admin/blog" variant="outline">
              Retour à la liste
            </Button>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <LocaleTabs value={contentLocale} onChange={setContentLocale}>
                {(locale) => (
                  <input
                    id={`blog-title-${locale}`}
                    type="text"
                    value={form.title[locale]}
                    onChange={(event) => handleTitleChange(locale, event.target.value)}
                    placeholder={`Titre de l'article (${locale.toUpperCase()})`}
                    className="w-full border-none bg-transparent font-syne text-3xl font-bold text-navy-900
                               outline-none placeholder:text-muted/50"
                  />
                )}
              </LocaleTabs>
              <div className="mt-3 flex items-center gap-2 font-inter text-sm text-muted">
                <span>/blog/</span>
                <input
                  id="blog-slug"
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="slug-de-larticle"
                  className="flex-1 border-b border-dashed border-border bg-transparent font-inter text-sm
                             text-dark outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <LocaleTabs value={contentLocale} onChange={setContentLocale}>
                {(locale) => (
                  <Input
                    id={`blog-excerpt-${locale}`}
                    label={`Extrait (${locale.toUpperCase()})`}
                    textarea
                    rows={3}
                    value={form.excerpt[locale]}
                    onChange={(event) => handleTranslatedChange('excerpt', locale, event.target.value)}
                    placeholder="Résumé affiché dans la liste des articles"
                  />
                )}
              </LocaleTabs>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <LocaleTabs value={contentLocale} onChange={setContentLocale}>
                {(locale) => (
                  <>
                    <label htmlFor={`blog-content-${locale}`} className="font-inter text-sm font-medium text-dark">
                      Corps de l&apos;article ({locale.toUpperCase()})
                    </label>
                    <div className="mt-3">
                      <MarkdownEditor
                        value={form.content[locale]}
                        onChange={(content) => handleTranslatedChange('content', locale, content)}
                      />
                    </div>
                  </>
                )}
              </LocaleTabs>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">
                Statut
              </p>
              <div className="mt-2">
                <Badge variant={status === 'published' ? 'success' : 'neutral'}>
                  {status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
              {publishedAt && (
                <p className="mt-2 font-inter text-xs text-muted">
                  Publié le{' '}
                  {new Date(publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  loading={saving === 'draft'}
                  disabled={saving !== null}
                  onClick={() => handleSave('draft')}
                  className="w-full"
                >
                  Enregistrer en brouillon
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  loading={saving === 'published'}
                  disabled={saving !== null}
                  onClick={() => handleSave('published')}
                  className="w-full"
                >
                  Publier
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="font-inter text-sm font-medium text-dark">Image de couverture</p>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Ajouter ou remplacer l'image de couverture"
                className={cn(
                  'mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl',
                  'border-2 border-dashed p-6 text-center transition-colors',
                  dragActive ? 'border-gold-400 bg-gold-400/5' : 'border-border hover:border-gold-400/40'
                )}
              >
                {coverPreview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={coverPreview}
                      alt="Aperçu de l'image de couverture"
                      fill
                      sizes="360px"
                      className="object-cover"
                      unoptimized={coverPreview.startsWith('blob:')}
                    />
                  </div>
                ) : (
                  <>
                    <ImagePlus size={28} className="text-muted" />
                    <p className="font-inter text-xs text-muted">
                      Glissez une image ici ou cliquez pour parcourir
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => handleCoverFile(event.target.files?.[0])}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <Input
                id="blog-category"
                label="Catégorie"
                name="category"
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={handleFieldChange}
              />
              <TagInput
                id="blog-tags"
                label="Tags"
                value={form.tags}
                onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
              />
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">SEO</p>
              <LocaleTabs value={metaLocale} onChange={setMetaLocale}>
                {(locale) => (
                  <div className="flex flex-col gap-4">
                    <Input
                      id={`blog-meta-title-${locale}`}
                      label={`Meta title (${locale.toUpperCase()})`}
                      value={form.meta_title[locale]}
                      onChange={(event) => handleTranslatedChange('meta_title', locale, event.target.value)}
                    />
                    <Input
                      id={`blog-meta-description-${locale}`}
                      label={`Meta description (${locale.toUpperCase()})`}
                      textarea
                      rows={3}
                      value={form.meta_description[locale]}
                      onChange={(event) => handleTranslatedChange('meta_description', locale, event.target.value)}
                    />
                  </div>
                )}
              </LocaleTabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
