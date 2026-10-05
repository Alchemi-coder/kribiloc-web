'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [role, setRole] = useState<'tenant' | 'owner' | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          role: role
        }
      }
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
    } else {
      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setSuccess(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/">
          <Image src="/logo-kribiloc.png" alt="KribiLoc" width={60} height={60} className="mb-6" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Créer un compte
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {success ? (
             <div className="text-center">
               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                 <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">Compte créé !</h3>
               <p className="text-sm text-gray-500">Vérifiez votre email pour confirmer votre inscription.</p>
             </div>
          ) : (
            <>
              {!role ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-6">Sélectionnez votre profil</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setRole('tenant')}
                      className="border-2 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm font-medium text-center text-gray-900">Je cherche un logement</span>
                    </div>

                    <div 
                      onClick={() => setRole('owner')}
                      className="border-2 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span className="text-sm font-medium text-center text-gray-900">Je suis propriétaire</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Profil : {role === 'tenant' ? 'Locataire' : 'Propriétaire'}
                    </span>
                    <button type="button" onClick={() => setRole(null)} className="text-sm text-[#e4002b] hover:underline">
                      Changer
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <div className="mt-1">
                      <input id="full_name" name="full_name" type="text" required value={formData.full_name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e4002b] focus:border-[#e4002b] sm:text-sm text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                      <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e4002b] focus:border-[#e4002b] sm:text-sm text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <div className="mt-1">
                      <input id="phone" name="phone" type="tel" required placeholder="+237 6XX XXX XXX" value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e4002b] focus:border-[#e4002b] sm:text-sm text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <div className="mt-1">
                      <input id="password" name="password" type="password" required minLength={6} value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e4002b] focus:border-[#e4002b] sm:text-sm text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <div className="mt-1">
                      <input id="password_confirm" name="password_confirm" type="password" required value={formData.password_confirm} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e4002b] focus:border-[#e4002b] sm:text-sm text-gray-900" />
                    </div>
                  </div>

                  <div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-[#e4002b] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e4002b] disabled:opacity-50">
                      {loading ? 'Chargement...' : 'Créer mon compte'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  <Link href="/connexion" className="font-medium text-[#e4002b] hover:text-red-700">
                    Déjà un compte ? Se connecter
                  </Link>
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
