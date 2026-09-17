'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LocaleTabs from '@/components/admin/LocaleTabs';
import adminApi from '@/lib/adminAuth';

const EMPTY_TRANSLATIONS = { fr: '', en: '', de: '' };

const EMPTY_FORM = {
  title: { ...EMPTY_TRANSLATIONS },
  category: '',
  description: { ...EMPTY_TRANSLATIONS },
  client_name: '',
  project_url: '',
  completion_date: '',
  tags: '',
  is_featured: false,
};

function toTranslations(value) {
  return { ...EMPTY_TRANSLATIONS, ...(value ?? {}) };
}

export default function AdminPortfolioFormModal({ item, onClose, onSaved }) {
  const isEditing = Boolean(item);
  const [form, setForm] = useState(
    item
      ? {
          title: toTranslations(item.title),
          category: item.category,
          description: toTranslations(item.description),
          client_name: item.client_name ?? '',
          project_url: item.project_url ?? '',
          completion_date: item.completion_date ?? '',
          tags: item.tags?.join(', ') ?? '',
          is_featured: item.is_featured,
        }
      : EMPTY_FORM
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleTranslatedChange(field, locale, value) {
    setForm((prev) => ({ ...prev, [field]: { ...prev[field], [locale]: value } }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isEditing && !file) {
      toast.error('Veuillez sélectionner un fichier (image ou vidéo).');
      return;
    }

    if (!form.title.fr.trim()) {
      toast.error('Le titre en français est requis.');
      return;
    }

    setSaving(true);

    const formData = new FormData();
    ['fr', 'en', 'de'].forEach((locale) => {
      formData.append(`title[${locale}]`, form.title[locale]);
      formData.append(`description[${locale}]`, form.description[locale]);
    });
    formData.append('category', form.category);
    formData.append('client_name', form.client_name);
    if (form.project_url) formData.append('project_url', form.project_url);
    if (form.completion_date) formData.append('completion_date', form.completion_date);
    formData.append('is_featured', form.is_featured ? '1' : '0');
    form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => formData.append('tags[]', tag));
    if (file) formData.append('media', file);

    try {
      if (isEditing) {
        formData.append('_method', 'PUT');
        const { data } = await adminApi.post(`/admin/portfolio/${item.id}`, formData);
        toast.success('Réalisation mise à jour.');
        onSaved(data.data);
      } else {
        const { data } = await adminApi.post('/admin/portfolio', formData);
        toast.success('Réalisation ajoutée.');
        onSaved(data.data);
      }
    } catch (error) {
      toast.error("Impossible d'enregistrer cette réalisation.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <LocaleTabs>
          {(locale) => (
            <div className="flex flex-col gap-4">
              <Input
                id={`pf-title-${locale}`}
                label={`Titre (${locale.toUpperCase()})`}
                value={form.title[locale]}
                onChange={(event) => handleTranslatedChange('title', locale, event.target.value)}
                required={locale === 'fr'}
              />
              <Input
                id={`pf-description-${locale}`}
                label={`Description (${locale.toUpperCase()})`}
                textarea
                value={form.description[locale]}
                onChange={(event) => handleTranslatedChange('description', locale, event.target.value)}
              />
            </div>
          )}
        </LocaleTabs>

        <Input
          id="pf-category"
          label="Catégorie"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="pf-media" className="font-inter text-sm font-medium text-dark">
            {isEditing ? 'Remplacer le fichier (optionnel)' : 'Image ou vidéo'}
          </label>
          <input
            id="pf-media"
            type="file"
            accept="image/*,video/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="font-inter text-sm text-dark"
          />
        </div>

        <Input
          id="pf-client"
          label="Client (optionnel)"
          name="client_name"
          value={form.client_name}
          onChange={handleChange}
        />
        <Input
          id="pf-project-url"
          label="Lien du projet (optionnel)"
          type="url"
          name="project_url"
          placeholder="https://..."
          value={form.project_url}
          onChange={handleChange}
        />
        <Input
          id="pf-date"
          label="Date de réalisation (optionnel)"
          type="date"
          name="completion_date"
          value={form.completion_date}
          onChange={handleChange}
        />
        <Input
          id="pf-tags"
          label="Tags (séparés par une virgule)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
        />

        <label className="flex items-center gap-3 font-inter text-sm text-dark">
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-border accent-gold-400 focus:ring-gold-400/50"
          />
          Mettre en avant (featured)
        </label>

        <Button type="submit" variant="primary" loading={saving} className="mt-2 w-full">
          Enregistrer
        </Button>
      </form>
    </Modal>
  );
}
