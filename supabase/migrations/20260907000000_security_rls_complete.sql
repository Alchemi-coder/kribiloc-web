-- ============================================================
-- Migration de sécurité : RLS complète pour KribiLoc
-- Audit S01-S20 / K01-K20 du cahier des charges
-- Date : 2026-09-07
-- ============================================================

-- ============================================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES MANQUANTES
-- ============================================================

-- Tables déjà activées dans la migration initiale :
-- profiles, properties, property_media, visit_requests, payments

-- Tables ajoutées maintenant :
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE boost_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_reports ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. POLITIQUES POUR LES TABLES MANQUANTES
-- ============================================================

-- --------------------------------------------------------
-- Neighborhoods (lecture publique, écriture admin uniquement)
-- --------------------------------------------------------
CREATE POLICY "Neighborhoods are viewable by everyone"
  ON neighborhoods FOR SELECT USING (true);

-- --------------------------------------------------------
-- Verification Badges (lecture publique, écriture admin/agent)
-- --------------------------------------------------------
CREATE POLICY "Verification badges are viewable by everyone"
  ON verification_badges FOR SELECT USING (true);

-- --------------------------------------------------------
-- Property Media (lecture publique, écriture propriétaire)
-- --------------------------------------------------------
CREATE POLICY "Property media viewable by everyone"
  ON property_media FOR SELECT USING (true);

CREATE POLICY "Owners can insert property media"
  ON property_media FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update property media"
  ON property_media FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete property media"
  ON property_media FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- Visit Requests (locataire + propriétaire concernés)
-- --------------------------------------------------------
CREATE POLICY "Tenants can view own requests"
  ON visit_requests FOR SELECT USING (auth.uid() = tenant_id);

CREATE POLICY "Owners can view requests for their properties"
  ON visit_requests FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Tenants can insert requests"
  ON visit_requests FOR INSERT WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Tenants can update own requests"
  ON visit_requests FOR UPDATE USING (auth.uid() = tenant_id);

CREATE POLICY "Owners can update requests for their properties"
  ON visit_requests FOR UPDATE USING (auth.uid() = owner_id);

-- --------------------------------------------------------
-- Payments (l'utilisateur voit ses propres paiements)
-- --------------------------------------------------------
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT USING (auth.uid() = payer_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- --------------------------------------------------------
-- Favorites (l'utilisateur gère ses favoris)
-- --------------------------------------------------------
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- View Events (insertion libre, lecture restreinte)
-- --------------------------------------------------------
CREATE POLICY "Anyone can insert view events"
  ON view_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own view events"
  ON view_events FOR SELECT USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- Search Events (insertion libre, lecture restreinte)
-- --------------------------------------------------------
CREATE POLICY "Anyone can insert search events"
  ON search_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own search events"
  ON search_events FOR SELECT USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- Reports / Signalements (l'auteur peut créer et voir)
-- --------------------------------------------------------
CREATE POLICY "Users can insert reports"
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- --------------------------------------------------------
-- Boost Orders (propriétaire concerné)
-- --------------------------------------------------------
CREATE POLICY "Buyers can view own boost orders"
  ON boost_orders FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can insert boost orders"
  ON boost_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- --------------------------------------------------------
-- Subscription Plans (lecture publique)
-- --------------------------------------------------------
CREATE POLICY "Subscription plans are viewable by everyone"
  ON subscription_plans FOR SELECT USING (true);

-- --------------------------------------------------------
-- Subscriptions (l'utilisateur gère ses abonnements)
-- --------------------------------------------------------
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- Notifications (l'utilisateur voit ses propres notifications)
-- --------------------------------------------------------
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- Audit Logs (aucun accès public - admin uniquement via service_role)
-- --------------------------------------------------------
-- Pas de politique = aucun utilisateur ne peut lire/écrire directement.
-- Seul le service_role (serveur) peut y accéder via les triggers SECURITY DEFINER.

-- --------------------------------------------------------
-- App Settings (lecture publique, écriture admin via service_role)
-- --------------------------------------------------------
CREATE POLICY "App settings are viewable by everyone"
  ON app_settings FOR SELECT USING (true);

-- --------------------------------------------------------
-- Availability Checks (lecture par le propriétaire du bien)
-- --------------------------------------------------------
CREATE POLICY "Users can view own availability checks"
  ON availability_checks FOR SELECT USING (auth.uid() = requested_by);

CREATE POLICY "Users can insert availability checks"
  ON availability_checks FOR INSERT WITH CHECK (auth.uid() = requested_by);

-- --------------------------------------------------------
-- Certification Requests (propriétaire du bien)
-- --------------------------------------------------------
CREATE POLICY "Owners can view certification requests for their properties"
  ON certification_requests FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = certification_requests.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can insert certification requests"
  ON certification_requests FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = certification_requests.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- Certification Visits (lecture par l'agent assigné)
-- --------------------------------------------------------
CREATE POLICY "Agents can view assigned certification visits"
  ON certification_visits FOR SELECT USING (auth.uid() = agent_id);

-- --------------------------------------------------------
-- Certification Checks (lecture via agent de la visite)
-- --------------------------------------------------------
CREATE POLICY "Agents can view certification checks for their visits"
  ON certification_checks FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certification_visits
      WHERE certification_visits.id = certification_checks.visit_id
      AND certification_visits.agent_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- Certification Reports (lecture publique pour transparence)
-- --------------------------------------------------------
CREATE POLICY "Certification reports are viewable by everyone"
  ON certification_reports FOR SELECT USING (true);

-- ============================================================
-- 3. HELPER FUNCTION : Vérifier si l'utilisateur est admin
-- (Utilisable dans les futures politiques admin)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- FIN DE LA MIGRATION DE SÉCURITÉ
-- ============================================================
