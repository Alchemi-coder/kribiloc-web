'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Neighborhood {
  id: string
  name: string
}

interface Props {
  neighborhoods: Neighborhood[]
  userId: string
}

export default function NewListingForm({ neighborhoods, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
    
    if (validFiles.length < files.length) {
      setError('Certaines images ont été ignorées (format non supporté ou taille > 5 Mo)')
    }

    const newImages = [...images, ...validFiles].slice(0, 8)
    setImages(newImages)
    const newPreviews = newImages.map(f => URL.createObjectURL(f))
    setPreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, submitType: 'draft' | 'submit') => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const price = parseFloat(formData.get('price') as string)
    const neighborhood_id = formData.get('neighborhood_id') as string
    const bedrooms = parseInt(formData.get('bedrooms') as string) || 0
    const bathrooms = parseInt(formData.get('bathrooms') as string) || 0
    const surface_area = parseFloat(formData.get('surface_area') as string) || 0
    const description = formData.get('description') as string
    const deposit = parseInt(formData.get('deposit') as string) || 0
    const advance = parseInt(formData.get('advance') as string) || 0
    const is_furnished = (formData.get('is_furnished') as string) === 'on'

    const status = submitType === 'draft' ? 'draft' : 'pending_moderation'

    try {
      // 1. Insert property
      const { data: property, error: insertError } = await supabase
        .from('properties')
        .insert({
          owner_id: userId,
          title,
          type,
          price,
          neighborhood_id: neighborhood_id || null,
          bedrooms,
          bathrooms,
          surface_area,
          description,
          deposit,
          advance,
          is_furnished,
          availability_status: status,
        })
        .select('id')
        .single()

      if (insertError || !property) {
        throw new Error(insertError?.message || 'Erreur lors de la création de l\'annonce')
      }

      // 2. Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
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

          await supabase.from('property_media').insert({
            property_id: property.id,
            url: publicUrl,
            type: 'image',
            is_primary: i === 0,
            order_index: i,
          })
        }
      }

      router.push('/dashboard/owner/annonces')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/owner/annonces" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes annonces
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Publier une annonce</h1>
            <p className="text-gray-500 mt-1">Remplissez les informations de votre bien. Vous pouvez l'enregistrer en brouillon ou l'envoyer directement en modération.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => {
            // The actual submit is handled by the buttons below
          }} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Titre */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'annonce <span className="text-red-500">*</span></label>
                <input name="title" type="text" required className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: Grand appartement vue mer à Ngoyè" />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de bien <span className="text-red-500">*</span></label>
                <select name="type" required className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all">
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison / Villa</option>
                  <option value="studio">Studio</option>
                  <option value="chambre">Chambre</option>
                  <option value="immeuble">Immeuble</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (FCFA / mois) <span className="text-red-500">*</span></label>
                <input name="price" type="number" required min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 150000" />
              </div>

              {/* Caution */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Caution (nombre de mois)</label>
                <input name="deposit" type="number" min={0} defaultValue={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              {/* Avance */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Avance (nombre de mois)</label>
                <input name="advance" type="number" min={0} defaultValue={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" />
              </div>

              {/* Quartier */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quartier (Kribi)</label>
                <select name="neighborhood_id" className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all">
                  <option value="">Sélectionner un quartier...</option>
                  {neighborhoods.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              {/* Surface */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Surface (m²)</label>
                <input name="surface_area" type="number" min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 80" />
              </div>

              {/* Chambres */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chambres</label>
                <input name="bedrooms" type="number" min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 2" />
              </div>

              {/* Salles de bain */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salles de bain</label>
                <input name="bathrooms" type="number" min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 1" />
              </div>

              {/* Meublé */}
              <div className="flex items-center gap-3">
                <input name="is_furnished" type="checkbox" id="is_furnished" className="w-5 h-5 rounded border-gray-300 text-[#e4002b] focus:ring-[#e4002b]" />
                <label htmlFor="is_furnished" className="text-sm font-semibold text-gray-700">Meublé</label>
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea name="description" rows={5} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="Décrivez votre bien en détail : emplacement, équipements, accès, etc."></textarea>
              </div>
            </div>

            {/* Section Photos */}
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Photos du bien <span className="text-[#e4002b]">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-4">Ajoutez jusqu'à 8 photos (JPG, PNG — max 5 Mo chacune). La première photo sera la photo principale.</p>

              {/* Zone de dépôt */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#e4002b] hover:bg-red-50/30 transition-all"
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">Cliquez pour ajouter des photos</p>
                <p className="text-xs text-gray-400 mt-1">ou glissez-déposez vos images ici</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>

              {/* Prévisualisations */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-[#e4002b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Principale
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {previews.length < 8 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#e4002b] transition-colors"
                    >
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-xs text-gray-400 mt-1">Ajouter</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notice modération */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
              <strong>ℹ️ Comment ça marche ?</strong><br />
              <span className="text-amber-700">
                En <strong>brouillon</strong> : votre annonce est sauvegardée mais invisible du public. Vous pouvez la compléter plus tard.<br />
                En <strong>soumettant</strong> : votre annonce part en modération. Elle sera visible dès qu'un admin l'approuve (généralement sous 24h).
              </span>
            </div>

            {/* Boutons */}
            <div className="mt-2 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={(e) => {
                  const form = (e.target as HTMLButtonElement).closest('form') as HTMLFormElement
                  handleSubmit({ preventDefault: () => {}, currentTarget: form } as any, 'draft')
                }}
                className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Enregistrer en brouillon
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={(e) => {
                  const form = (e.target as HTMLButtonElement).closest('form') as HTMLFormElement
                  handleSubmit({ preventDefault: () => {}, currentTarget: form } as any, 'submit')
                }}
                className="inline-flex items-center justify-center bg-[#e4002b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#c5001f] transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                Soumettre pour publication
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
