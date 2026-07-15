import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata = {
  title: 'Connexion — Administration',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
