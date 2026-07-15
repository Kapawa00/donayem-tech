'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import AdminQuoteDetailModal from '@/components/admin/AdminQuoteDetailModal';
import adminApi from '@/lib/adminAuth';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'new', label: 'Nouveau' },
  { value: 'reviewing', label: 'En cours' },
  { value: 'accepted', label: 'Accepté' },
  { value: 'rejected', label: 'Refusé' },
  { value: 'paid', label: 'Payé' },
];

const STATUS_VARIANT = {
  new: 'gold',
  reviewing: 'navy',
  accepted: 'success',
  rejected: 'error',
  paid: 'success',
};

export default function AdminDevisContent() {
  const searchParams = useSearchParams();
  const [quotes, setQuotes] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', date: '', service_category: '' });
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/quotes', {
        params: {
          page,
          status: filters.status || undefined,
          date: filters.date || undefined,
          service_category: filters.service_category || undefined,
        },
      });
      setQuotes(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error('Impossible de charger les demandes de devis.');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;

    adminApi
      .get(`/admin/quotes/${id}`)
      .then(({ data }) => setSelectedQuote(data.data))
      .catch(() => toast.error('Impossible de charger ce devis.'));
  }, [searchParams]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleQuoteUpdated(updatedQuote) {
    setQuotes((prev) => prev.map((quote) => (quote.id === updatedQuote.id ? updatedQuote : quote)));
    setSelectedQuote(updatedQuote);
  }

  const columns = [
    { key: 'reference', header: 'Référence' },
    { key: 'client_name', header: 'Client' },
    {
      key: 'services_requested',
      header: 'Service',
      render: (row) => row.services_requested?.join(', ') || row.service_category,
    },
    { key: 'budget_range', header: 'Budget', render: (row) => row.budget_range ?? '—' },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'navy'}>{row.status_label}</Badge>,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (row) => new Date(row.created_at).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedQuote(row)}
          className="font-inter text-sm font-medium text-gold-600 hover:text-gold-400"
        >
          Voir
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:grid-cols-3">
        <Input
          id="filter-status"
          label="Statut"
          options={STATUS_OPTIONS}
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <Input
          id="filter-date"
          label="Date"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <Input
          id="filter-category"
          label="Service"
          name="service_category"
          value={filters.service_category}
          onChange={handleFilterChange}
          placeholder="ex. webdesign-infographie"
        />
      </div>

      <DataTable
        columns={columns}
        data={quotes}
        loading={loading}
        emptyMessage="Aucune demande de devis pour le moment."
        pagination={{
          currentPage: meta.current_page,
          lastPage: meta.last_page,
          onPageChange: setPage,
        }}
      />

      {selectedQuote && (
        <AdminQuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdated={handleQuoteUpdated}
        />
      )}
    </div>
  );
}
