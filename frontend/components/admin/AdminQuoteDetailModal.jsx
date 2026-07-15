'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import adminApi from '@/lib/adminAuth';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nouveau' },
  { value: 'reviewing', label: 'En cours' },
  { value: 'accepted', label: 'Accepté' },
  { value: 'rejected', label: 'Refusé' },
  { value: 'paid', label: 'Payé' },
];

export default function AdminQuoteDetailModal({ quote, onClose, onUpdated }) {
  const [status, setStatus] = useState(quote.status);
  const [adminNotes, setAdminNotes] = useState(quote.admin_notes ?? '');
  const [totalAmount, setTotalAmount] = useState(quote.total_amount ?? '');
  const [saving, setSaving] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    setStatus(quote.status);
    setAdminNotes(quote.admin_notes ?? '');
    setTotalAmount(quote.total_amount ?? '');
  }, [quote]);

  async function handleSave() {
    setSaving(true);
    try {
      const { data } = await adminApi.put(`/admin/quotes/${quote.id}`, {
        status,
        admin_notes: adminNotes || null,
        total_amount: totalAmount === '' ? null : Number(totalAmount),
      });
      toast.success('Devis mis à jour.');
      onUpdated(data.data);
    } catch (error) {
      toast.error('Impossible de mettre à jour ce devis.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateOrder() {
    setCreatingOrder(true);
    try {
      await adminApi.post(`/admin/quotes/${quote.id}/create-order`);
      toast.success('Commande créée.');
      onUpdated({ ...quote, has_order: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Impossible de créer la commande.');
    } finally {
      setCreatingOrder(false);
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={quote.reference} maxWidth="max-w-2xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <InfoRow label="Client" value={quote.client_name} />
          <InfoRow label="Email" value={quote.client_email} />
          <InfoRow label="Téléphone" value={quote.client_phone} />
          {quote.client_company && <InfoRow label="Entreprise" value={quote.client_company} />}
          <InfoRow
            label="Service(s)"
            value={quote.services_requested?.join(', ') || quote.service_category}
          />
          <InfoRow label="Budget" value={quote.budget_range ?? '—'} />
          {quote.deadline && <InfoRow label="Délai souhaité" value={quote.deadline} />}
          <div>
            <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">
              Description du projet
            </p>
            <p className="mt-1 font-inter text-sm text-dark">{quote.project_description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            id="quote-status"
            label="Statut"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          />
          <Input
            id="quote-total-amount"
            label="Montant proposé (XAF)"
            type="number"
            min="0"
            value={totalAmount}
            onChange={(event) => setTotalAmount(event.target.value)}
          />
          <Input
            id="quote-admin-notes"
            label="Notes admin"
            textarea
            rows={4}
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
          />

          <Button type="button" variant="primary" loading={saving} onClick={handleSave}>
            Enregistrer
          </Button>

          {quote.status === 'accepted' && !quote.has_order && (
            <Button type="button" variant="outline" loading={creatingOrder} onClick={handleCreateOrder}>
              Créer une commande
            </Button>
          )}
          {quote.has_order && (
            <p className="font-inter text-xs text-emerald-600">
              Une commande existe déjà pour ce devis.
            </p>
          )}
        </div>
      </div>
    </Modal>
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
