'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { trackQuoteSubmit } from '@/lib/analytics';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function QuickQuoteForm({ serviceCategory, serviceSlug }) {
  const t = useTranslations('QuickQuoteForm');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', email: '', phone: '', message: '' } });

  async function onSubmit(data) {
    try {
      await api.post('/quotes', {
        client_name: data.name,
        client_email: data.email,
        client_phone: data.phone,
        service_category: serviceCategory,
        services_requested: [serviceSlug],
        project_description: data.message,
      });
      trackQuoteSubmit(serviceSlug);
      toast.success(t('successToast'));
      reset();
    } catch (error) {
      toast.error(t('errorToast'));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
    >
      <h3 className="font-syne text-lg font-bold text-navy-900">{t('heading')}</h3>
      <p className="font-inter text-sm text-muted">{t('subheading')}</p>

      <Input
        id="qq-name"
        label={t('nameLabel')}
        error={errors.name?.message}
        {...register('name', { required: t('nameRequired') })}
      />
      <Input
        id="qq-email"
        label={t('emailLabel')}
        type="email"
        error={errors.email?.message}
        {...register('email', {
          required: t('emailRequired'),
          pattern: { value: EMAIL_PATTERN, message: t('emailInvalid') },
        })}
      />
      <Input id="qq-phone" label={t('phoneLabel')} error={errors.phone?.message} {...register('phone')} />
      <Input
        id="qq-message"
        label={t('messageLabel')}
        textarea
        error={errors.message?.message}
        {...register('message', { required: t('messageRequired') })}
      />

      <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
        {t('submit')}
      </Button>
    </form>
  );
}
