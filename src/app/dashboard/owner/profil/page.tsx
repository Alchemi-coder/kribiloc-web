'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Home, Calendar, Shield, Save, User, Mail, Phone, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { updateProfile } from '@/lib/actions'

type ProfileFormData = {
  full_name: string
  phone: string
  email: string
  avatar_url: string
}

export default function OwnerProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>()
  
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setValue('full_name', data.full_name || '')
          setValue('phone', data.phone || '')
          setValue('email', data.email || user.email || '')
          setValue('avatar_url', data.avatar_url || '')
        }
      } catch (error) {
        console.error('Error loading profile', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase, setValue])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true)
      setMessage(null)
      
      // Call server action
      await updateProfile({
        fullName: data.full_name,
        phone: data.phone
      })
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la mise à jour.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <nav className="space-y-2">
                  <Link href="/dashboard/owner" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link href="/dashboard/owner/annonces" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    <span>Mes annonces</span>
                  </Link>
                  <Link href="/dashboard/owner/visites" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Demandes de visite</span>
                  </Link>
                  <Link href="/dashboard/owner/profil" className="flex items-center space-x-3 px-4 py-3 bg-red-50 text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Shield className="w-5 h-5" />
                    <span>Mon profil</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111315]">Mon profil</h1>
                <p className="text-gray-500 mt-2">Gérez vos informations personnelles et vos préférences.</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:p-8">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#e4002b] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
                    
                    {message && (
                      <div className={`mb-6 p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                      </div>
                    )}

                    <div className="space-y-6">
                      
                      {/* Avatar Mock */}
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 relative overflow-hidden group">
                          <User className="w-10 h-10" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-[#111315]">Photo de profil</h3>
                          <p className="text-sm text-gray-500 mt-1">JPG, GIF ou PNG. 1MB max.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <User className="w-5 h-5" />
                            </div>
                            <input
                              {...register('full_name', { required: 'Ce champ est requis' })}
                              className="pl-10 w-full rounded-xl border-gray-200 border px-4 py-3 focus:ring-2 focus:ring-[#e4002b] focus:border-transparent outline-none transition-all"
                              placeholder="Jean Dupont"
                            />
                          </div>
                          {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Adresse email</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <Mail className="w-5 h-5" />
                            </div>
                            <input
                              {...register('email')}
                              disabled
                              className="pl-10 w-full rounded-xl border-gray-200 border px-4 py-3 bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                            />
                          </div>
                          <p className="text-xs text-gray-500">L'adresse email ne peut pas être modifiée.</p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <Phone className="w-5 h-5" />
                            </div>
                            <input
                              {...register('phone')}
                              className="pl-10 w-full rounded-xl border-gray-200 border px-4 py-3 focus:ring-2 focus:ring-[#e4002b] focus:border-transparent outline-none transition-all"
                              placeholder="+237 ..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center space-x-2 bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                        >
                          {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                          <span>Enregistrer les modifications</span>
                        </button>
                      </div>

                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
