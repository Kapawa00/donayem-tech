'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import adminApi from '@/lib/adminAuth';

const METHOD_OPTIONS = [
  { value: '', label: 'Toutes les méthodes' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'mtn_momo', label: 'MTN Mobile Money' },
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'MasterCard' },
  { value: 'iban', label: 'Virement IBAN' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'success', label: 'Réussi' },
  { value: 'failed', label: 'Échoué' },
];

const STATUS_VARIANT = {
  pending: 'neutral',
  success: 'success',
  failed: 'error',
};

const METHOD_COLOR = {
  orange_money: '#FF7900',
  mtn_momo: '#FFCB00',
  visa: '#1A1F71',
  mastercard: '#EB001B',
  iban: '#050A22',
};

function formatXAF(amount) {
  return `${Number(amount ?? 0).toLocaleString('fr-FR')} XAF`;
}

export default function AdminPaiementsContent() {
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', payment_method: '' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/payments', {
        params: {
          page,
          status: filters.status || undefined,
          payment_method: filters.payment_method || undefined,
        },
      });
      setPayments(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error('Impossible de charger les paiements.');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRowClick(row) {
    try {
      const { data } = await adminApi.get(`/admin/payments/${row.id}`);
      setSelected(data.data);
    } catch (error) {
      toast.error('Impossible de charger ce paiement.');
    }
  }

  const columns = [
    { key: 'transaction_id', header: 'Transaction' },
    { key: 'client', header: 'Client', render: (row) => row.order?.client_name ?? '—' },
    { key: 'amount', header: 'Montant', render: (row) => formatXAF(row.amount) },
    {
      key: 'payment_method_label',
      header: 'Méthode',
      render: (row) => (
        <span className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: METHOD_COLOR[row.payment_method] ?? '#9CA3AF' }}
          />
          {row.payment_method_label}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'}>{row.status_label}</Badge>,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (row) => new Date(row.created_at).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:grid-cols-2">
        <Input
          id="filter-method"
          label="Méthode"
          options={METHOD_OPTIONS}
          name="payment_method"
          value={filters.payment_method}
          onChange={handleFilterChange}
        />
        <Input
          id="filter-payment-status"
          label="Statut"
          options={STATUS_OPTIONS}
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        />
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        emptyMessage="Aucun paiement pour le moment."
        onRowClick={handleRowClick}
        pagination={{
          currentPage: meta.current_page,
          lastPage: meta.last_page,
          onPageChange: setPage,
        }}
      />

      {selected && (
        <Modal isOpen onClose={() => setSelected(null)} title={selected.transaction_id} maxWidth="max-w-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="Client" value={selected.order?.client_name ?? '—'} />
            <InfoRow label="Commande" value={selected.order?.reference ?? '—'} />
            <InfoRow label="Montant" value={formatXAF(selected.amount)} />
            <InfoRow label="Méthode" value={selected.payment_method_label} />
            <InfoRow label="Statut" value={selected.status_label} />
            <InfoRow
              label="Payé le"
              value={selected.paid_at ? new Date(selected.paid_at).toLocaleString('fr-FR') : '—'}
            />
          </div>

          <div className="mt-6">
            <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">
              Données CinetPay
            </p>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-surface p-4 font-mono text-xs text-dark">
              {selected.cinetpay_data
                ? JSON.stringify(selected.cinetpay_data, null, 2)
                : 'Aucune donnée disponible.'}
            </pre>
          </div>
        </Modal>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-0.5 font-inter text-sm text-dark">{value}</p>
    </div>
  );
}
