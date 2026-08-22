-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'accountant', 'owner');
CREATE TYPE budget_status AS ENUM ('draft', 'active', 'closed');

-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- APARTMENTS
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number TEXT NOT NULL UNIQUE,
  sqft NUMERIC NOT NULL CHECK (sqft > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- APARTMENT OWNERS (Mapping table for co-ownership)
CREATE TABLE apartment_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ownership_percentage NUMERIC NOT NULL CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(apartment_id, profile_id)
);

-- BUDGETS
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status budget_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EXPENSES
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  logged_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  payment_method TEXT,
  is_advance BOOLEAN DEFAULT FALSE,
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION auth_is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_is_accountant() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'accountant'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (auth_is_admin());

-- Apartments Policies
CREATE POLICY "Anyone can view apartments" ON apartments FOR SELECT USING (true);
CREATE POLICY "Admins can manage apartments" ON apartments FOR ALL USING (auth_is_admin());

-- Apartment Owners Policies
CREATE POLICY "Owners can view their own ownership records" ON apartment_owners FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Admins can manage ownership records" ON apartment_owners FOR ALL USING (auth_is_admin());

-- Budgets Policies
CREATE POLICY "Anyone can view active budgets" ON budgets FOR SELECT USING (status = 'active' OR auth_is_admin() OR auth_is_accountant());
CREATE POLICY "Admins can manage budgets" ON budgets FOR ALL USING (auth_is_admin());

-- Expenses Policies
CREATE POLICY "Accountants and Admins can manage expenses" ON expenses FOR ALL USING (auth_is_admin() OR auth_is_accountant());
CREATE POLICY "Owners can view expenses" ON expenses FOR SELECT USING (true); -- Might want to restrict later to hide specific details

-- Payments Policies
CREATE POLICY "Owners can view their own payments" ON payments FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Accountants and Admins can manage payments" ON payments FOR ALL USING (auth_is_admin() OR auth_is_accountant());

-- Trigger to create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 'owner');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
