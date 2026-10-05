'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ReportActionsProps = {
  reportId: string
  currentStatus: string
}

export default function ReportActions({ reportId, currentStatus }: ReportActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (status: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId)
      
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour du signalement.')
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === 'resolved' || currentStatus === 'dismissed') {
    return <span className="text-sm text-gray-500 italic">Clôturé</span>
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {currentStatus === 'open' && (
        <button
          onClick={() => handleUpdate('in_review')}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md transition-colors"
        >
          Traiter
        </button>
      )}
      <button
        onClick={() => handleUpdate('resolved')}
        disabled={loading}
        className="text-xs px-3 py-1.5 bg-green-100 text-green-800 hover:bg-green-200 rounded-md transition-colors"
      >
        Résolu
      </button>
      <button
        onClick={() => handleUpdate('dismissed')}
        disabled={loading}
        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
      >
        Rejeter
      </button>
    </div>
  )
}
