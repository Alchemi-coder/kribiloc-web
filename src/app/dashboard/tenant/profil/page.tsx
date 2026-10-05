'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { updateProfile } from '@/lib/actions';
import { User, Phone, Mail, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

type ProfileFormData = {
  full_name: string;
  phone: string;
};

export default function TenantProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserEmail(user.email || '');
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', user.id)
            .single();
            
          if (profile) {
            setValue('full_name', profile.full_name || '');
            setValue('phone', profile.phone || '');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [supabase, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateProfile({
        fullName: data.full_name,
        phone: data.phone || ''
      });
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la mise à jour.' });
    } finally {
      setIsSaving(false);
      // Auto-hide success message
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-grow pt-10 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111315] mb-2">Mon profil</h1>
            <p className="text-gray-500">Gérez vos informations personnelles et vos préférences de contact.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#e4002b]" />
                  <p>Chargement de vos informations...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {message && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${
                      message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {message.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm font-medium">{message.text}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#111315] mb-1">
                        Adresse email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={userEmail}
                          disabled
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed focus:ring-0"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">L'adresse email ne peut pas être modifiée.</p>
                    </div>

                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-[#111315] mb-1">
                        Nom complet <span className="text-[#e4002b]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="full_name"
                          {...register('full_name', { required: 'Votre nom complet est requis' })}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.full_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#e4002b] focus:border-[#e4002b]'} rounded-xl sm:text-sm transition-colors`}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#111315] mb-1">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          {...register('phone')}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#e4002b] focus:border-[#e4002b] sm:text-sm transition-colors"
                          placeholder="+237 600 000 000"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Nécessaire pour que les propriétaires puissent vous contacter lors de vos demandes de visite.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#e4002b] hover:bg-[#c5001f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e4002b] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </main>
</div>
  );
}
