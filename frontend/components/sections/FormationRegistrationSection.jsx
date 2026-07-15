'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SectionTitle from '@/components/ui/SectionTitle';
import { fadeUp } from '@/lib/animations';
import api from '@/lib/api';
import { getFormations } from '@/lib/queries';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormationRegistrationSection() {
  const t = useTranslations('FormationRegistrationSection');
  const [formationOptions, setFormationOptions] = useState([
    { value: '', label: t('defaultOption') },
  ]);

  const fetchFormationOptions = useCallback(async () => {
    try {
      const { data } = await getFormations({ type: 'module' });
      setFormationOptions([
        { value: '', label: t('defaultOption') },
        ...data.map((module) => ({ value: module.title, label: module.title })),
        { value: t('academicOptionValue'), label: t('academicOptionLabel') },
      ]);
    } catch (err) {
      // Le formulaire reste utilisable avec seulement l'option par défaut.
    }
  }, [t]);

  useEffect(() => {
    fetchFormationOptions();
  }, [fetchFormationOptions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', phone: '', formation: '', message: '' },
  });

  async function onSubmit(data) {
    try {
      await api.post('/quotes', {
        client_name: data.name,
        client_email: data.email,
        client_phone: data.phone,
        service_category: 'formation',
        services_requested: data.formation ? [data.formation] : [],
        project_description: data.message,
      });
      toast.success(t('successToast'));
      reset();
    } catch (error) {
      toast.error(t('errorToast'));
    }
  }

  return (
    <section id="inscription" className="bg-navy-900 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('heading')}
          subtitle={t('subtitle')}
          theme="dark"
        />

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-sm"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Input
            id="reg-name"
            label={t('nameLabel')}
            error={errors.name?.message}
            {...register('name', { required: t('nameRequired') })}
          />
          <Input
            id="reg-email"
            label={t('emailLabel')}
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: t('emailRequired'),
              pattern: { value: EMAIL_PATTERN, message: t('emailInvalid') },
            })}
          />
          <Input
            id="reg-phone"
            label={t('phoneLabel')}
            error={errors.phone?.message}
            {...register('phone', { required: t('phoneRequired') })}
          />
          <Input
            id="reg-formation"
            label={t('formationLabel')}
            options={formationOptions}
            error={errors.formation?.message}
            {...register('formation', { required: t('formationRequired') })}
          />
          <Input
            id="reg-message"
            label={t('messageLabel')}
            textarea
            {...register('message')}
          />

          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
            {t('submit')}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
