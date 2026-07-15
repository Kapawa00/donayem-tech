import { Suspense } from 'react';
import AdminDevisContent from '@/components/admin/AdminDevisContent';
import Loader from '@/components/ui/Loader';

export const metadata = {
  title: 'Devis — Administration',
  robots: { index: false, follow: false },
};

export default function AdminDevisPage() {
  return (
    <Suspense fallback={<Loader size={40} className="mx-auto" />}>
      <AdminDevisContent />
    </Suspense>
  );
}
