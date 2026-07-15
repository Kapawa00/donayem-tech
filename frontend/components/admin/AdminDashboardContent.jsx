'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  CreditCard,
  FileText,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import ErrorState from '@/components/ui/ErrorState';
import KpiCard from '@/components/admin/KpiCard';
import adminApi from '@/lib/adminAuth';

function formatXAF(amount) {
  return `${Number(amount ?? 0).toLocaleString('fr-FR')} XAF`;
}

const QUOTE_STATUS_VARIANT = {
  new: 'gold',
  reviewing: 'navy',
  accepted: 'success',
  rejected: 'error',
  paid: 'success',
};

const PAYMENT_STATUS_VARIANT = {
  pending: 'neutral',
  success: 'success',
  failed: 'error',
};

const QUOTE_COLUMNS = [
  { key: 'reference', header: 'Référence' },
  { key: 'client_name', header: 'Client' },
  {
    key: 'services_requested',
    header: 'Service',
    render: (row) => row.services_requested?.join(', ') || row.service_category,
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => <Badge variant={QUOTE_STATUS_VARIANT[row.status] ?? 'navy'}>{row.status_label}</Badge>,
  },
  {
    key: 'created_at',
    header: 'Date',
    render: (row) => new Date(row.created_at).toLocaleDateString('fr-FR'),
  },
  {
    key: 'actions',
    header: '',
    render: (row) => (
      <Link href={`/admin/devis?id=${row.id}`} className="font-inter text-sm font-medium text-gold-600 hover:text-gold-400">
        Voir
      </Link>
    ),
  },
];

const PAYMENT_COLUMNS = [
  { key: 'transaction_id', header: 'Transaction' },
  { key: 'client', header: 'Client', render: (row) => row.order?.client_name ?? '—' },
  { key: 'amount', header: 'Montant', render: (row) => formatXAF(row.amount) },
  { key: 'payment_method_label', header: 'Méthode' },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => (
      <Badge variant={PAYMENT_STATUS_VARIANT[row.status] ?? 'neutral'}>{row.status_label}</Badge>
    ),
  },
];

export default function AdminDashboardContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await adminApi.get('/admin/dashboard/stats');
      setStats(data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (error) {
    return (
      <ErrorState message="Impossible de charger les statistiques." onRetry={fetchStats} />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Devis du jour"
          value={loading ? '—' : stats.quotes_today}
          icon={FileText}
          color="gold"
        />
        <KpiCard
          label="Paiements du jour"
          value={loading ? '—' : formatXAF(stats.payments_today)}
          icon={CreditCard}
          color="green"
        />
        <KpiCard
          label="Messages non lus"
          value={loading ? '—' : stats.messages_unread}
          icon={MessageSquare}
          color="amber"
        />
        <KpiCard
          label="Total paiements"
          value={loading ? '—' : formatXAF(stats.payments_total)}
          icon={TrendingUp}
          color="navy"
        />
      </div>

      <div>
        <h2 className="mb-3 font-syne text-base font-bold text-navy-900">
          Statistiques du site (calculées automatiquement)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Clients accompagnés"
            value={loading ? '—' : stats.home_stats?.clients_count}
            icon={Users}
            color="navy"
          />
          <KpiCard
            label="Projets livrés"
            value={loading ? '—' : stats.home_stats?.projects_count}
            icon={Briefcase}
            color="gold"
          />
          <KpiCard
            label="Années d'expérience"
            value={loading ? '—' : stats.home_stats?.years_experience}
            icon={Award}
            color="amber"
          />
          <KpiCard
            label="Satisfaction client"
            value={loading ? '—' : `${stats.home_stats?.satisfaction_rate}%`}
            icon={ThumbsUp}
            color="green"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-syne text-base font-bold text-navy-900">Derniers devis</h2>
        <DataTable
          columns={QUOTE_COLUMNS}
          data={stats?.latest_quotes ?? []}
          loading={loading}
          emptyMessage="Aucun devis pour le moment."
        />
      </div>

      <div>
        <h2 className="mb-3 font-syne text-base font-bold text-navy-900">Derniers paiements</h2>
        <DataTable
          columns={PAYMENT_COLUMNS}
          data={stats?.latest_payments ?? []}
          loading={loading}
          emptyMessage="Aucun paiement pour le moment."
        />
      </div>
    </div>
  );
}
