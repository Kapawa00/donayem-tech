'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import AdminTestimonialFormModal from '@/components/admin/AdminTestimonialFormModal';
import adminApi from '@/lib/adminAuth';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';

export default function AdminTestimonialsContent() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [formTarget, setFormTarget] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/testimonials', { params: { page } });
      setItems(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error('Impossible de charger les témoignages.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function handleSaved() {
    setFormTarget(undefined);
    fetchItems();
  }

  async function handleToggleActive(item) {
    try {
      const { data } = await adminApi.put(`/admin/testimonials/${item.id}`, {
        is_active: !item.is_active,
      });
      setItems((prev) => prev.map((current) => (current.id === item.id ? data.data : current)));
    } catch (error) {
      toast.error('Impossible de mettre à jour ce témoignage.');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/admin/testimonials/${deleteTarget.id}`);
      toast.success('Témoignage supprimé.');
      setDeleteTarget(null);
      fetchItems();
    } catch (error) {
      toast.error('Impossible de supprimer ce témoignage.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-inter text-sm text-muted">
          Les témoignages affichés sur la page d&apos;accueil.
        </p>
        <Button type="button" variant="primary" onClick={() => setFormTarget(null)}>
          <Plus size={16} />
          Ajouter un témoignage
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={40} />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center font-inter text-sm text-muted">
          Aucun témoignage pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface">
                  {item.client_photo && (
                    <Image
                      src={item.client_photo}
                      alt={item.client_name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-syne text-sm font-bold text-navy-900">{item.client_name}</p>
                  {item.client_company && (
                    <p className="truncate font-inter text-xs text-muted">{item.client_company}</p>
                  )}
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={12}
                        className={index < item.rating ? 'fill-gold-400 text-gold-400' : 'text-border'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:shrink-0 sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item)}
                  className={`shrink-0 rounded-pill px-3 py-1.5 font-inter text-xs font-semibold uppercase tracking-widest ${
                    item.is_active ? 'bg-gold-400/10 text-gold-600' : 'bg-surface text-muted'
                  }`}
                >
                  {item.is_active ? 'Actif' : 'Inactif'}
                </button>

                <div className="flex shrink-0 items-center gap-4">
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
        <AdminTestimonialFormModal
          item={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSaved={handleSaved}
        />
      )}

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer ce témoignage ?"
        maxWidth="max-w-sm"
      >
        <p className="font-inter text-sm text-muted">
          Cette action est définitive. Voulez-vous vraiment supprimer le témoignage de «{' '}
          {deleteTarget?.client_name} » ?
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
