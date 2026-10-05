"use client";

import { useEffect, useState } from 'react';

interface EthicalFomoProps {
  propertyId: string;
  viewCount24h: number; 
  favoriteCount: number;
}

export function EthicalFomo({ propertyId, viewCount24h, favoriteCount }: EthicalFomoProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Apparaît subtilement après 3 secondes de lecture 
    const t = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // On n'affiche le composant que si les statistiques sont significatives (Biais de désirabilité)
  if (!isVisible || (viewCount24h < 5 && favoriteCount === 0)) return null;

  return (
    <div className="border-l-4 border-[#e4002b] bg-card p-4 shadow-md transition-opacity duration-500">
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1">👀</div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Ce bien attire l'attention</h4>
          <p className="text-sm text-muted-foreground">
            Vu par <strong className="text-foreground">{viewCount24h} personnes</strong> ces dernières 24h et 
            sauvegardé par <strong className="text-foreground">{favoriteCount} locataires</strong> potentiels.
          </p>
          <p className="text-[10px] text-muted-foreground mt-3 font-mono uppercase tracking-widest border-t border-border/50 pt-2">
            * Statistiques réelles certifiées par KribiLoc
          </p>
        </div>
      </div>
    </div>
  );
}
