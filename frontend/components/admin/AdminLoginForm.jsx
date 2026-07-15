'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const EMPTY_FORM = { email: '', password: '' };

export default function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      router.push('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data?.message ?? 'Identifiants invalides.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <span className="font-syne text-2xl font-bold text-white">
          DONAYEM<span className="text-gold-400"> TECH</span>
        </span>
        <p className="mt-2 font-inter text-xs uppercase tracking-widest text-gray-400">
          Administration
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="font-syne text-xl font-bold text-navy-900">Connexion</h1>
        <p className="mt-1 font-inter text-sm text-muted">Accédez à votre tableau de bord.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="login-email"
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            id="login-password"
            label="Mot de passe"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="font-inter text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="primary" loading={loading} className="mt-2 w-full">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
