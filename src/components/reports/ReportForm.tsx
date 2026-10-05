'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const reportSchema = z.object({
  category: z.string().min(1, 'Veuillez sélectionner un motif'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères')
})

type ReportFormValues = z.infer<typeof reportSchema>

interface ReportFormProps {
  propertyId: string
  onClose?: () => void
}

const CATEGORIES = [
  'Fausses informations',
  'Photos non conformes',
  'Logement indisponible',
  'Arnaque suspectée',
  'Contenu inapproprié',
  'Autre'
]

export default function ReportForm({ propertyId, onClose }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema)
  })

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        throw new Error('Vous devez être connecté pour signaler une annonce')
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          property_id: propertyId,
          reporter_id: userData.user.id,
          category: data.category,
          description: data.description,
          status: 'pending'
        })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center">
        <h3 className="font-semibold mb-2">Signalement reçu</h3>
        <p className="text-sm mb-4">Notre équipe va examiner ce logement dans les plus brefs délais.</p>
        {onClose && (
          <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700">
            Fermer
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Motif du signalement
        </label>
        <select
          id="category"
          {...register('category')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#e4002b] focus:border-[#e4002b] outline-none bg-white"
        >
          <option value="">Sélectionnez un motif...</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Détails supplémentaires
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#e4002b] focus:border-[#e4002b] outline-none"
          placeholder="Veuillez décrire le problème rencontré..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-[#111315] text-[#111315] rounded-full font-semibold hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#e4002b] text-white rounded-full font-semibold hover:bg-[#c5001f] transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertTriangle className="w-5 h-5" />}
          Envoyer le signalement
        </button>
      </div>
    </form>
  )
}
