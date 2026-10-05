'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Heart, Bed, Bath, Maximize2, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface PropertyCardProps {
  id: string
  title: string
  price: number
  deposit?: number
  advance?: number
  type: string
  neighborhood_name?: string
  bedrooms?: number
  bathrooms?: number
  surface_area?: number
  is_furnished?: boolean
  availability_status: string
  image_url?: string
  is_certified?: boolean
  certification_level?: string
  certification_date?: string
  is_boosted?: boolean
  is_favorited?: boolean
  onToggleFavorite?: (id: string) => void
}

export default function PropertyCard({
  id,
  title,
  price,
  neighborhood_name,
  bedrooms,
  bathrooms,
  surface_area,
  image_url,
  is_certified,
  is_boosted,
  is_favorited,
  onToggleFavorite
}: PropertyCardProps) {
  const [imgError, setImgError] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggleFavorite) {
      onToggleFavorite(id)
    }
  }

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(price)

  return (
    <Link href={`/locations/${id}`} className="block w-full">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all h-full flex flex-col overflow-hidden relative"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {is_boosted && (
            <span className="bg-[#e4002b] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" /> Sponsorisé
            </span>
          )}
          {is_certified && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <Shield className="w-3 h-3" /> Certifié
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 hover:text-[#e4002b] transition-colors z-10 shadow-sm"
        >
          <Heart className={`w-5 h-5 ${is_favorited ? 'fill-[#e4002b] text-[#e4002b]' : ''}`} />
        </button>

        {/* Image */}
        <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center shrink-0">
          {image_url && !imgError ? (
            <Image
              src={image_url}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Home className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="text-xl font-bold text-[#e4002b] mb-1">
            {formattedPrice} FCFA<span className="text-sm text-gray-500 font-normal">/mois</span>
          </div>
          
          <h3 className="font-semibold text-[#111315] text-lg line-clamp-1 mb-1" title={title}>
            {title}
          </h3>
          
          <div className="text-gray-500 text-sm mb-4 line-clamp-1">
            {neighborhood_name || 'Quartier non spécifié'}
          </div>

          <div className="mt-auto flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
            {bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" /> {bedrooms}
              </div>
            )}
            {bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" /> {bathrooms}
              </div>
            )}
            {surface_area !== undefined && (
              <div className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4" /> {surface_area} m²
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
