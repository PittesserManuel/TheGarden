-- =============================================
-- TheGarden Database Schema
-- =============================================

-- Custom ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'worker', 'customer');
CREATE TYPE order_mode AS ENUM ('dine_in', 'to_go');
CREATE TYPE complete_status AS ENUM ('unfinished', 'in_progress', 'finished');
CREATE TYPE paid_status AS ENUM ('unpaid', 'paid');
CREATE TYPE pickup_status AS ENUM ('open', 'picked_up');
CREATE TYPE point_transaction_type AS ENUM ('earned', 'redeemed', 'adjusted');
CREATE TYPE reward_type AS ENUM ('free_product', 'discount');

-- =============================================
-- LOCATIONS
-- =============================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  opening_hours JSONB DEFAULT '{}'::jsonb,
  theme_colors JSONB DEFAULT '{"primary": "#16a34a", "secondary": "#166534"}'::jsonb,
  features JSONB DEFAULT '{"member_system": true, "delivery": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PROFILES (linked to auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  role user_role DEFAULT 'customer',
  email TEXT NOT NULL,
  phone TEXT,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, email, phone, role, location_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'),
    (SELECT id FROM public.locations LIMIT 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-create member record for customers
CREATE OR REPLACE FUNCTION public.handle_new_member()
RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'customer' THEN
    INSERT INTO public.members (user_id, location_id)
    VALUES (NEW.id, NEW.location_id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_member();

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji
  station TEXT DEFAULT 'kitchen',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- MEMBERS (loyalty)
-- =============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  current_points INT DEFAULT 0,
  lifetime_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id),
  order_number INT NOT NULL,
  customer_name TEXT,
  order_mode order_mode DEFAULT 'dine_in',
  complete_status complete_status DEFAULT 'unfinished',
  paid_status paid_status DEFAULT 'unpaid',
  pickup_status pickup_status DEFAULT 'open',
  station_status JSONB DEFAULT '{}'::jsonb,
  member_id UUID REFERENCES members(id),
  total NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  status complete_status DEFAULT 'unfinished'
);

-- =============================================
-- ORDER COUNTERS (Atomic via CAS)
-- =============================================
CREATE TABLE order_counters (
  location_id UUID PRIMARY KEY REFERENCES locations(id),
  current_number INT DEFAULT 0
);

-- Atomic increment function
CREATE OR REPLACE FUNCTION increment_order_number(loc_id UUID, expected INT)
RETURNS INT AS $$
DECLARE
  new_number INT;
BEGIN
  UPDATE order_counters
  SET current_number = current_number + 1
  WHERE location_id = loc_id AND current_number = expected
  RETURNING current_number INTO new_number;

  IF new_number IS NULL THEN
    -- CAS failed, re-read
    SELECT current_number INTO new_number FROM order_counters WHERE location_id = loc_id;
  END IF;

  RETURN COALESCE(new_number, 1);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- POINT TRANSACTIONS
-- =============================================
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  points INT NOT NULL,
  type point_transaction_type DEFAULT 'earned',
  order_id UUID REFERENCES orders(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- REWARDS
-- =============================================
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type reward_type DEFAULT 'free_product',
  product_id UUID REFERENCES products(id),
  discount_amount NUMERIC(10,2),
  point_cost INT NOT NULL DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_location ON products(location_id);
CREATE INDEX idx_orders_location ON orders(location_id);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_point_transactions_member ON point_transactions(member_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- LOCATIONS: Public read
CREATE POLICY "locations_public_read" ON locations FOR SELECT USING (true);

-- PROFILES: Users see own, admins see all
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CATEGORIES: Public read, admin write
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PRODUCTS: Public read, admin write
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_write" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- MEMBERS: Own read, staff read all
CREATE POLICY "members_own_read" ON members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "members_staff_all" ON members FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'worker'))
);

-- ORDERS: Staff full access
CREATE POLICY "orders_staff_all" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'worker'))
);
-- Members see own orders
CREATE POLICY "orders_member_read" ON orders FOR SELECT USING (
  member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
);

-- ORDER ITEMS: Staff full access
CREATE POLICY "order_items_staff_all" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'worker'))
);
-- Members see own order items
CREATE POLICY "order_items_member_read" ON order_items FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  )
);

-- ORDER COUNTERS: Staff access
CREATE POLICY "order_counters_staff" ON order_counters FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'worker'))
);

-- POINT TRANSACTIONS: Own read, staff write
CREATE POLICY "points_own_read" ON point_transactions FOR SELECT USING (
  member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
);
CREATE POLICY "points_staff_all" ON point_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'worker'))
);

-- REWARDS: Public read, admin write
CREATE POLICY "rewards_public_read" ON rewards FOR SELECT USING (true);
CREATE POLICY "rewards_admin_write" ON rewards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
