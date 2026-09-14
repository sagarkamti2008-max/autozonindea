/**
 * AutoZoneIndia - Brand Management Service & Supabase Storage Integration
 * 
 * Bucket: `brand-logos`
 * Tables: `brands`, `products`
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MASTER_BRANDS_DATA, generateBrandSEO } from '../data/brandMasterData';

export const BrandAPI = {
  /**
   * Get all active or all brands
   */
  getBrands: async (onlyActive = true) => {
    if (!isSupabaseConfigured()) {
      const data = onlyActive ? MASTER_BRANDS_DATA.filter(b => b.status) : MASTER_BRANDS_DATA;
      return { data, error: null };
    }

    try {
      let query = supabase.from('brands').select('*');
      if (onlyActive) {
        query = query.eq('status', true);
      }
      const { data, error } = await query.order('name', { ascending: true });
      if (error || !data || data.length === 0) {
        return { data: MASTER_BRANDS_DATA, error: null };
      }
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching brands:', err);
      return { data: MASTER_BRANDS_DATA, error: null };
    }
  },

  /**
   * Get featured brands
   */
  getFeaturedBrands: async () => {
    if (!isSupabaseConfigured()) {
      return { data: MASTER_BRANDS_DATA.filter(b => b.featured), error: null };
    }
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('featured', true)
      .eq('status', true)
      .order('sort_order', { ascending: true });
    return { data: data || MASTER_BRANDS_DATA.filter(b => b.featured), error };
  },

  /**
   * Get single brand by slug
   */
  getBrandBySlug: async (slug) => {
    if (!isSupabaseConfigured()) {
      const brand = MASTER_BRANDS_DATA.find(b => b.slug.toLowerCase() === slug.toLowerCase() || b.id === slug) || MASTER_BRANDS_DATA[0];
      return { data: brand, error: null };
    }

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();

    return { data: data || MASTER_BRANDS_DATA[0], error };
  },

  /**
   * Upload logo file to Supabase Storage bucket `brand-logos`
   */
  uploadBrandLogo: async (file) => {
    if (!isSupabaseConfigured()) {
      return {
        publicUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&q=80',
        error: null
      };
    }

    try {
      const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `logos/${Date.now()}_${sanitized}`;

      const { data, error: uploadError } = await supabase.storage
        .from('brand-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Error uploading logo to brand-logos bucket:', uploadError);
        return { publicUrl: null, error: uploadError };
      }

      const { data: urlData } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(filePath);

      return { publicUrl: urlData.publicUrl, error: null };
    } catch (err) {
      console.error('Exception during brand logo upload:', err);
      return { publicUrl: null, error: err };
    }
  },

  /**
   * Add or Update Brand
   */
  saveBrand: async (brandObj) => {
    const slug = brandObj.slug || brandObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const seo = generateBrandSEO(brandObj.name);

    const payload = {
      name: brandObj.name,
      slug: slug,
      logo_url: brandObj.logo_url || '',
      description: brandObj.description || '',
      country: brandObj.country || 'Global',
      website_url: brandObj.website_url || '',
      status: brandObj.status !== undefined ? brandObj.status : true,
      featured: brandObj.featured !== undefined ? brandObj.featured : false,
      sort_order: brandObj.sort_order || 0,
      seo_title: brandObj.seo_title || seo.seo_title,
      seo_description: brandObj.seo_description || seo.seo_description,
      updated_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured()) {
      return { data: { id: brandObj.id || `brand-${Date.now()}`, ...payload }, error: null };
    }

    if (brandObj.id) {
      const { data, error } = await supabase
        .from('brands')
        .update(payload)
        .eq('id', brandObj.id)
        .select()
        .single();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('brands')
        .insert([payload])
        .select()
        .single();
      return { data, error };
    }
  },

  /**
   * Pre-Deletion Protection Check & Safe Delete
   */
  deleteBrandSafely: async (brandId, productsList = []) => {
    // 1. Check local memory list
    const assignedProducts = productsList.filter(p => 
      p.brand_id === brandId || (p.brand && p.brand.toLowerCase() === brandId.toLowerCase())
    );

    if (assignedProducts.length > 0) {
      return {
        allowed: false,
        count: assignedProducts.length,
        message: `⚠️ Cannot delete brand: ${assignedProducts.length} product(s) are linked to this brand. Reassign or remove products first.`
      };
    }

    // 2. Check DB assigned products if Supabase configured
    if (isSupabaseConfigured()) {
      const { count, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('brand_id', brandId);

      if (count && count > 0) {
        return {
          allowed: false,
          count,
          message: `⚠️ Cannot delete brand: ${count} product(s) in Supabase database are linked to this brand. Please reassign products first.`
        };
      }

      const { error } = await supabase.from('brands').delete().eq('id', brandId);
      return { allowed: true, count: 0, error };
    }

    return { allowed: true, count: 0, error: null };
  }
};
