import AdminPaiementsContent from '@/components/admin/AdminPaiementsContent';

export const metadata = {
  title: 'Paiements — Administration',
  robots: { index: false, follow: false },
};

export default function AdminPaiementsPage() {
  return <AdminPaiementsContent />;
}
