-- AutoZonIndia Supabase SQL Schema
-- Paste this script into the Supabase SQL Editor and run it.

-- 1. Create Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    brand TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    part_number TEXT,
    oem_numbers TEXT,
    hsn_code TEXT,
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    tax_percent DECIMAL(5,2) DEFAULT 18.0,
    weight TEXT,
    stock INTEGER DEFAULT 0,
    short_description TEXT,
    long_description TEXT,
    images JSONB,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Customers Table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'Pending',
    order_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Coupons Table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order DECIMAL(10,2),
    maximum_discount DECIMAL(10,2),
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Website Settings Table
CREATE TABLE public.website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
