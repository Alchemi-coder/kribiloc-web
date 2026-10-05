import React from 'react'

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgClass = 'bg-gray-100 text-gray-800'
  let label = status

  switch (status.toLowerCase()) {
    case 'published':
      bgClass = 'bg-green-100 text-green-800'
      label = 'Publiée'
      break
    case 'draft':
      bgClass = 'bg-gray-100 text-gray-800'
      label = 'Brouillon'
      break
    case 'pending_moderation':
      bgClass = 'bg-yellow-100 text-yellow-800'
      label = 'En attente'
      break
    case 'suspended':
      bgClass = 'bg-red-100 text-red-800'
      label = 'Suspendue'
      break
    case 'rented':
      bgClass = 'bg-blue-100 text-blue-800'
      label = 'Louée'
      break
    case 'stale':
      bgClass = 'bg-orange-100 text-orange-800'
      label = 'À reconfirmer'
      break
    case 'hidden':
      bgClass = 'bg-gray-200 text-gray-600'
      label = 'Masquée'
      break
    case 'archived':
      bgClass = 'bg-gray-200 text-gray-600'
      label = 'Archivée'
      break
    case 'requested':
      bgClass = 'bg-yellow-100 text-yellow-800'
      label = 'Demandée'
      break
    case 'accepted':
      bgClass = 'bg-green-100 text-green-800'
      label = 'Acceptée'
      break
    case 'refused':
      bgClass = 'bg-red-100 text-red-800'
      label = 'Refusée'
      break
    case 'completed':
      bgClass = 'bg-blue-100 text-blue-800'
      label = 'Terminée'
      break
    case 'cancelled':
      bgClass = 'bg-gray-100 text-gray-600'
      label = 'Annulée'
      break
    default:
      bgClass = 'bg-gray-100 text-gray-800'
      label = status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgClass}`}>
      {label}
    </span>
  )
}
