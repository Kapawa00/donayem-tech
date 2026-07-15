'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { trackContactSubmit } from '@/lib/analytics';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', email: '', phone: '', subject: '', message: '' } });

  const subjectOptions = [
    { value: '', label: t('subjectPlaceholder') },
    { value: 'Devis', label: t('subjectQuote') },
    { value: 'Question', label: t('subjectQuestion') },
    { value: 'Partenariat', label: t('subjectPartnership') },
    { value: 'Autre', label: t('subjectOther') },
  ];

  async function onSubmit(data) {
    try {
      await api.post('/contact', data);
      trackContactSubmit();
      toast.success(t('successToast'));
      reset();
    } catch (error) {
      const firstError = Object.values(error.response?.data?.errors ?? {})[0]?.[0];
      toast.error(firstError || t('errorToast'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <h2 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">{t('heading')}</h2>

      <Input
        id="contact-name"
        label={t('nameLabel')}
        error={errors.name?.message}
        {...register('name', { required: t('nameRequired') })}
      />

      <Input
        id="contact-email"
        label={t('emailLabel')}
        type="email"
        error={errors.email?.message}
        {...register('email', {
          required: t('emailRequired'),
          pattern: { value: EMAIL_PATTERN, message: t('emailInvalid') },
        })}
      />

      <Input
        id="contact-phone"
        label={t('phoneLabelOptional')}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        id="contact-subject"
        label={t('subjectLabel')}
        options={subjectOptions}
        error={errors.subject?.message}
        {...register('subject', { required: t('subjectRequired') })}
      />

      <Input
        id="contact-message"
        label={t('messageLabel')}
        textarea
        rows={5}
        error={errors.message?.message}
        {...register('message', {
          required: t('messageRequired'),
          minLength: { value: 10, message: t('messageMinLength') },
        })}
      />

      <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
        {t('submit')}
      </Button>
    </form>
  );
}
