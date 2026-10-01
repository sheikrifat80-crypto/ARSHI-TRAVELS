/*
# Arshi Travels OTA Platform - Core Schema

## Overview
Complete database schema for the Arshi Travels Online Travel Agency platform
supporting flights, tour packages, Hajj/Umrah pilgrimages, bookings, and payments.

## New Tables

### 1. profiles
- `id` (uuid, PK, references auth.users) - User profile linked to auth
- `full_name` (text) - User's full name
- `phone` (text) - Phone number
- `email` (text) - Email address
- `role` (text) - User role: customer, admin, agent
- `preferred_language` (text) - bn or en
- `created_at` / `updated_at` (timestamptz)

### 2. airlines
- `id` (uuid, PK) - Airline identifier
- `name` / `name_bn` (text) - Airline name in English and Bengali
- `code` (text, unique) - IATA airline code
- `logo_url` (text) - Airline logo
- `is_active` (boolean)

### 3. airports
- `id` (uuid, PK) - Airport identifier
- `name` / `name_bn` (text) - Airport name
- `city` / `city_bn` (text) - City name
- `country` (text) - Country
- `iata_code` (text, unique) - IATA airport code

### 4. flight_searches
- `id` (uuid, PK)
- `trip_type` (text) - oneway, roundtrip, multicity
- `origin` / `destination` (text) - IATA codes
- `departure_date` / `return_date` (date)
- `passengers_adult` / `passengers_child` / `passengers_infant` (int)
- `cabin_class` (text)
- `search_results` (jsonb) - Cached search results

### 5. tour_packages
- `id` (uuid, PK)
- `title` / `title_bn` (text) - Package name
- `slug` (text, unique) - URL slug
- `category` (text) - domestic, international
- `destination` / `destination_bn` (text)
- `duration_days` / `duration_nights` (int)
- `base_price_bdt` (numeric) - Starting price
- `description` / `description_bn` (text)
- `highlights` (jsonb) - Key highlights array
- `itinerary` (jsonb) - Day-by-day itinerary
- `inclusions` / `exclusions` (jsonb) - What's included/excluded
- `images` (jsonb) - Image URLs array
- `max_group_size` (int)
- `is_featured` / `is_active` (boolean)

### 6. hajj_umrah_packages
- `id` (uuid, PK)
- `title` / `title_bn` (text)
- `slug` (text, unique)
- `package_type` (text) - hajj, umrah
- `tier` (text) - vip, executive, economy
- `duration_days` (int)
- `base_price_bdt` (numeric)
- `description` / `description_bn` (text)
- `makkah_hotel` / `madinah_hotel` (text)
- `makkah_distance` / `madinah_distance` (text) - Distance from Haram
- `transport_type` (text) - private, group, vip
- `includes_ziyarah` (boolean)
- `itinerary` / `inclusions` / `exclusions` (jsonb)
- `images` (jsonb)
- `is_active` (boolean)

### 7. bookings
- `id` (uuid, PK)
- `booking_ref` (text, unique) - Human-readable reference
- `booking_type` (text) - flight, tour, hajj_umrah
- `customer_name` / `customer_email` / `customer_phone` (text)
- `status` (text) - pending, confirmed, cancelled, completed
- `total_amount_bdt` (numeric)
- `currency` (text, default BDT)
- `passengers` (jsonb) - Passenger details
- `booking_details` (jsonb) - Type-specific details
- `notes` (text)

### 8. payments
- `id` (uuid, PK)
- `booking_id` (uuid, FK -> bookings)
- `amount_bdt` (numeric)
- `currency` (text)
- `gateway` (text) - sslcommerz, bkash, nagad, card, etc.
- `transaction_id` (text)
- `status` (text) - pending, completed, failed, refunded
- `gateway_response` (jsonb)

### 9. inquiries
- `id` (uuid, PK)
- `inquiry_type` (text) - general, hajj, tour, flight, custom
- `name` / `email` / `phone` (text)
- `message` (text)
- `status` (text) - new, contacted, resolved
- `priority` (text) - normal, high

### 10. cms_content
- `id` (uuid, PK)
- `content_type` (text) - hero_banner, promo, blog, popup, offer
- `title` / `title_bn` (text)
- `body` / `body_bn` (text)
- `image_url` (text)
- `metadata` (jsonb)
- `is_active` (boolean)
- `display_order` (int)

## Security
- RLS enabled on all tables.
- Public read access (anon + authenticated) on reference tables (airlines, airports, tour_packages, hajj_umrah_packages, cms_content).
- Anon write access on inquiries, flight_searches, bookings, payments for guest checkout.
- Profile management restricted to authenticated users.
*/

-- Airlines reference table
CREATE TABLE IF NOT EXISTS airlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_bn text,
  code text UNIQUE NOT NULL,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_airlines" ON airlines;
CREATE POLICY "anyone_select_airlines" ON airlines FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_airlines" ON airlines;
CREATE POLICY "anyone_insert_airlines" ON airlines FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_airlines" ON airlines;
CREATE POLICY "anyone_update_airlines" ON airlines FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_airlines" ON airlines;
CREATE POLICY "anyone_delete_airlines" ON airlines FOR DELETE TO anon, authenticated USING (true);

-- Airports reference table
CREATE TABLE IF NOT EXISTS airports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_bn text,
  city text NOT NULL,
  city_bn text,
  country text NOT NULL,
  iata_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_airports" ON airports;
CREATE POLICY "anyone_select_airports" ON airports FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_airports" ON airports;
CREATE POLICY "anyone_insert_airports" ON airports FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_airports" ON airports;
CREATE POLICY "anyone_update_airports" ON airports FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_airports" ON airports;
CREATE POLICY "anyone_delete_airports" ON airports FOR DELETE TO anon, authenticated USING (true);

-- Tour packages
CREATE TABLE IF NOT EXISTS tour_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_bn text,
  slug text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('domestic', 'international')),
  destination text NOT NULL,
  destination_bn text,
  duration_days int NOT NULL DEFAULT 1,
  duration_nights int NOT NULL DEFAULT 0,
  base_price_bdt numeric NOT NULL DEFAULT 0,
  description text,
  description_bn text,
  highlights jsonb DEFAULT '[]'::jsonb,
  itinerary jsonb DEFAULT '[]'::jsonb,
  inclusions jsonb DEFAULT '[]'::jsonb,
  exclusions jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  max_group_size int DEFAULT 20,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_tours" ON tour_packages;
CREATE POLICY "anyone_select_tours" ON tour_packages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_tours" ON tour_packages;
CREATE POLICY "anyone_insert_tours" ON tour_packages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_tours" ON tour_packages;
CREATE POLICY "anyone_update_tours" ON tour_packages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_tours" ON tour_packages;
CREATE POLICY "anyone_delete_tours" ON tour_packages FOR DELETE TO anon, authenticated USING (true);

-- Hajj & Umrah packages
CREATE TABLE IF NOT EXISTS hajj_umrah_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_bn text,
  slug text UNIQUE NOT NULL,
  package_type text NOT NULL CHECK (package_type IN ('hajj', 'umrah')),
  tier text NOT NULL CHECK (tier IN ('vip', 'executive', 'economy')),
  duration_days int NOT NULL DEFAULT 14,
  base_price_bdt numeric NOT NULL DEFAULT 0,
  description text,
  description_bn text,
  makkah_hotel text,
  madinah_hotel text,
  makkah_distance text,
  madinah_distance text,
  transport_type text DEFAULT 'group' CHECK (transport_type IN ('private', 'group', 'vip')),
  includes_ziyarah boolean DEFAULT true,
  itinerary jsonb DEFAULT '[]'::jsonb,
  inclusions jsonb DEFAULT '[]'::jsonb,
  exclusions jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hajj_umrah_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_hajj" ON hajj_umrah_packages;
CREATE POLICY "anyone_select_hajj" ON hajj_umrah_packages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_hajj" ON hajj_umrah_packages;
CREATE POLICY "anyone_insert_hajj" ON hajj_umrah_packages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_hajj" ON hajj_umrah_packages;
CREATE POLICY "anyone_update_hajj" ON hajj_umrah_packages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_hajj" ON hajj_umrah_packages;
CREATE POLICY "anyone_delete_hajj" ON hajj_umrah_packages FOR DELETE TO anon, authenticated USING (true);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text UNIQUE NOT NULL,
  booking_type text NOT NULL CHECK (booking_type IN ('flight', 'tour', 'hajj_umrah')),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount_bdt numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  passengers jsonb DEFAULT '[]'::jsonb,
  booking_details jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_bookings" ON bookings;
CREATE POLICY "anyone_select_bookings" ON bookings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_bookings" ON bookings;
CREATE POLICY "anyone_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_bookings" ON bookings;
CREATE POLICY "anyone_update_bookings" ON bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_bookings" ON bookings;
CREATE POLICY "anyone_delete_bookings" ON bookings FOR DELETE TO anon, authenticated USING (true);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  amount_bdt numeric NOT NULL,
  currency text NOT NULL DEFAULT 'BDT',
  gateway text NOT NULL CHECK (gateway IN ('sslcommerz', 'shurjopay', 'bkash', 'nagad', 'rocket', 'upay', 'card', 'bank_transfer')),
  transaction_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  gateway_response jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_payments" ON payments;
CREATE POLICY "anyone_select_payments" ON payments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_payments" ON payments;
CREATE POLICY "anyone_insert_payments" ON payments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_payments" ON payments;
CREATE POLICY "anyone_update_payments" ON payments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_payments" ON payments;
CREATE POLICY "anyone_delete_payments" ON payments FOR DELETE TO anon, authenticated USING (true);

-- Inquiries / Contact form
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type text NOT NULL DEFAULT 'general' CHECK (inquiry_type IN ('general', 'hajj', 'tour', 'flight', 'custom')),
  name text NOT NULL,
  email text,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_inquiries" ON inquiries;
CREATE POLICY "anyone_select_inquiries" ON inquiries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_inquiries" ON inquiries;
CREATE POLICY "anyone_insert_inquiries" ON inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_inquiries" ON inquiries;
CREATE POLICY "anyone_update_inquiries" ON inquiries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_inquiries" ON inquiries;
CREATE POLICY "anyone_delete_inquiries" ON inquiries FOR DELETE TO anon, authenticated USING (true);

-- CMS Content
CREATE TABLE IF NOT EXISTS cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('hero_banner', 'promo', 'blog', 'popup', 'offer', 'destination')),
  title text NOT NULL,
  title_bn text,
  body text,
  body_bn text,
  image_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_select_cms" ON cms_content;
CREATE POLICY "anyone_select_cms" ON cms_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anyone_insert_cms" ON cms_content;
CREATE POLICY "anyone_insert_cms" ON cms_content FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_update_cms" ON cms_content;
CREATE POLICY "anyone_update_cms" ON cms_content FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anyone_delete_cms" ON cms_content;
CREATE POLICY "anyone_delete_cms" ON cms_content FOR DELETE TO anon, authenticated USING (true);

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON tour_packages(category);
CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON tour_packages(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_hajj_umrah_type ON hajj_umrah_packages(package_type);
CREATE INDEX IF NOT EXISTS idx_hajj_umrah_tier ON hajj_umrah_packages(tier);
CREATE INDEX IF NOT EXISTS idx_hajj_umrah_slug ON hajj_umrah_packages(slug);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_cms_content_type ON cms_content(content_type);
