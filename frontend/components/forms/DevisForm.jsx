'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Code2, Server } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { trackQuoteSubmit } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { ICONS } from '@/lib/icon-map';
import { getServices } from '@/lib/queries';

const SERVICE_ICONS = { ...ICONS, Code2, Server };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEP_FIELDS = [['services'], ['description', 'budget'], ['name', 'email', 'phone', 'consent'], []];

const WHATSAPP_NUMBER = '237681181456';

const stepVariants = {
  enter: (direction) => ({ x: direction >= 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction >= 0 ? -60 : 60, opacity: 0 }),
};

export default function DevisForm() {
  const t = useTranslations('DevisForm');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [catalogServices, setCatalogServices] = useState([]);

  const stepLabels = [t('stepService'), t('stepProject'), t('stepContact'), t('stepSummary')];

  const extraDevisServices = [
    { slug: 'developpement-web', title: t('devWebLabel'), icon: 'Code2' },
    { slug: 'hebergement', title: t('hostingLabel'), icon: 'Server' },
  ];

  const devisServices = [...catalogServices, ...extraDevisServices];

  const budgetOptions = [
    { value: '', label: t('budgetPlaceholder') },
    { value: '< 50 000 XAF', label: t('budgetUnder50') },
    { value: '50 000–200 000 XAF', label: t('budget50to200') },
    { value: '200 000–500 000 XAF', label: t('budget200to500') },
    { value: '> 500 000 XAF', label: t('budgetOver500') },
    { value: 'À discuter', label: t('budgetDiscuss') },
  ];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      services: [],
      description: '',
      budget: '',
      deadline: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      consent: false,
    },
  });

  useEffect(() => {
    getServices(locale)
      .then((response) => setCatalogServices(response.data ?? []))
      .catch(() => setCatalogServices([]));
  }, [locale]);

  useEffect(() => {
    register('services', {
      validate: (value) => value.length > 0 || t('serviceSelectError'),
    });
  }, [register, t]);

  useEffect(() => {
    const preselect = searchParams.get('service');
    if (preselect && devisServices.some((service) => service.slug === preselect)) {
      setValue('services', [preselect]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setValue, catalogServices]);

  const selectedServices = watch('services');

  function toggleService(slug) {
    const current = getValues('services');
    const next = current.includes(slug)
      ? current.filter((value) => value !== slug)
      : [...current, slug];
    setValue('services', next, { shouldValidate: true });
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step - 1]);
    if (!valid) return;
    setDirection(1);
    setStep((current) => Math.min(current + 1, 4));
  }

  function goBack() {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 1));
  }

  async function onSubmit(data) {
    try {
      await api.post('/quotes', {
        client_name: data.name,
        client_email: data.email,
        client_phone: data.phone,
        client_company: data.company || undefined,
        service_category: data.services[0],
        services_requested: data.services,
        project_description: data.description,
        budget_range: data.budget,
        deadline: data.deadline || undefined,
      });
      trackQuoteSubmit(data.services.join(','));
      setSubmitted(true);
    } catch (error) {
      toast.error(t('genericError'));
    }
  }

  if (submitted) {
    return <SuccessState t={t} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProgressBar step={step} stepLabels={stepLabels} t={t} />

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {step === 1 && (
            <ServiceStep
              selected={selectedServices}
              onToggle={toggleService}
              error={errors.services?.message}
              devisServices={devisServices}
              t={t}
            />
          )}
          {step === 2 && <ProjectStep register={register} errors={errors} budgetOptions={budgetOptions} t={t} />}
          {step === 3 && <ContactStep register={register} errors={errors} t={t} />}
          {step === 4 && (
            <RecapStep values={getValues()} devisServices={devisServices} budgetOptions={budgetOptions} t={t} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={goBack} className="w-full sm:w-auto">
            {t('back')}
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step < 4 ? (
          <Button type="button" variant="primary" onClick={goNext} className="w-full sm:w-auto">
            {t('next')}
          </Button>
        ) : (
          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full sm:w-auto">
            {t('submit')}
          </Button>
        )}
      </div>
    </form>
  );
}

function ProgressBar({ step, stepLabels, t }) {
  const percent = (step / stepLabels.length) * 100;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <span className="font-inter text-xs font-medium uppercase tracking-widest text-gold-600">
          {t('stepIndicator', { step, total: stepLabels.length })}
        </span>
        <span className="font-syne text-sm font-bold text-navy-900">{stepLabels[step - 1]}</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-border">
        <motion.div
          className="h-full rounded-pill bg-gold-400"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-2 flex justify-between font-inter text-[11px] text-muted">
        {stepLabels.map((label, index) => (
          <span key={label} className={cn(index + 1 <= step && 'font-medium text-gold-600')}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServiceStep({ selected, onToggle, error, devisServices, t }) {
  return (
    <div>
      <h2 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">{t('serviceStepHeading')}</h2>
      <p className="mt-2 font-inter text-sm text-muted">{t('serviceStepSubheading')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {devisServices.map((service) => {
          const Icon = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.Palette;
          const isSelected = selected.includes(service.slug);

          return (
            <button
              key={service.slug}
              type="button"
              onClick={() => onToggle(service.slug)}
              aria-pressed={isSelected}
              className={cn(
                'flex flex-col items-start gap-3 rounded-2xl border-2 bg-white p-6 text-left transition-colors',
                isSelected ? 'border-gold-400 bg-gold-400/5' : 'border-border hover:border-gold-400/40'
              )}
            >
              <div
                className={cn(
                  'inline-flex rounded-xl p-3',
                  isSelected ? 'bg-gold-400/15' : 'bg-navy-900/5'
                )}
              >
                <Icon className={isSelected ? 'text-gold-500' : 'text-navy-900/60'} size={24} />
              </div>
              <span className="font-syne text-base font-bold text-navy-900">{service.title}</span>
              {isSelected && (
                <span className="flex items-center gap-1.5 font-inter text-xs font-medium text-gold-600">
                  <Check size={14} />
                  {t('selected')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 font-inter text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ProjectStep({ register, errors, budgetOptions, t }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">{t('projectStepHeading')}</h2>

      <Input
        id="devis-description"
        label={t('descriptionLabel')}
        textarea
        rows={5}
        error={errors.description?.message}
        {...register('description', {
          required: t('descriptionRequired'),
          minLength: { value: 50, message: t('descriptionMinLength') },
        })}
      />

      <Input
        id="devis-budget"
        label={t('budgetLabel')}
        options={budgetOptions}
        error={errors.budget?.message}
        {...register('budget', { required: t('budgetRequired') })}
      />

      <Input
        id="devis-deadline"
        label={t('deadlineLabel')}
        type="date"
        {...register('deadline')}
      />
    </div>
  );
}

function ContactStep({ register, errors, t }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">{t('contactStepHeading')}</h2>

      <Input
        id="devis-name"
        label={t('nameLabel')}
        error={errors.name?.message}
        {...register('name', { required: t('nameRequired') })}
      />
      <Input
        id="devis-email"
        label={t('emailLabel')}
        type="email"
        error={errors.email?.message}
        {...register('email', {
          required: t('emailRequired'),
          pattern: { value: EMAIL_PATTERN, message: t('emailInvalid') },
        })}
      />
      <Input
        id="devis-phone"
        label={t('phoneLabel')}
        error={errors.phone?.message}
        {...register('phone', { required: t('phoneRequired') })}
      />
      <Input id="devis-company" label={t('companyLabel')} {...register('company')} />

      <label className="flex items-start gap-3 font-inter text-sm text-dark">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-gold-400 focus:ring-2 focus:ring-gold-400/50"
          {...register('consent', { required: t('consentRequired') })}
        />
        {t('consentLabel')}
      </label>
      {errors.consent && (
        <p className="-mt-3 font-inter text-xs text-red-500">{errors.consent.message}</p>
      )}
    </div>
  );
}

function RecapStep({ values, devisServices, budgetOptions, t }) {
  const selectedTitles = values.services
    .map((slug) => devisServices.find((service) => service.slug === slug)?.title)
    .filter(Boolean);
  const budgetLabel = budgetOptions.find((option) => option.value === values.budget)?.label;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-syne text-2xl font-bold text-navy-900 md:text-3xl">{t('recapHeading')}</h2>

      <RecapRow label={t('recapServices')}>{selectedTitles.join(', ')}</RecapRow>
      <RecapRow label={t('recapProject')}>{values.description}</RecapRow>
      <RecapRow label={t('recapBudget')}>{budgetLabel}</RecapRow>
      {values.deadline && <RecapRow label={t('recapDeadline')}>{values.deadline}</RecapRow>}
      <RecapRow label={t('recapName')}>{values.name}</RecapRow>
      <RecapRow label={t('recapEmail')}>{values.email}</RecapRow>
      <RecapRow label={t('recapPhone')}>{values.phone}</RecapRow>
      {values.company && <RecapRow label={t('recapCompany')}>{values.company}</RecapRow>}
    </div>
  );
}

function RecapRow({ label, children }) {
  return (
    <div className="border-b border-border pb-3">
      <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 font-inter text-sm text-dark">{children}</p>
    </div>
  );
}

function SuccessState({ t }) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsappFollowupMessage'))}`;

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
      >
        <Check size={40} className="text-emerald-600" strokeWidth={3} />
      </motion.div>

      <h2 className="font-syne text-2xl font-bold text-navy-900">{t('successHeading')}</h2>
      <p className="max-w-sm font-inter text-sm text-muted">{t('successMessage')}</p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-gold-400 px-8 py-4
                     font-inter text-sm font-semibold uppercase tracking-widest text-navy-900
                     transition-colors hover:bg-gold-300"
        >
          {t('followWhatsapp')}
        </a>
        <Button href="/" variant="outline">
          {t('backHome')}
        </Button>
      </div>
    </div>
  );
}
