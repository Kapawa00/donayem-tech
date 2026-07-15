'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Building2,
  CreditCard,
  Mail,
  Search,
  Share2,
  Zap,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import PasswordInput from '@/components/ui/PasswordInput';
import Switch from '@/components/ui/Switch';
import adminApi from '@/lib/adminAuth';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'general', label: 'Informations générales', icon: Building2 },
  { id: 'social', label: 'Réseaux sociaux', icon: Share2 },
  { id: 'notifications', label: 'Email & Notifications', icon: Mail },
  { id: 'payment', label: 'Paiements', icon: CreditCard },
  { id: 'seo', label: 'SEO', icon: Search },
];

const TAB_KEYS = {
  general: ['site_name', 'site_tagline', 'address', 'phone_1', 'phone_2', 'email', 'whatsapp', 'opening_hours'],
  social: ['facebook_url', 'instagram_url', 'linkedin_url', 'whatsapp_number'],
  notifications: ['admin_email', 'notifications_enabled'],
  payment: ['cinetpay_site_id', 'cinetpay_api_key', 'cinetpay_mode'],
  seo: ['ga_id', 'fb_pixel_id', 'meta_description_global'],
};

const DEFAULT_SETTINGS = Object.values(TAB_KEYS)
  .flat()
  .reduce((acc, key) => ({ ...acc, [key]: '' }), {});

function flattenSettings(grouped) {
  const flat = Object.values(grouped ?? {}).reduce((acc, group) => ({ ...acc, ...group }), {});
  return Object.fromEntries(Object.entries(flat).map(([key, value]) => [key, value ?? '']));
}

export default function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingTab, setSavingTab] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/settings');
      setSettings({ ...DEFAULT_SETTINGS, ...flattenSettings(data.data) });
    } catch (error) {
      toast.error('Impossible de charger les paramètres.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  function setField(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(tabId) {
    const keys = TAB_KEYS[tabId];
    const payload = {};
    keys.forEach((key) => {
      payload[key] = settings[key] ?? '';
    });

    setSavingTab(tabId);
    try {
      const { data } = await adminApi.put('/admin/settings', { settings: payload });
      setSettings((prev) => ({ ...prev, ...flattenSettings(data.data) }));
      toast.success('Paramètres enregistrés.');
    } catch (error) {
      toast.error("Impossible d'enregistrer les paramètres.");
    } finally {
      setSavingTab(null);
    }
  }

  async function handleTestCinetPay() {
    setTestingConnection(true);
    try {
      await adminApi.post('/admin/settings/cinetpay/test');
      toast.success('Connexion CinetPay réussie.');
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Impossible de tester la connexion CinetPay.');
    } finally {
      setTestingConnection(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 font-inter text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-gold-400 text-navy-900'
                  : 'border-transparent text-muted hover:text-dark'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'general' && (
          <SettingsPanel onSave={() => handleSave('general')} saving={savingTab === 'general'}>
            <Input id="site_name" name="site_name" label="Nom du site" value={settings.site_name} onChange={handleFieldChange} />
            <Input id="site_tagline" name="site_tagline" label="Tagline" value={settings.site_tagline} onChange={handleFieldChange} />
            <Input id="address" name="address" label="Adresse" value={settings.address} onChange={handleFieldChange} />
            <div className="grid gap-6 sm:grid-cols-2">
              <Input id="phone_1" name="phone_1" label="Téléphone 1" value={settings.phone_1} onChange={handleFieldChange} />
              <Input id="phone_2" name="phone_2" label="Téléphone 2" value={settings.phone_2} onChange={handleFieldChange} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Input id="email" name="email" label="Email de contact" type="email" value={settings.email} onChange={handleFieldChange} />
              <Input id="whatsapp" name="whatsapp" label="WhatsApp" value={settings.whatsapp} onChange={handleFieldChange} />
            </div>
            <Input
              id="opening_hours"
              name="opening_hours"
              label="Horaires d'ouverture"
              value={settings.opening_hours}
              onChange={handleFieldChange}
              placeholder="Lun–Sam, 8h–18h"
            />
          </SettingsPanel>
        )}

        {activeTab === 'social' && (
          <SettingsPanel onSave={() => handleSave('social')} saving={savingTab === 'social'}>
            <Input id="facebook_url" name="facebook_url" label="URL Facebook" value={settings.facebook_url} onChange={handleFieldChange} />
            <Input id="instagram_url" name="instagram_url" label="URL Instagram" value={settings.instagram_url} onChange={handleFieldChange} />
            <Input
              id="linkedin_url"
              name="linkedin_url"
              label="URL LinkedIn (optionnel)"
              value={settings.linkedin_url}
              onChange={handleFieldChange}
            />
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              label="Numéro WhatsApp Business"
              value={settings.whatsapp_number}
              onChange={handleFieldChange}
            />
          </SettingsPanel>
        )}

        {activeTab === 'notifications' && (
          <SettingsPanel onSave={() => handleSave('notifications')} saving={savingTab === 'notifications'}>
            <Input
              id="admin_email"
              name="admin_email"
              label="Email admin (réception des devis/messages)"
              type="email"
              value={settings.admin_email}
              onChange={handleFieldChange}
            />

            <div className="flex flex-col gap-2">
              <span className="font-inter text-sm font-medium text-dark">Template d&apos;email</span>
              <p className="rounded-xl border border-dashed border-border bg-surface p-4 font-inter text-xs text-muted">
                Les templates d&apos;email (confirmation de devis, notification de paiement, etc.) ne
                sont pas éditables ici : ils sont définis dans les vues Blade du backend
                (<code className="font-mono">resources/views/emails/</code>).
              </p>
            </div>

            <Switch
              id="notifications_enabled"
              checked={settings.notifications_enabled !== '0'}
              onChange={(checked) => setField('notifications_enabled', checked ? '1' : '0')}
              label="Activer les notifications email"
            />

            <CaveatNote>
              L&apos;adresse de réception des notifications (devis, messages de contact) est
              actuellement fixée dans le code du backend, pas lue depuis ce paramètre.
            </CaveatNote>
          </SettingsPanel>
        )}

        {activeTab === 'payment' && (
          <SettingsPanel onSave={() => handleSave('payment')} saving={savingTab === 'payment'}>
            <PasswordInput
              id="cinetpay_site_id"
              name="cinetpay_site_id"
              label="CinetPay Site ID"
              value={settings.cinetpay_site_id}
              onChange={handleFieldChange}
            />
            <PasswordInput
              id="cinetpay_api_key"
              name="cinetpay_api_key"
              label="CinetPay API Key"
              value={settings.cinetpay_api_key}
              onChange={handleFieldChange}
            />

            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-inter text-sm font-medium text-dark">Mode Production</p>
                <p className="font-inter text-xs text-muted">
                  {settings.cinetpay_mode === 'production'
                    ? 'Les paiements réels seront traités.'
                    : 'Mode test (sandbox) — aucun paiement réel.'}
                </p>
              </div>
              <Switch
                id="cinetpay_mode"
                checked={settings.cinetpay_mode === 'production'}
                onChange={(checked) => setField('cinetpay_mode', checked ? 'production' : 'sandbox')}
                ariaLabel="Activer le mode production CinetPay"
              />
            </div>

            {settings.cinetpay_mode === 'production' && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="font-inter text-xs text-amber-800">
                  Mode Production activé : assurez-vous que le Site ID et l&apos;API Key ci-dessus
                  sont vos identifiants réels CinetPay, pas ceux de sandbox.
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              loading={testingConnection}
              onClick={handleTestCinetPay}
              className="w-fit"
            >
              <Zap size={16} />
              Tester la connexion CinetPay
            </Button>

            <CaveatNote>
              Les paiements en production utilisent les identifiants CinetPay configurés dans le
              fichier <code className="font-mono">.env</code> du serveur, pas les valeurs
              enregistrées ici tant que le backend n&apos;est pas mis à jour pour les lire depuis ces
              paramètres.
            </CaveatNote>
          </SettingsPanel>
        )}

        {activeTab === 'seo' && (
          <SettingsPanel onSave={() => handleSave('seo')} saving={savingTab === 'seo'}>
            <Input id="ga_id" name="ga_id" label="Google Analytics ID" value={settings.ga_id} onChange={handleFieldChange} placeholder="G-XXXXXXXXXX" />
            <Input id="fb_pixel_id" name="fb_pixel_id" label="Facebook Pixel ID" value={settings.fb_pixel_id} onChange={handleFieldChange} />
            <Input
              id="meta_description_global"
              name="meta_description_global"
              label="Meta description globale"
              textarea
              rows={3}
              value={settings.meta_description_global}
              onChange={handleFieldChange}
            />

            <CaveatNote>
              Le site utilise actuellement les variables d&apos;environnement{' '}
              <code className="font-mono">NEXT_PUBLIC_GA_ID</code> /{' '}
              <code className="font-mono">NEXT_PUBLIC_FACEBOOK_PIXEL_ID</code> pour charger Analytics
              et le Pixel, pas ces paramètres.
            </CaveatNote>
          </SettingsPanel>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ children, onSave, saving }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
      {children}
      <div className="flex justify-end border-t border-border pt-6">
        <Button type="button" variant="primary" loading={saving} onClick={onSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}

function CaveatNote({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-surface p-4 font-inter text-xs text-muted">
      {children}
    </p>
  );
}
