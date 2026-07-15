'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import adminApi from '@/lib/adminAuth';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' },
];

const STATUS_VARIANT = { draft: 'neutral', published: 'success' };

export default function AdminBlogContent() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/blog', {
        params: { page, status: status || undefined },
      });
      setPosts(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error('Impossible de charger les articles.');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleTogglePublish(post) {
    setTogglingId(post.id);
    const action = post.status === 'published' ? 'unpublish' : 'publish';
    try {
      const { data } = await adminApi.post(`/admin/blog/${post.slug}/${action}`);
      setPosts((prev) => prev.map((item) => (item.id === post.id ? data.data : item)));
      toast.success(action === 'publish' ? 'Article publié.' : 'Article dépublié.');
    } catch (error) {
      toast.error("Impossible de mettre à jour le statut de l'article.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/admin/blog/${deleteTarget.slug}`);
      toast.success('Article supprimé.');
      setDeleteTarget(null);
      fetchPosts();
    } catch (error) {
      toast.error('Impossible de supprimer cet article.');
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: 'title', header: 'Titre' },
    { key: 'category', header: 'Catégorie', render: (row) => row.category || '—' },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'}>
          {row.status === 'published' ? 'Publié' : 'Brouillon'}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) =>
        new Date(row.published_at ?? row.created_at).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/blog/${row.slug}`}
            className="flex items-center gap-1.5 font-inter text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            <Pencil size={14} />
            Modifier
          </Link>
          <button
            type="button"
            onClick={() => handleTogglePublish(row)}
            disabled={togglingId === row.id}
            className="flex items-center gap-1.5 font-inter text-sm font-medium text-gold-600
                       hover:text-gold-500 disabled:pointer-events-none disabled:opacity-50"
          >
            {row.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
            {row.status === 'published' ? 'Dépublier' : 'Publier'}
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex items-center gap-1.5 font-inter text-sm font-medium text-red-500 hover:text-red-600"
          >
            <Trash2 size={14} />
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full max-w-xs">
          <Input
            id="blog-status-filter"
            label="Filtrer par statut"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
          />
        </div>
        <Button href="/admin/blog/new" variant="primary">
          <Plus size={16} />
          Nouvel article
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        emptyMessage="Aucun article pour le moment."
        pagination={{
          currentPage: meta.current_page,
          lastPage: meta.last_page,
          onPageChange: setPage,
        }}
      />

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer cet article ?"
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
