'use client'

import { useState } from 'react'
import { updateVisitRequest } from '@/lib/actions'
import { Check, X, Calendar } from 'lucide-react'

type VisitActionsProps = {
  requestId: string
  currentStatus: string
}

export default function VisitActions({ requestId, currentStatus }: VisitActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (status: string) => {
    try {
      setLoading(status)
      await updateVisitRequest({ visitId: requestId, status: status as any })
    } catch (error) {
      console.error('Error updating visit request:', error)
      alert('Une erreur est survenue lors de la mise à jour.')
    } finally {
      setLoading(null)
    }
  }

  if (currentStatus === 'accepted') {
    return <span className="text-green-600 font-medium text-sm flex items-center"><Check className="w-4 h-4 mr-1"/> Acceptée</span>
  }
  
  if (currentStatus === 'rejected') {
    return <span className="text-red-600 font-medium text-sm flex items-center"><X className="w-4 h-4 mr-1"/> Refusée</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleAction('accepted')}
        disabled={loading !== null}
        className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading === 'accepted' ? '...' : <><Check className="w-4 h-4 mr-1.5" /> Accepter</>}
      </button>
      
      <button
        onClick={() => handleAction('rejected')}
        disabled={loading !== null}
        className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading === 'rejected' ? '...' : <><X className="w-4 h-4 mr-1.5" /> Refuser</>}
      </button>
      
      <button
        onClick={() => handleAction('rescheduled')}
        disabled={loading !== null}
        className="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading === 'rescheduled' ? '...' : <><Calendar className="w-4 h-4 mr-1.5" /> Replanifier</>}
      </button>
    </div>
  )
}
