'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Neighborhood {
  id: string
  name: string
}

interface Media {
  id: string
  url: string
  is_primary: boolean
}

interface Props {
  neighborhoods: Neighborhood[]
  property: any
  media: Media[]
  userId: string
}

export default function EditListingForm({ neighborhoods, property, media: initialMedia, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Existing media from DB
  const [existingMedia, setExistingMedia] = useState<Media[]>(initialMedia)
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([])

  // New images to upload
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  const totalImages = existingMedia.length + newImages.length

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
    
    if (validFiles.length < files.length) {
      setError('Certaines images ont été ignorées (format non supporté ou taille > 5 Mo)')
    }

    const availableSlots = 8 - totalImages
    const imagesToAdd = validFiles.slice(0, availableSlots)
    
    const updatedNewImages = [...newImages, ...imagesToAdd]
    setNewImages(updatedNewImages)
    setNewPreviews(updatedNewImages.map(f => URL.createObjectURL(f)))
  }

  const removeExistingImage = (id: string) => {
    setDeletedMediaIds([...deletedMediaIds, id])
    setExistingMedia(existingMedia.filter(m => m.id !== id))
  }

  const removeNewImage = (index: number) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index)
    setNewImages(updatedNewImages)
    setNewPreviews(updatedNewImages.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const price = parseFloat(formData.get('price') as string)
    const deposit = parseInt(formData.get('deposit') as string) || 0
    const advance = parseInt(formData.get('advance') as string) || 0
    const neighborhood_id = formData.get('neighborhood_id') as string
    const bedrooms = parseInt(formData.get('bedrooms') as string) || 0
    const bathrooms = parseInt(formData.get('bathrooms') as string) || 0
    const surface_area = parseFloat(formData.get('surface_area') as string) || 0
    const description = formData.get('description') as string
    const is_furnished = (formData.get('is_furnished') as string) === 'on'

    try {
      // 1. Update property details
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          title,
          type,
          price,
          deposit,
          advance,
          neighborhood_id: neighborhood_id || null,
          bedrooms,
          bathrooms,
          surface_area,
          description,
          is_furnished,
        })
        .eq('id', property.id)
        .eq('owner_id', userId)

      if (updateError) throw new Error(updateError.message)

      // 2. Delete removed images from DB (and optionally Storage, though DB cascade/cleanup handles it)
      if (deletedMediaIds.length > 0) {
        await supabase.from('property_media').delete().in('id', deletedMediaIds)
      }

      // 3. Upload new images
      if (newImages.length > 0) {
        // Find next available order_index
        let nextIndex = existingMedia.length
        
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i]
          const ext = file.name.split('.').pop()
          const filePath = `${property.id}/${Date.now()}_${i}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from('property_media')
            .upload(filePath, file, { contentType: file.type })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            continue
          }

          const { data: { publicUrl } } = supabase.storage
            .from('property_media')
            .getPublicUrl(filePath)

          // If no existing media is left, make the very first new image primary
          const isPrimary = (existingMedia.length === 0 && i === 0)

          await supabase.from('property_media').insert({
            property_id: property.id,
            url: publicUrl,
            type: 'image',
            is_primary: isPrimary,
            order_index: nextIndex + i,
          })
        }
      }

      // Refresh and redirect
      router.push('/dashboard/owner/annonces')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la modification')
      setLoading(false)
    }
  }

  const statusLabels: Record<string, string> = {
    draft: 'Brouillon',
    pending_moderation: 'En attente de modération',
    published: 'Publiée',
    suspended: 'Suspendue',
    rented: 'Louée',
    stale: 'À reconfirmer',
    hidden: 'Masquée',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/owner/annonces" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes annonces
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8 border-b border-gray-100 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier l'annonce</h1>
              <p className="text-gray-500 mt-1">
                Statut actuel : <span className="font-medium">{statusLabels[property.availability_status] || property.availability_status}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'annonce <span className="text-red-500">*</span></label>
                <input name="title" type="text" required defaultValue={property.title} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de bien <span className="text-red-500">*</span></label>
                <select name="type" required defaultValue={property.type} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all">
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison / Villa</option>
                  <option value="studio">Studio</option>
                  <option value="chambre">Chambre</option>
                  <option value="immeuble">Immeuble</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (FCFA / mois) <span className="text-red-500">*</span></label>
                <input name="price" type="number" required min={0} defaultValue={property.price} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Caution (nombre de mois)</label>
                <input name="deposit" type="number" min={0} defaultValue={property.deposit || 0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Avance (nombre de mois)</label>
                <input name="advance" type="number" min={0} defaultValue={property.advance || 0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quartier (Kribi)</label>
                <select name="neighborhood_id" defaultValue={property.neighborhood_id || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all">
                  <option value="">Sélectionner un quartier...</option>
                  {neighborhoods.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Surface (m²)</label>
                <input name="surface_area" type="number" min={0} defaultValue={property.surface_area || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chambres</label>
                <input name="bedrooms" type="number" min={0} defaultValue={property.bedrooms || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salles de bain</label>
                <input name="bathrooms" type="number" min={0} defaultValue={property.bathrooms || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              <div className="flex items-center gap-3">
                <input name="is_furnished" type="checkbox" id="is_furnished" defaultChecked={property.is_furnished} className="w-5 h-5 rounded border-gray-300 text-[#e4002b] focus:ring-[#e4002b]" />
                <label htmlFor="is_furnished" className="text-sm font-semibold text-gray-700">Meublé</label>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea name="description" rows={5} defaultValue={property.description || ''} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="Décrivez votre bien en détail..."></textarea>
              </div>
            </div>

            {/* Section Photos Edit */}
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Photos du bien ({totalImages}/8)
              </label>
              <p className="text-xs text-gray-400 mb-4">Gérez les photos de votre annonce. La première photo affichée sera la principale.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {/* Existing Images */}
                {existingMedia.map((media, i) => (
                  <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={media.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#e4002b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(media.id)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* New Image Previews */}
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={src} alt={`Nouvelle photo ${i + 1}`} className="w-full h-full object-cover" />
                    {existingMedia.length === 0 && i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#e4002b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Principale
                      </span>
                    )}
                    <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Nouveau
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add button */}
                {totalImages < 8 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#e4002b] transition-colors bg-gray-50"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-500 text-center px-2">Ajouter</span>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
              <Link href="/dashboard/owner/annonces" className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                Annuler
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#e4002b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#c5001f] transition-colors shadow-sm flex items-center disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
