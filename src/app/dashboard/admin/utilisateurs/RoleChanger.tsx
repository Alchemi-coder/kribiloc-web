'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type RoleChangerProps = {
  userId: string
  currentRole: string
}

export default function RoleChanger({ userId, currentRole }: RoleChangerProps) {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(currentRole)
  const router = useRouter()
  const supabase = createClient()

  const handleRoleChange = async (newRole: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir changer ce rôle en ${newRole} ?`)) {
      setRole(currentRole) // reset select
      return
    }

    setLoading(true)
    setRole(newRole)

    try {
      // Server action or direct update if policy allows admin
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      await supabase.from('audit_logs').insert({
        action: 'change_role',
        entity_type: 'profile',
        entity_id: userId,
        details: { oldRole: currentRole, newRole }
      })

      router.refresh()
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error)
      alert('Une erreur est survenue.')
      setRole(currentRole)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={loading}
      className="text-sm border-gray-300 rounded-md shadow-sm focus:border-[#e4002b] focus:ring-[#e4002b] bg-white p-2"
    >
      <option value="visitor">Visiteur</option>
      <option value="tenant">Locataire</option>
      <option value="owner">Propriétaire</option>
      <option value="agent">Agent</option>
      <option value="admin">Administrateur</option>
    </select>
  )
}
