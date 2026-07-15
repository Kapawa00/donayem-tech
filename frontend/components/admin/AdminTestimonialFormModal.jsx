'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LocaleTabs from '@/components/admin/LocaleTabs';
import adminApi from '@/lib/adminAuth';

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: `${value} étoile${value > 1 ? 's' : ''}` }));

const EMPTY_TRANSLATIONS = { fr: '', en: '', de: '' };

const EMPTY_FORM = {
  client_name: '',
  client_company: '',
  content: { ...EMPTY_TRANSLATIONS },
  rating: '5',
  service_category: '',
  is_active: true,
};

function toTranslations(value) {
  return { ...EMPTY_TRANSLATIONS, ...(value ?? {}) };
}

export default function AdminTestimonialFormModal({ item, onClose, onSaved }) {
  const isEditing = Boolean(item);
  const [form, setForm] = useState(
    item
      ? {
          client_name: item.client_name,
          client_company: item.client_company ?? '',
          content: toTranslations(item.content),
          rating: String(item.rating),
          service_category: item.service_category ?? '',
          is_active: item.is_active,
        }
      : EMPTY_FORM
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleContentChange(locale, value) {
    setForm((prev) => ({ ...prev, content: { ...prev.content, [locale]: value } }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.client_name.trim()) {
      toast.error('Le nom du client est requis.');
      return;
    }

    if (!form.content.fr.trim()) {
      toast.error('Le témoignage en français est requis.');
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append('client_name', form.client_name);
    formData.append('client_company', form.client_company);
    ['fr', 'en', 'de'].forEach((locale) => {
      formData.append(`content[${locale}]`, form.content[locale]);
    });
    formData.append('rating', form.rating);
    formData.append('service_category', form.service_category);
    formData.append('is_active', form.is_active ? '1' : '0');
    if (file) formData.append('client_photo', file);

    try {
      if (isEditing) {
        formData.append('_method', 'PUT');
        const { data } = await adminApi.post(`/admin/testimonials/${item.id}`, formData);
        toast.success('Témoignage mis à jour.');
        onSaved(data.data);
      } else {
        const { data } = await adminApi.post('/admin/testimonials', formData);
        toast.success('Témoignage ajouté.');
        onSaved(data.data);
      }
    } catch (error) {
      toast.error("Impossible d'enregistrer ce témoignage.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="tm-client-name"
          label="Nom du client"
          name="client_name"
          value={form.client_name}
          onChange={handleChange}
          required
        />
        <Input
          id="tm-client-company"
          label="Entreprise (optionnel)"
          name="client_company"
          value={form.client_company}
          onChange={handleChange}
        />

        <LocaleTabs>
          {(locale) => (
            <Input
              id={`tm-content-${locale}`}
              label={`Témoignage (${locale.toUpperCase()})`}
              textarea
              value={form.content[locale]}
              onChange={(event) => handleContentChange(locale, event.target.value)}
              required={locale === 'fr'}
            />
          )}
        </LocaleTabs>

        <Input
          id="tm-rating"
          label="Note"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          options={RATING_OPTIONS}
          required
        />
        <Input
          id="tm-service-category"
          label="Catégorie de service (optionnel)"
          name="service_category"
          value={form.service_category}
          onChange={handleChange}
          placeholder="ex. webdesign, marketing, formation, shopify"
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="tm-photo" className="font-inter text-sm font-medium text-dark">
            {isEditing ? 'Remplacer la photo (optionnel)' : 'Photo du client (optionnel)'}
          </label>
          <input
            id="tm-photo"
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="font-inter text-sm text-dark"
          />
        </div>

        <label className="flex items-center gap-3 font-inter text-sm text-dark">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-border accent-gold-400 focus:ring-gold-400/50"
          />
          Témoignage actif (visible sur le site)
        </label>

        <Button type="submit" variant="primary" loading={saving} className="mt-2 w-full">
          Enregistrer
        </Button>
      </form>
    </Modal>
  );
}
