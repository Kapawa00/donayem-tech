import AdminBlogEditor from '@/components/admin/AdminBlogEditor';

export const metadata = {
  title: "Éditeur d'article — Administration",
  robots: { index: false, follow: false },
};

export default function AdminBlogEditorPage({ params }) {
  return <AdminBlogEditor id={params.id} />;
}
