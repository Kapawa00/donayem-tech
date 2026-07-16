'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import AdminPortfolioFormModal from '@/components/admin/AdminPortfolioFormModal';
import adminApi from '@/lib/adminAuth';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';
import { getLocalizedText } from '@/lib/utils';

export default function AdminPortfolioContent() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [formTarget, setFormTarget] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/portfolio', {
        params: { page, category: category || undefined },
      });
      setItems(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error('Impossible de charger le portfolio.');
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function handleSaved() {
    setFormTarget(undefined);
    fetchItems();
  }

  async function handleToggleFeatured(item) {
    try {
      const { data } = await adminApi.post(`/admin/portfolio/${item.id}/toggle-featured`);
      setItems((prev) => prev.map((current) => (current.id === item.id ? data.data : current)));
    } catch (error) {
      toast.error('Impossible de mettre à jour cet élément.');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/admin/portfolio/${deleteTarget.id}`);
      toast.success('Réalisation supprimée.');
      setDeleteTarget(null);
      fetchItems();
    } catch (error) {
      toast.error('Impossible de supprimer cette réalisation.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full max-w-xs">
          <Input
            id="portfolio-category-filter"
            label="Filtrer par catégorie"
            value={category}
            onChange={(event) => {
              setPage(1);
              setCategory(event.target.value);
            }}
            placeholder="ex. Identité visuelle"
          />
        </div>
        <Button type="button" variant="primary" onClick={() => setFormTarget(null)}>
          <Plus size={16} />
          Ajouter une réalisation
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={40} />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center font-inter text-sm text-muted">
          Aucune réalisation pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full bg-surface">
                {(item.thumbnail_url || item.media_url) && (
                  <Image
                    src={item.thumbnail_url || item.media_url}
                    alt={getLocalizedText(item.title)}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(item)}
                  aria-label={item.is_featured ? 'Retirer la mise en avant' : 'Mettre en avant'}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
                >
                  <Star
                    size={16}
                    className={item.is_featured ? 'fill-gold-400 text-gold-400' : 'text-muted'}
                  />
                </button>
              </div>

              <div className="p-4">
                <p className="font-syne text-sm font-bold text-navy-900">{getLocalizedText(item.title)}</p>
                <p className="mt-1 font-inter text-xs uppercase tracking-widest text-gold-600">
                  {item.category}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormTarget(item)}
                    className="flex items-center gap-1.5 font-inter text-sm font-medium text-navy-700 hover:text-navy-900"
                  >
                    <Pencil size={14} />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="flex items-center gap-1.5 font-inter text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Précédent
          </Button>
          <span className="font-inter text-xs text-muted">
            Page {meta.current_page} / {meta.last_page}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= meta.last_page}
            onClick={() => setPage((current) => current + 1)}
          >
            Suivant
          </Button>
        </div>
      )}

      {formTarget !== undefined && (
        <AdminPortfolioFormModal
          item={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSaved={handleSaved}
        />
      )}

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer cette réalisation ?"
        maxWidth="max-w-sm"
      >
        <p className="font-inter text-sm text-muted">
          Cette action est définitive. Voulez-vous vraiment supprimer « {getLocalizedText(deleteTarget?.title)} » ?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={deleting}
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
