'use client';

import { useState } from 'react';
import { Check, X, UserPlus } from 'lucide-react';
// import { updateCertificationStatus, assignAgent } from '@/lib/actions';

export function CertificationActions({ 
  requestId, 
  status, 
  agents 
}: { 
  requestId: string; 
  status: string;
  agents: any[];
}) {
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleAssign = async () => {
    if (!selectedAgent) return;
    try {
      setLoading(true);
      // await assignAgent(requestId, selectedAgent);
      setCurrentStatus('queued');
      alert('Agent assigné avec succès.');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'assignation.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      // await updateCertificationStatus(requestId, newStatus);
      setCurrentStatus(newStatus);
      alert('Statut mis à jour.');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'paid' || currentStatus === 'queued') {
    return (
      <div className="flex flex-col gap-2">
        <select 
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-[#e4002b] focus:border-[#e4002b]"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <option value="">Sélectionner un agent</option>
          {agents?.map(a => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={!selectedAgent || loading}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#111315] hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          Assigner
        </button>
      </div>
    );
  }

  if (currentStatus === 'submitted') {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusUpdate('approved')}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Approuver
        </button>
        <button
          onClick={() => handleStatusUpdate('rejected')}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Rejeter
        </button>
      </div>
    );
  }

  return (
    <span className="text-sm text-gray-500 italic">
      Aucune action requise
    </span>
  );
}
