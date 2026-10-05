import React from 'react'

interface PriceDisplayProps {
  price: number
  deposit?: number
  advance?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function PriceDisplay({ price, deposit, advance, size = 'md' }: PriceDisplayProps) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val)
  }

  let mainSize = 'text-xl'
  let subSize = 'text-xs'

  if (size === 'sm') {
    mainSize = 'text-lg'
    subSize = 'text-[10px]'
  } else if (size === 'lg') {
    mainSize = 'text-3xl'
    subSize = 'text-sm'
  }

  return (
    <div className="flex flex-col">
      <div className={`font-bold text-[#e4002b] ${mainSize}`}>
        {formatPrice(price)} FCFA<span className="font-normal text-gray-500 text-sm">/mois</span>
      </div>
      
      {(deposit !== undefined || advance !== undefined) && (
        <div className={`text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1 ${subSize}`}>
          {deposit !== undefined && (
            <span>Caution: {formatPrice(deposit)} FCFA</span>
          )}
          {advance !== undefined && (
            <span>Avance: {formatPrice(advance)} FCFA</span>
          )}
        </div>
      )}
    </div>
  )
}
