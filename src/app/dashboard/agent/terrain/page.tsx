'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ChevronDown, ChevronUp, MapPin, Navigation, Save, 
  CheckCircle, XCircle, AlertTriangle, Camera
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function AgentTerrainPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const missionId = searchParams.get('mission');
  const supabase = createClient();
  
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>('Identite du bien');
  const [checks, setChecks] = useState<Record<string, {status: string, comment: string}>>({});
  const [globalNotes, setGlobalNotes] = useState('');
  const [score, setScore] = useState(5);
  const [recommendation, setRecommendation] = useState('favorable');
  
  const categories = [
    { name: 'Identite du bien', items: ['Type confirme', 'Nombre de pieces', 'Etage', 'Disponibilite'] },
    { name: 'Localisation', items: ['GPS coherent', 'Quartier confirme', 'Accessibilite'] },
    { name: 'Eau', items: ['CDE', 'Forage', 'Citerne', 'Fonctionnement observe'] },
    { name: 'Electricite', items: ['ENEO', 'Compteur prepaye', 'Individuel', 'Fonctionnement'] },
    { name: 'Batiment', items: ['Etat visible', 'Ventilation', 'Eclairage', 'Portes/fenetres', 'Sanitaires'] },
    { name: 'Securite', items: ['Cloture', 'Portail', 'Gardien', 'Eclairage exterieur'] },
    { name: 'Acces', items: ['Route', 'Parking', 'Acces voiture/moto'] }
  ];

  useEffect(() => {
    if (missionId) {
      loadMission();
      const saved = localStorage.getItem(`mission_${missionId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setChecks(parsed.checks || {});
          setGlobalNotes(parsed.globalNotes || '');
          setScore(parsed.score || 5);
          setRecommendation(parsed.recommendation || 'favorable');
        } catch (e) {
          console.error("Could not parse saved mission data");
        }
      }
    } else {
      setLoading(false);
    }
  }, [missionId]);

  useEffect(() => {
    if (missionId && Object.keys(checks).length > 0) {
      localStorage.setItem(`mission_${missionId}`, JSON.stringify({ checks, globalNotes, score, recommendation }));
    }
  }, [checks, globalNotes, score, recommendation, missionId]);

  const loadMission = async () => {
    const { data } = await supabase
      .from('certification_visits')
      .select('id, status, certification_requests ( properties ( title, address_text ) )')
      .eq('id', missionId)
      .single();
    if (data) {
      setMission(data);
      if (data.status === 'scheduled') {
        await supabase.from('certification_visits').update({ status: 'in_progress' }).eq('id', missionId);
      }
    }
    setLoading(false);
  };

  const getLoc = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  };

  const updateCheck = (item: string, status: string) => {
    setChecks(prev => ({ ...prev, [item]: { ...prev[item], status } }));
  };

  const updateComment = (item: string, comment: string) => {
    setChecks(prev => ({ ...prev, [item]: { ...prev[item], comment } }));
  };

  const handleSubmit = async () => {
    if (!missionId) return;
    setSaving(true);
    try {
      await supabase.from('certification_visits').update({ status: 'completed', notes: globalNotes }).eq('id', missionId);
      localStorage.removeItem(`mission_${missionId}`);
      alert('Rapport soumis avec succes!');
      router.push('/dashboard/agent/missions');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la soumission du rapport.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
<div className="flex-1 flex items-center justify-center"><p>Chargement de la mission...</p></div>
      </div>
    );
  }

  if (!missionId || !mission) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
<div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Mission introuvable</h1>
          <p className="text-gray-500 mb-6">La mission demandee nexiste pas ou nest plus accessible.</p>
          <button onClick={() => router.push('/dashboard/agent/missions')} className="bg-[#111315] text-white px-6 py-3 rounded-full font-medium">
            Retour aux missions
          </button>
        </div>
      </div>
    );
  }

  const property = mission.certification_requests?.properties;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-24">
      <div className="bg-[#111315] text-white p-4 sticky top-0 z-10 shadow-md">
        <h1 className="text-lg font-bold line-clamp-1">{property?.title || 'Inspection terrain'}</h1>
        <p className="text-sm text-gray-400 line-clamp-1">{property?.address_text}</p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#e4002b]" />
              Position GPS
            </h2>
            <button onClick={getLoc} className="bg-gray-100 p-3 rounded-full hover:bg-gray-200">
              <Navigation className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          {location ? (
            <p className="text-sm text-green-600 font-mono">Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}</p>
          ) : (
            <p className="text-sm text-gray-500">Position non capturee. Appuyez sur licone.</p>
          )}
        </div>

        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className="w-full p-4 flex items-center justify-between font-semibold text-lg bg-white"
            >
              <span>{cat.name}</span>
              {activeCategory === cat.name ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {activeCategory === cat.name && (
              <div className="p-4 pt-0 space-y-6 border-t border-gray-50">
                {cat.items.map(item => (
                  <div key={item} className="space-y-3">
                    <p className="font-medium text-[#111315]">{item}</p>
                    <div className="flex space-x-2">
                      <button onClick={() => updateCheck(item, 'ok')} className={`flex-1 flex justify-center py-3 rounded-xl border-2 transition-colors ${checks[item]?.status === 'ok' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button onClick={() => updateCheck(item, 'issue')} className={`flex-1 flex justify-center py-3 rounded-xl border-2 transition-colors ${checks[item]?.status === 'issue' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500'}`}>
                        <XCircle className="w-6 h-6" />
                      </button>
                      <button onClick={() => updateCheck(item, 'na')} className={`flex-1 flex justify-center py-3 rounded-xl border-2 transition-colors font-bold ${checks[item]?.status === 'na' ? 'border-gray-500 bg-gray-100 text-gray-700' : 'border-gray-200 text-gray-500'}`}>
                        N/A
                      </button>
                    </div>
                    {checks[item]?.status === 'issue' && (
                      <input
                        type="text"
                        placeholder="Preciser le probleme..."
                        value={checks[item]?.comment || ''}
                        onChange={(e) => updateComment(item, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl mt-2 text-sm focus:ring-[#e4002b] focus:border-[#e4002b]"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-lg flex items-center mb-4">
            <Camera className="w-5 h-5 mr-2 text-[#e4002b]" />
            Medias (Photos)
          </h2>
          <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex flex-col items-center justify-center">
            <Camera className="w-8 h-8 mb-2" />
            <span>Prendre une photo (Bientot)</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-6">
          <h2 className="font-semibold text-lg text-[#111315]">Conclusion et Notes</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note globale (sur 10) : <span className="font-bold text-lg text-[#e4002b]">{score}</span>
            </label>
            <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full accent-[#e4002b]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommandation</label>
            <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl bg-white text-lg focus:ring-[#e4002b] focus:border-[#e4002b]">
              <option value="favorable">Avis Favorable</option>
              <option value="reserve">Avis Reserve (des corrections necessaires)</option>
              <option value="defavorable">Avis Defavorable (ne pas certifier)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observations generales</label>
            <textarea rows={4} value={globalNotes} onChange={(e) => setGlobalNotes(e.target.value)} placeholder="Saisissez vos notes..." className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#e4002b] focus:border-[#e4002b]"></textarea>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <button onClick={handleSubmit} disabled={saving} className="w-full max-w-2xl mx-auto flex items-center justify-center bg-[#e4002b] text-white rounded-xl py-4 font-bold text-lg hover:bg-[#c5001f] disabled:opacity-70">
          {saving ? 'Enregistrement...' : 'Soumettre le rapport'}
          {!saving && <Save className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </div>
  );
}

export default function AgentTerrainPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement...</p>
      </div>
    }>
      <AgentTerrainPageInner />
    </Suspense>
  );
}
