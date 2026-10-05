'use client';

import { useState } from 'react';
import { Heart, Share2, Calendar, Flag, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PropertyActionsProps {
  propertyId: string;
  initialFavorite: boolean;
  userId?: string;
}

export default function PropertyActions({ propertyId, initialFavorite, userId }: PropertyActionsProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const supabase = createClient();

  const handleToggleFavorite = async () => {
    if (!userId) {
      alert("Vous devez être connecté pour ajouter un favori.");
      return;
    }
    setLoading(true);
    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('property_id', propertyId).eq('user_id', userId);
      } else {
        await supabase.from('favorites').insert({ property_id: propertyId, user_id: userId });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Découvrez ce logement sur KribiLoc',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => setShowVisitModal(true)}
          className="w-full sm:w-auto flex-1 bg-[#e4002b] hover:bg-[#c5001f] text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Calendar className="w-5 h-5" />
          Demander une visite
        </button>

        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`p-3 rounded-full border-2 transition-all flex items-center justify-center ${
            isFavorite
              ? 'border-[#e4002b] text-[#e4002b] bg-red-50'
              : 'border-gray-200 text-gray-500 hover:border-[#111315] hover:text-[#111315]'
          }`}
          title="Ajouter aux favoris"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleShare}
          className="p-3 rounded-full border-2 border-gray-200 text-gray-500 hover:border-[#111315] hover:text-[#111315] transition-all flex items-center justify-center"
          title="Partager"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-4 text-center sm:text-right">
        <button
          onClick={() => setShowReportModal(true)}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center sm:justify-end gap-1 w-full"
        >
          <Flag className="w-3 h-3" />
          Signaler cette annonce
        </button>
      </div>

      {showVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowVisitModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-[#111315]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#111315] mb-4">Demander une visite</h3>
            <p className="text-gray-500 mb-6 text-sm">Ce formulaire de demande de visite est en cours de développement.</p>
            <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 text-sm">
              [Placeholder VisitRequestForm]
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowReportModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-[#111315]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#111315] mb-4">Signaler l'annonce</h3>
            <p className="text-gray-500 mb-6 text-sm">Ce formulaire de signalement est en cours de développement.</p>
            <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 text-sm">
              [Placeholder ReportForm]
            </div>
          </div>
        </div>
      )}
    </>
  );
}
