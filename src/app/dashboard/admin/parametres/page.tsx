'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Save, Settings, Info } from 'lucide-react';
import Link from 'next/link';

type SettingsState = Record<string, string | number>;

export default function ParametresPage() {
  const [settings, setSettings] = useState<SettingsState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Add role check if you have a roles table

      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap: SettingsState = {};
      data?.forEach(item => {
        settingsMap[item.key] = item.value;
      });

      // Default values mapping based on instructions
      const defaultSettings: SettingsState = {
        certification_standard_price: 10000,
        certification_renforcee_price: 15000,
        certification_premium_price: 20000,
        certification_validity_days: 90,
        boost_7_days_price: 2500,
        boost_30_days_price: 7500,
        pro_basic_price: 5000,
        pro_basic_quota: 10,
        pro_plus_price: 10000,
        pro_plus_quota: 30,
        scoring_adequation_weight: 30,
        scoring_fraicheur_weight: 20,
        scoring_certification_weight: 25,
        scoring_qualite_weight: 10,
        scoring_engagement_weight: 10,
        scoring_boost_weight: 5,
        freshness_check_days: 15,
        freshness_stale_days: 30,
        freshness_hidden_days: 45,
        max_images_per_property: 15,
        max_image_size_mb: 5,
        max_listings_free: 3,
        min_password_length: 8,
        rate_limit_visits_per_hour: 10,
        hero_title: 'Trouvez votre logement idéal à Kribi',
        hero_subtitle: '',
        certification_tagline: '',
        cta_publish: 'Publier gratuitement',
        cta_certify: 'Faire vérifier mon logement',
        contact_email: '',
        contact_phone: '',
        contact_whatsapp: '',
        company_name: '',
        company_address: ''
      };

      setSettings({ ...defaultSettings, ...settingsMap });
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSection = async (sectionKeys: string[], sectionName: string) => {
    setSaving(sectionName);
    setMessage(null);
    try {
      const updates = sectionKeys.map(key => ({
        key,
        value: settings[key]
      }));

      const { error } = await supabase
        .from('app_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      setMessage({ text: 'Paramètres mis à jour avec succès', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      setMessage({ text: 'Erreur lors de la mise à jour des paramètres', type: 'error' });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#e4002b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const SectionCard = ({ title, keys, sectionId }: { title: string, keys: { key: string, label: string, type: 'number' | 'text' }[], sectionId: string }) => (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 mb-8">
      <h3 className="text-xl font-bold text-[#111315] mb-6 border-b pb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {keys.map(({ key, label, type }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              value={settings[key] || ''}
              onChange={(e) => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all"
            />
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => saveSection(keys.map(k => k.key), sectionId)}
          disabled={saving === sectionId}
          className="bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-2.5 rounded-full font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {saving === sectionId ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>Sauvegarder</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {/* Sidebar Admin */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sticky top-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu Admin</h2>
              <nav className="flex flex-col gap-1">
                <Link href="/dashboard/admin/parametres" className="flex items-center gap-3 px-3 py-2 bg-[#e4002b]/10 text-[#e4002b] rounded-xl font-medium">
                  <Settings className="w-5 h-5" />
                  Paramètres
                </Link>
                <Link href="/dashboard/admin/audit" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Journal d'audit
                </Link>
                <Link href="/dashboard/admin/moderation" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Modération
                </Link>
                <Link href="/dashboard/admin/certifications" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Certifications
                </Link>
              </nav>
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="flex-grow max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111315]">Paramètres du Système</h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Configurez les variables globales de l'application KribiLoc.
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{message.text}</p>
              </div>
            )}

            <SectionCard 
              sectionId="tarifs_certification"
              title="1. Tarifs de Certification (FCFA)"
              keys={[
                { key: 'certification_standard_price', label: 'Certification Standard', type: 'number' },
                { key: 'certification_renforcee_price', label: 'Certification Renforcée', type: 'number' },
                { key: 'certification_premium_price', label: 'Certification Premium', type: 'number' },
                { key: 'certification_validity_days', label: 'Validité (jours)', type: 'number' },
              ]}
            />

            <SectionCard 
              sectionId="tarifs_boost"
              title="2. Tarifs de Boost (FCFA)"
              keys={[
                { key: 'boost_7_days_price', label: 'Boost 7 jours', type: 'number' },
                { key: 'boost_30_days_price', label: 'Boost 30 jours', type: 'number' },
              ]}
            />

            <SectionCard 
              sectionId="abonnements_pro"
              title="3. Abonnements Professionnels"
              keys={[
                { key: 'pro_basic_price', label: 'Prix Pro Basic (FCFA)', type: 'number' },
                { key: 'pro_basic_quota', label: 'Quota Pro Basic', type: 'number' },
                { key: 'pro_plus_price', label: 'Prix Pro Plus (FCFA)', type: 'number' },
                { key: 'pro_plus_quota', label: 'Quota Pro Plus', type: 'number' },
              ]}
            />

            <SectionCard 
              sectionId="algorithme_scoring"
              title="4. Algorithme de Classement (Poids en %)"
              keys={[
                { key: 'scoring_adequation_weight', label: 'Adéquation', type: 'number' },
                { key: 'scoring_fraicheur_weight', label: 'Fraîcheur', type: 'number' },
                { key: 'scoring_certification_weight', label: 'Certification', type: 'number' },
                { key: 'scoring_qualite_weight', label: 'Qualité', type: 'number' },
                { key: 'scoring_engagement_weight', label: 'Engagement', type: 'number' },
                { key: 'scoring_boost_weight', label: 'Boost', type: 'number' },
              ]}
            />

            <SectionCard 
              sectionId="fraicheur"
              title="5. Fraîcheur des Annonces (Jours)"
              keys={[
                { key: 'freshness_check_days', label: 'Délai avant reconfirmation', type: 'number' },
                { key: 'freshness_stale_days', label: 'Délai avant obsolescence', type: 'number' },
                { key: 'freshness_hidden_days', label: 'Délai avant masquage', type: 'number' },
              ]}
            />

            <SectionCard 
              sectionId="limites_securite"
              title="6. Limites et Sécurité"
              keys={[
                { key: 'max_images_per_property', label: 'Images max par annonce', type: 'number' },
                { key: 'max_image_size_mb', label: 'Taille image max (MB)', type: 'number' },
                { key: 'max_listings_free', label: 'Annonces gratuites max', type: 'number' },
                { key: 'min_password_length', label: 'Longueur min. mot de passe', type: 'number' },
                { key: 'rate_limit_visits_per_hour', label: 'Visites max par heure (Rate limit)', type: 'number' },
              ]}
            />

            <SectionCard 
              sectionId="textes_marketing"
              title="7. Textes Marketing"
              keys={[
                { key: 'hero_title', label: 'Titre de la page d\'accueil', type: 'text' },
                { key: 'hero_subtitle', label: 'Sous-titre de la page d\'accueil', type: 'text' },
                { key: 'certification_tagline', label: 'Slogan de certification', type: 'text' },
                { key: 'cta_publish', label: 'Bouton Publier', type: 'text' },
                { key: 'cta_certify', label: 'Bouton Certifier', type: 'text' },
              ]}
            />

            <SectionCard 
              sectionId="informations_contact"
              title="8. Informations de Contact"
              keys={[
                { key: 'contact_email', label: 'Email de contact', type: 'text' },
                { key: 'contact_phone', label: 'Téléphone', type: 'text' },
                { key: 'contact_whatsapp', label: 'WhatsApp', type: 'text' },
                { key: 'company_name', label: 'Nom de l\'entreprise', type: 'text' },
                { key: 'company_address', label: 'Adresse physique', type: 'text' },
              ]}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
