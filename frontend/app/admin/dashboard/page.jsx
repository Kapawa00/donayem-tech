import AdminDashboardContent from '@/components/admin/AdminDashboardContent';

export const metadata = {
  title: 'Dashboard — Administration',
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
