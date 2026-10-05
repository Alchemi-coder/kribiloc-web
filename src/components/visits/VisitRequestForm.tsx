'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const visitSchema = z.object({
  preferred_date: z.string().min(1, 'La date est requise'),
  message: z.string().optional(),
  phone: z.string().min(8, 'Numéro de téléphone invalide')
})

type VisitFormValues = z.infer<typeof visitSchema>

interface VisitRequestFormProps {
  propertyId: string
  ownerId: string
  onClose?: () => void
}

export default function VisitRequestForm({ propertyId, ownerId, onClose }: VisitRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema)
  })

  const onSubmit = async (data: VisitFormValues) => {
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError || !userData?.user) {
        throw new Error('Vous devez être connecté pour demander une visite')
      }

      const { error } = await supabase
        .from('visit_requests')
        .insert({
          property_id: propertyId,
          tenant_id: userData.user.id,
          owner_id: ownerId,
          preferred_date: data.preferred_date,
          message: data.message,
          tenant_phone: data.phone,
          status: 'requested'
        })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la demande.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center">
        <h3 className="font-semibold mb-2">Demande envoyée !</h3>
        <p className="text-sm mb-4">Le propriétaire ou l'agent a été notifié de votre demande de visite.</p>
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
        <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-1">
          Date et heure souhaitées
        </label>
        <input
          type="datetime-local"
          id="preferred_date"
          {...register('preferred_date')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#e4002b] focus:border-[#e4002b] outline-none"
        />
        {errors.preferred_date && (
          <p className="text-red-500 text-xs mt-1">{errors.preferred_date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Votre numéro de téléphone
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="Ex: +237 600 000 000"
          {...register('phone')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#e4002b] focus:border-[#e4002b] outline-none"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message pour le propriétaire (Optionnel)
        </label>
        <textarea
          id="message"
          rows={3}
          {...register('message')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#e4002b] focus:border-[#e4002b] outline-none"
          placeholder="Précisez si vous avez des exigences particulières..."
        />
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
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
          Demander une visite
        </button>
      </div>
    </form>
  )
}
