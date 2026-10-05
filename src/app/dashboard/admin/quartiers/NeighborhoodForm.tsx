'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NeighborhoodForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!slug || slug === generateSlug(name.slice(0,-1))) {
      setSlug(generateSlug(val))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) return

    setLoading(true)
    try {
      const { error } = await supabase.from('neighborhoods').insert({
        name,
        slug,
        city: 'Kribi',
        active: true
      })
      
      if (error) throw error
      setName('')
      setSlug('')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Erreur lors de la création.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du quartier</label>
        <input 
          type="text" 
          value={name}
          onChange={handleNameChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#e4002b] focus:ring-[#e4002b] p-2 border" 
          placeholder="Ex: Mpita"
          required
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input 
          type="text" 
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#e4002b] focus:ring-[#e4002b] p-2 border" 
          placeholder="ex-mpita"
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full md:w-auto bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Création...' : 'Ajouter'}
      </button>
    </form>
  )
}
