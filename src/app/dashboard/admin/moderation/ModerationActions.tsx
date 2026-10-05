'use client';

import { useState } from 'react';
import { Check, X, PauseCircle } from 'lucide-react';
// import { adminModerateProperty } from '@/lib/actions';

export function ModerationActions({ propertyId, initialStatus }: { propertyId: string, initialStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  const handleAction = async (action: 'publish' | 'suspend' | 'reject') => {
    try {
      setLoading(true);
      // await adminModerateProperty(propertyId, action);
      
      // Temporary optimistic update until server action is linked
      if (action === 'publish') setCurrentStatus('published');
      if (action === 'suspend') setCurrentStatus('suspended');
      if (action === 'reject') setCurrentStatus('rejected');
      
      alert(`Action '${action}' effectuée avec succès.`);
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'published') {
    return <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">Publié</span>;
  }
  
  if (currentStatus === 'suspended') {
    return <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">Suspendu</span>;
  }
  
  if (currentStatus === 'rejected') {
    return <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">Rejeté</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleAction('publish')}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        <Check className="w-4 h-4" />
        Publier
      </button>
      <button
        onClick={() => handleAction('suspend')}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        <PauseCircle className="w-4 h-4" />
        Suspendre
      </button>
      <button
        onClick={() => handleAction('reject')}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        <X className="w-4 h-4" />
        Rejeter
      </button>
    </div>
  );
}
