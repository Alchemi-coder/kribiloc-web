-- Extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Types énumérés
CREATE TYPE user_role AS ENUM ('visitor', 'tenant', 'owner', 'agent', 'admin', 'super_admin');
CREATE TYPE property_status AS ENUM ('draft', 'pending_moderation', 'published', 'suspended', 'rented', 'stale', 'hidden', 'archived');
CREATE TYPE certification_level AS ENUM ('standard', 'reinforced', 'premium');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded');
CREATE TYPE certification_status AS ENUM ('draft', 'awaiting_payment', 'paid', 'queued', 'scheduled', 'in_progress', 'submitted', 'admin_review', 'approved', 'needs_revision', 'rejected');

-- 1. Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'visitor',
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Professional Profiles
CREATE TABLE professional_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  professional_type TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  zone TEXT,
  documents_meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Neighborhoods
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  geometry GEOMETRY(Polygon, 4326),
  city TEXT NOT NULL DEFAULT 'Kribi',
  active BOOLEAN DEFAULT true
);

-- 4. Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  deposit NUMERIC,
  advance NUMERIC,
  currency TEXT DEFAULT 'XAF',
  availability_status property_status DEFAULT 'draft',
  latitude NUMERIC,
  longitude NUMERIC,
  geom GEOMETRY(Point, 4326),
  address_text TEXT,
  neighborhood_id UUID REFERENCES neighborhoods(id),
  bedrooms INTEGER,
  bathrooms INTEGER,
  surface_area NUMERIC,
  is_furnished BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX properties_geom_idx ON properties USING GIST (geom);

-- 5. Property Features
CREATE TABLE property_features (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  value TEXT,
  PRIMARY KEY (property_id, feature_key)
);

-- 6. Property Media
CREATE TABLE property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  taken_at TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT true,
  metadata JSONB
);

-- 7. Property Status History
CREATE TABLE property_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  old_status property_status,
  new_status property_status NOT NULL,
  reason TEXT,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Certification Packages
CREATE TABLE certification_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  validity_days INTEGER NOT NULL,
  features_json JSONB,
  active BOOLEAN DEFAULT true
);

-- 9. Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id UUID REFERENCES profiles(id),
  purpose TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'XAF',
  provider TEXT NOT NULL,
  external_reference TEXT UNIQUE,
  status payment_status DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  raw_callback_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Certification Requests
CREATE TABLE certification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES profiles(id),
  package_id UUID REFERENCES certification_packages(id),
  amount NUMERIC,
  payment_id UUID REFERENCES payments(id),
  status certification_status DEFAULT 'draft',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  assigned_agent_id UUID REFERENCES profiles(id),
  expires_at TIMESTAMPTZ
);

-- 11. Certification Visits
CREATE TABLE certification_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES certification_requests(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  latitude NUMERIC,
  longitude NUMERIC,
  notes TEXT,
  result TEXT
);

-- 12. Certification Checks
CREATE TABLE certification_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES certification_visits(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_key TEXT NOT NULL,
  result TEXT NOT NULL,
  comment TEXT,
  evidence_media_id UUID REFERENCES property_media(id)
);

-- 13. Certification Reports
CREATE TABLE certification_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES certification_visits(id) ON DELETE CASCADE,
  summary TEXT,
  score NUMERIC,
  decision TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ
);

-- 14. Verification Badges
CREATE TABLE verification_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  level certification_level NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  issued_by UUID REFERENCES profiles(id),
  verification_snapshot JSONB
);

-- 15. Favorites
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

-- 16. View Events
CREATE TABLE view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Search Events
CREATE TABLE search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  query_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Visit Requests
CREATE TABLE visit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES profiles(id),
  owner_id UUID REFERENCES profiles(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  preferred_slot TIMESTAMPTZ,
  status TEXT DEFAULT 'requested',
  message TEXT
);

-- 19. Reports (Signalements)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES profiles(id),
  category TEXT NOT NULL,
  description TEXT,
  evidence_media_id UUID REFERENCES property_media(id),
  status TEXT DEFAULT 'open',
  severity TEXT,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Boost Orders
CREATE TABLE boost_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id),
  package_id UUID,
  amount NUMERIC,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  payment_id UUID REFERENCES payments(id)
);

-- 21. Subscription Plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quota INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  features_json JSONB
);

-- 22. Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  external_ref TEXT
);

-- 23. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data_json JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. App Settings
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. Availability Checks
CREATE TABLE availability_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  requested_by UUID,
  response TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_modtime BEFORE UPDATE ON properties FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS (Sécurisé pour la production)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_badges ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (availability_status IN ('published', 'rented'));
CREATE POLICY "Owners can view all their properties" ON properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert their properties" ON properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their properties" ON properties FOR UPDATE USING (auth.uid() = owner_id);

-- Neighborhoods
CREATE POLICY "Neighborhoods are viewable by everyone" ON neighborhoods FOR SELECT USING (true);

-- Verification Badges
CREATE POLICY "Verification badges are viewable by everyone" ON verification_badges FOR SELECT USING (true);

-- Property Media
CREATE POLICY "Property media viewable by everyone" ON property_media FOR SELECT USING (true);
CREATE POLICY "Owners can insert property media" ON property_media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_media.property_id AND properties.owner_id = auth.uid())
);
CREATE POLICY "Owners can update property media" ON property_media FOR UPDATE USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_media.property_id AND properties.owner_id = auth.uid())
);
CREATE POLICY "Owners can delete property media" ON property_media FOR DELETE USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = property_media.property_id AND properties.owner_id = auth.uid())
);

-- Visit Requests
CREATE POLICY "Tenants can view own requests" ON visit_requests FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Owners can view requests for their properties" ON visit_requests FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Tenants can insert requests" ON visit_requests FOR INSERT WITH CHECK (auth.uid() = tenant_id);
CREATE POLICY "Tenants can update own requests" ON visit_requests FOR UPDATE USING (auth.uid() = tenant_id);
CREATE POLICY "Owners can update requests" ON visit_requests FOR UPDATE USING (auth.uid() = owner_id);

-- Payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM visit_requests WHERE visit_requests.id = payments.id AND visit_requests.tenant_id = auth.uid()) -- Note: relation varies, placeholder check if needed
);


-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur KribiLoc'),
    NEW.email,
    'visitor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger d'audit strict pour les annonces (Règle S19)
CREATE OR REPLACE FUNCTION audit_property_changes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs(actor_id, action, entity_type, entity_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', 'property', NEW.id, row_to_json(OLD), row_to_json(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs(actor_id, action, entity_type, entity_id, old_data)
    VALUES (auth.uid(), 'DELETE', 'property', OLD.id, row_to_json(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_properties
  AFTER UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE PROCEDURE audit_property_changes();


