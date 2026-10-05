'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { User, Phone, Mail, CreditCard, Shield, CheckCircle } from 'lucide-react';

export default function AgentProfilPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
      }
    }
    setLoading(false);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = () => {
    alert('Fonctionnalité de paiement bientôt disponible.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold text-[#111315] mb-8">Mon Profil Agent</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Informations Personnelles */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#111315] mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#e4002b]" />
                Informations
              </h2>
              
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-xl focus:ring-[#e4002b] focus:border-[#e4002b]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-xl focus:ring-[#e4002b] focus:border-[#e4002b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Non modifiable)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {message && (
                  <p className={`text-sm ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#111315] text-white rounded-full px-6 py-2.5 font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </div>

          {/* Abonnements */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111315] flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#e4002b]" />
                  Mon Abonnement
                </h2>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                  Plan Actuel : Gratuit
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Plan 1 */}
                <div className="border-2 border-gray-100 rounded-2xl p-6 hover:border-[#e4002b] transition-colors relative flex flex-col">
                  <h3 className="text-xl font-bold text-[#111315]">Pro Basic</h3>
                  <div className="my-4">
                    <span className="text-3xl font-bold text-[#111315]">5 000</span>
                    <span className="text-gray-500"> FCFA/mois</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Jusqu'à 10 annonces actives</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Visibilité standard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Outils de gestion de base</span>
                    </li>
                  </ul>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full border-2 border-[#111315] text-[#111315] rounded-full px-6 py-2.5 font-semibold hover:bg-gray-50 transition-colors flex justify-center items-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    S'abonner
                  </button>
                </div>

                {/* Plan 2 */}
                <div className="border-2 border-[#e4002b] rounded-2xl p-6 relative flex flex-col shadow-md">
                  <div className="absolute top-0 right-0 bg-[#e4002b] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    POPULAIRE
                  </div>
                  <h3 className="text-xl font-bold text-[#111315]">Pro Plus</h3>
                  <div className="my-4">
                    <span className="text-3xl font-bold text-[#111315]">10 000</span>
                    <span className="text-gray-500"> FCFA/mois</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Jusqu'à 30 annonces actives</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Visibilité prioritaire</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Support prioritaire</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Statistiques avancées</span>
                    </li>
                  </ul>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full bg-[#e4002b] text-white rounded-full px-6 py-2.5 font-semibold hover:bg-[#c5001f] transition-colors flex justify-center items-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    S'abonner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
