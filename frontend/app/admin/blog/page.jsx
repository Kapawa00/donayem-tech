import AdminBlogContent from '@/components/admin/AdminBlogContent';

export const metadata = {
  title: 'Blog — Administration',
  robots: { index: false, follow: false },
};

export default function AdminBlogPage() {
  return <AdminBlogContent />;
}
