-- ============================================================================
-- LeapStart Finance & Admissions — RLS Policies
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor AFTER the Prisma migration has
-- created the tables.
-- ============================================================================

-- ============================================================================
-- 1. Create a trigger function to auto-create profile on auth.users insert
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public."Profile" ("userId", email, role, "fullName", "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    NEW.email,
    'VIEWER',
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. Enable RLS on all tables
-- ============================================================================

ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Receipt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Setting" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. Helper function: Get current user's role
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS "Role"
LANGUAGE plpgsql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_role "Role";
BEGIN
  SELECT role INTO user_role
  FROM public."Profile"
  WHERE "userId" = auth.uid()
  LIMIT 1;
  RETURN user_role;
END;
$$;

-- ============================================================================
-- 4. Profile Policies
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public."Profile"
  FOR SELECT
  USING (auth.uid() = "userId");

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public."Profile"
  FOR SELECT
  USING (public.get_user_role() = 'ADMIN'::"Role");

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public."Profile"
  FOR UPDATE
  USING (public.get_user_role() = 'ADMIN'::"Role");

-- ============================================================================
-- 5. Student Policies
-- ============================================================================

-- Authenticated users can read students
CREATE POLICY "Authenticated users can read students"
  ON public."Student"
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Finance and Admin can insert students
CREATE POLICY "Finance and Admin can insert students"
  ON public."Student"
  FOR INSERT
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'FINANCE', 'ADMISSIONS'));

-- Finance and Admin can update students
CREATE POLICY "Finance and Admin can update students"
  ON public."Student"
  FOR UPDATE
  USING (public.get_user_role() IN ('ADMIN', 'FINANCE', 'ADMISSIONS'));

-- Finance and Admin can delete students
CREATE POLICY "Finance and Admin can delete students"
  ON public."Student"
  FOR DELETE
  USING (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- ============================================================================
-- 6. Receipt Policies
-- ============================================================================

-- Authenticated users can read receipts
CREATE POLICY "Authenticated users can read receipts"
  ON public."Receipt"
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Finance and Admin can insert receipts
CREATE POLICY "Finance and Admin can insert receipts"
  ON public."Receipt"
  FOR INSERT
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- Finance and Admin can update receipts
CREATE POLICY "Finance and Admin can update receipts"
  ON public."Receipt"
  FOR UPDATE
  USING (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- Only Admin can delete receipts
CREATE POLICY "Admin can delete receipts"
  ON public."Receipt"
  FOR DELETE
  USING (public.get_user_role() = 'ADMIN'::"Role");

-- ============================================================================
-- 7. Payment Policies
-- ============================================================================

-- Authenticated users can read payments
CREATE POLICY "Authenticated users can read payments"
  ON public."Payment"
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Finance and Admin can insert payments
CREATE POLICY "Finance and Admin can insert payments"
  ON public."Payment"
  FOR INSERT
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- Finance and Admin can update payments
CREATE POLICY "Finance and Admin can update payments"
  ON public."Payment"
  FOR UPDATE
  USING (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- Only Admin can delete payments
CREATE POLICY "Admin can delete payments"
  ON public."Payment"
  FOR DELETE
  USING (public.get_user_role() = 'ADMIN'::"Role");

-- ============================================================================
-- 8. Invoice Policies
-- ============================================================================

-- Authenticated users can read invoices
CREATE POLICY "Authenticated users can read invoices"
  ON public."Invoice"
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Finance and Admin can insert invoices
CREATE POLICY "Finance and Admin can insert invoices"
  ON public."Invoice"
  FOR INSERT
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- Finance and Admin can update invoices
CREATE POLICY "Finance and Admin can update invoices"
  ON public."Invoice"
  FOR UPDATE
  USING (public.get_user_role() IN ('ADMIN', 'FINANCE'));

-- Only Admin can delete invoices
CREATE POLICY "Admin can delete invoices"
  ON public."Invoice"
  FOR DELETE
  USING (public.get_user_role() = 'ADMIN'::"Role");

-- ============================================================================
-- 9. Settings Policies
-- ============================================================================

-- Authenticated users can read settings
CREATE POLICY "Authenticated users can read settings"
  ON public."Setting"
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only Admin can write settings
CREATE POLICY "Admin can write settings"
  ON public."Setting"
  FOR INSERT
  WITH CHECK (public.get_user_role() = 'ADMIN'::"Role");

CREATE POLICY "Admin can update settings"
  ON public."Setting"
  FOR UPDATE
  USING (public.get_user_role() = 'ADMIN'::"Role");

CREATE POLICY "Admin can delete settings"
  ON public."Setting"
  FOR DELETE
  USING (public.get_user_role() = 'ADMIN'::"Role");
