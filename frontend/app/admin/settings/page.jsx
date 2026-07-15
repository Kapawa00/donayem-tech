import AdminSettingsContent from '@/components/admin/AdminSettingsContent';

export const metadata = {
  title: 'Paramètres — Administration',
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return <AdminSettingsContent />;
}
