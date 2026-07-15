'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LocaleTabs from '@/components/admin/LocaleTabs';
import adminApi from '@/lib/adminAuth';
import { slugify } from '@/lib/blogContent';
import { ICONS } from '@/lib/icon-map';

const CATEGORY_OPTIONS = [
  { value: 'webdesign', label: 'Webdesign' },
  { value: 'marketing', label: 'Marketing digital' },
  { value: 'formation', label: 'Formation bureautique' },
  { value: 'shopify', label: 'Boutique Shopify' },
];

const ICON_OPTIONS = Object.keys(ICONS).map((name) => ({ value: name, label: name }));

const EMPTY_TRANSLATIONS = { fr: '', en: '', de: '' };

const EMPTY_FORM = {
  title: { ...EMPTY_TRANSLATIONS },
  slug: '',
  category: 'webdesign',
  short_description: { ...EMPTY_TRANSLATIONS },
  long_description: { ...EMPTY_TRANSLATIONS },
  icon: ICON_OPTIONS[0].value,
  features: { ...EMPTY_TRANSLATIONS },
  starting_price: '',
  is_active: true,
};

function toTranslations(value) {
  return { ...EMPTY_TRANSLATIONS, ...(value ?? {}) };
}

function featuresToString(features) {
  return Array.isArray(features) ? features.join(', ') : '';
}

export default function AdminServiceFormModal({ item, onClose, onSaved }) {
  const isEditing = Boolean(item);
  const [form, setForm] = useState(
    item
      ? {
          title: toTranslations(item.title),
          slug: item.slug,
          category: item.category,
          short_description: toTranslations(item.short_description),
          long_description: toTranslations(item.long_description),
          icon: item.icon ?? ICON_OPTIONS[0].value,
          features: {
            fr: featuresToString(item.features?.fr),
            en: featuresToString(item.features?.en),
            de: featuresToString(item.features?.de),
          },
          starting_price: item.starting_price ?? '',
          is_active: item.is_active,
        }
      : EMPTY_FORM
  );
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleTranslatedChange(field, locale, value) {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], [locale]: value } }));
  }

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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.fr.trim()) {
      toast.error('Le titre en français est requis.');
      return;
    }

    if (!form.slug.trim()) {
      toast.error('Le slug est requis.');
      return;
    }

    setSaving(true);

    const formData = new FormData();
    ['fr', 'en', 'de'].forEach((locale) => {
      formData.append(`title[${locale}]`, form.title[locale]);
      formData.append(`short_description[${locale}]`, form.short_description[locale]);
      formData.append(`long_description[${locale}]`, form.long_description[locale]);
      form.features[locale]
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean)
        .forEach((feature) => formData.append(`features[${locale}][]`, feature));
    });
    formData.append('slug', form.slug);
    formData.append('category', form.category);
    formData.append('icon', form.icon);
    if (form.starting_price !== '') formData.append('starting_price', form.starting_price);
    formData.append('is_active', form.is_active ? '1' : '0');
    if (file) formData.append('cover_image', file);

    try {
      if (isEditing) {
        formData.append('_method', 'PUT');
        const { data } = await adminApi.post(`/admin/services/${item.id}`, formData);
        toast.success('Service mis à jour.');
        onSaved(data.data);
      } else {
        const { data } = await adminApi.post('/admin/services', formData);
        toast.success('Service ajouté.');
        onSaved(data.data);
      }
    } catch (error) {
      toast.error("Impossible d'enregistrer ce service.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Modifier le service' : 'Ajouter un service'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <LocaleTabs>
          {(locale) => (
            <div className="flex flex-col gap-4">
              <Input
                id={`svc-title-${locale}`}
                label={`Titre (${locale.toUpperCase()})`}
                value={form.title[locale]}
                onChange={(event) => handleTitleChange(locale, event.target.value)}
                required={locale === 'fr'}
              />
              <Input
                id={`svc-short-description-${locale}`}
                label={`Description courte (${locale.toUpperCase()})`}
                textarea
                value={form.short_description[locale]}
                onChange={(event) => handleTranslatedChange('short_description', locale, event.target.value)}
              />
              <Input
                id={`svc-long-description-${locale}`}
                label={`Description détaillée (${locale.toUpperCase()})`}
                textarea
                value={form.long_description[locale]}
                onChange={(event) => handleTranslatedChange('long_description', locale, event.target.value)}
              />
              <Input
                id={`svc-features-${locale}`}
                label={`Points clés (${locale.toUpperCase()}, séparés par une virgule)`}
                value={form.features[locale]}
                onChange={(event) => handleTranslatedChange('features', locale, event.target.value)}
              />
            </div>
          )}
        </LocaleTabs>

        <Input
          id="svc-slug"
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={handleSlugChange}
          placeholder="slug-du-service"
          required
        />
        <Input
          id="svc-category"
          label="Catégorie"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={CATEGORY_OPTIONS}
          required
        />
        <Input
          id="svc-icon"
          label="Icône"
          name="icon"
          value={form.icon}
          onChange={handleChange}
          options={ICON_OPTIONS}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="svc-cover" className="font-inter text-sm font-medium text-dark">
            {isEditing ? "Remplacer l'image (optionnel)" : 'Image de couverture'}
          </label>
          <input
            id="svc-cover"
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="font-inter text-sm text-dark"
          />
        </div>

        <Input
          id="svc-starting-price"
          label="Prix de départ en XAF (optionnel)"
          type="number"
          min="0"
          name="starting_price"
          value={form.starting_price}
          onChange={handleChange}
        />

        <label className="flex items-center gap-3 font-inter text-sm text-dark">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-border accent-gold-400 focus:ring-gold-400/50"
          />
          Service actif (visible sur le site)
        </label>

        <Button type="submit" variant="primary" loading={saving} className="mt-2 w-full">
          Enregistrer
        </Button>
      </form>
    </Modal>
  );
}
