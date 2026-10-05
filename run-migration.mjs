/**
 * Script de migration — exécute le SQL initial sur Supabase via l'API REST.
 * Usage: node run-migration.mjs
 */

import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://dwluwezewptpytqthocg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3bHV3ZXpld3B0cHl0cXRob2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzgyNjU0NSwiZXhwIjoyMTAzNDAyNTQ1fQ.roX1SSzyEyY2g_-pP0_WdQSF7QewFu-6ZBoz_5_LGuQ';

const sql = readFileSync('./supabase/migrations/20260825000000_initial_schema.sql', 'utf-8');

// Supabase expose un endpoint SQL via PostgREST RPC ou via le Management API.
// On utilise le endpoint pg/query via le service_role.
const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  },
  body: JSON.stringify({ query: sql }),
});

if (!res.ok) {
  // L'endpoint RPC ne supporte pas les requêtes SQL brutes.
  // On va plutôt diviser et exécuter via pg directement.
  console.log('⚠ L\'API REST ne supporte pas les requêtes SQL brutes.');
  console.log('→ Copiez le contenu du fichier SQL dans le SQL Editor de Supabase :');
  console.log('  https://supabase.com/dashboard/project/dwluwezewptpytqthocg/sql/new');
  console.log('');
  console.log('Le fichier se trouve ici :');
  console.log('  supabase/migrations/20260825000000_initial_schema.sql');
} else {
  const data = await res.json();
  console.log('✓ Migration exécutée avec succès !', data);
}
