'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import AdminServiceFormModal from '@/components/admin/AdminServiceFormModal';
import adminApi from '@/lib/adminAuth';
import { BLUR_DATA_URL } from '@/lib/blurPlaceholder';

const CATEGORY_LABELS = {
  webdesign: 'Webdesign',
  marketing: 'Marketing digital',
  formation: 'Formation bureautique',
  shopify: 'Boutique Shopify',
};

export default function AdminServicesContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formTarget, setFormTarget] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/services');
      setItems(data.data);
    } catch (error) {
      toast.error('Impossible de charger les services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function handleSaved() {
    setFormTarget(undefined);
    fetchItems();
  }

  async function handleToggleActive(item) {
    try {
      const { data } = await adminApi.put(`/admin/services/${item.id}`, {
        is_active: !item.is_active,
      });
      setItems((prev) => prev.map((current) => (current.id === item.id ? data.data : current)));
    } catch (error) {
      toast.error('Impossible de mettre à jour ce service.');
    }
  }

  async function handleMove(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    setReordering(true);
    setItems(reordered);
    try {
      await adminApi.post('/admin/services/reorder', { ids: reordered.map((item) => item.id) });
    } catch (error) {
      toast.error("Impossible de réordonner les services.");
      fetchItems();
    } finally {
      setReordering(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/admin/services/${deleteTarget.id}`);
      toast.success('Service supprimé.');
      setDeleteTarget(null);
      fetchItems();
    } catch (error) {
      toast.error('Impossible de supprimer ce service.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-inter text-sm text-muted">
          Les services affichés sur la page d&apos;accueil, dans l&apos;ordre ci-dessous.
        </p>
        <Button type="button" variant="primary" onClick={() => setFormTarget(null)}>
          <Plus size={16} />
          Ajouter un service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={40} />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center font-inter text-sm text-muted">
          Aucun service pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  disabled={index === 0 || reordering}
                  onClick={() => handleMove(index, -1)}
                  aria-label="Monter"
                  className="text-muted hover:text-dark disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1 || reordering}
                  onClick={() => handleMove(index, 1)}
                  aria-label="Descendre"
                  className="text-muted hover:text-dark disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                {item.cover_image && (
                  <Image
                    src={item.cover_image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-syne text-sm font-bold text-navy-900">{item.title}</p>
                <p className="mt-1 font-inter text-xs uppercase tracking-widest text-gold-600">
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleActive(item)}
                className={`shrink-0 rounded-pill px-3 py-1.5 font-inter text-xs font-semibold uppercase tracking-widest ${
                  item.is_active
                    ? 'bg-gold-400/10 text-gold-600'
                    : 'bg-surface text-muted'
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
          ))}
        </div>
      )}

      {formTarget !== undefined && (
        <AdminServiceFormModal
          item={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSaved={handleSaved}
        />
      )}

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer ce service ?"
        maxWidth="max-w-sm"
      >
        <p className="font-inter text-sm text-muted">
          Cette action est définitive. Voulez-vous vraiment supprimer « {deleteTarget?.title} » ?
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
