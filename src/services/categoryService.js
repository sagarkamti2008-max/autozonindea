/**
 * AutoZoneIndia - Category & Subcategory Management Service
 * 
 * Provides:
 * 1. Tree & list fetching for main categories and subcategories
 * 2. Pre-deletion safety verification (Checks product assignment before delete)
 * 3. SEO title & description auto-generation
 * 4. Supabase API integration with offline fallback
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MASTER_CATEGORIES_DATA, generateCategorySEO } from '../data/categoryMasterData';

export const CategoryAPI = {
  /**
   * Get all categories as a structured hierarchy tree (Main -> Subcategories)
   */
  getCategoriesTree: async () => {
    if (!isSupabaseConfigured()) {
      return { data: MASTER_CATEGORIES_DATA, error: null };
    }

    try {
      const { data: allCategories, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !allCategories) return { data: MASTER_CATEGORIES_DATA, error };

      // Build parent-child tree
      const mainCats = allCategories.filter(c => !c.parent_id);
      const tree = mainCats.map(main => {
        const children = allCategories.filter(c => c.parent_id === main.id);
        return {
          ...main,
          subcategories: children
        };
      });

      return { data: tree, error: null };
    } catch (err) {
      console.error('Error fetching categories tree:', err);
      return { data: MASTER_CATEGORIES_DATA, error: null };
    }
  },

  /**
   * Get top-level main categories
   */
  getMainCategories: async () => {
    if (!isSupabaseConfigured()) {
      return { data: MASTER_CATEGORIES_DATA, error: null };
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .eq('status', true)
      .order('sort_order', { ascending: true });
    return { data: data || MASTER_CATEGORIES_DATA, error };
  },

  /**
   * Get category or subcategory by slug
   */
  getCategoryBySlug: async (slug) => {
    if (!isSupabaseConfigured()) {
      for (const main of MASTER_CATEGORIES_DATA) {
        if (main.slug === slug) return { data: main, isMain: true, error: null };
        const sub = main.subcategories.find(s => s.slug === slug);
        if (sub) return { data: { ...sub, parentCategory: main }, isMain: false, error: null };
      }
      return { data: MASTER_CATEGORIES_DATA[0], isMain: true, error: null };
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    return { data, isMain: !data?.parent_id, error };
  },

  /**
   * Add or Update Category / Subcategory
   */
  saveCategory: async (categoryObj) => {
    const slug = categoryObj.slug || categoryObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const seo = generateCategorySEO(categoryObj.name);

    const payload = {
      name: categoryObj.name,
      slug: slug,
      description: categoryObj.description || '',
      image_url: categoryObj.image_url || '',
      parent_id: categoryObj.parent_id || null,
      sort_order: categoryObj.sort_order || 0,
      status: categoryObj.status !== undefined ? categoryObj.status : true,
      seo_title: categoryObj.seo_title || seo.seo_title,
      seo_description: categoryObj.seo_description || seo.seo_description,
      updated_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured()) {
      return { data: { id: categoryObj.id || `cat-${Date.now()}`, ...payload }, error: null };
    }

    if (categoryObj.id) {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', categoryObj.id)
        .select()
        .single();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert([payload])
        .select()
        .single();
      return { data, error };
    }
  },

  /**
   * Pre-Deletion Safety Check & Safe Delete
   * Verifies if any products belong to this category before deleting.
   */
  deleteCategorySafely: async (categoryId, productsList = []) => {
    // 1. Check assigned products in local memory list
    const assignedProductsCount = productsList.filter(p => 
      p.category_id === categoryId || p.category === categoryId
    ).length;

    if (assignedProductsCount > 0) {
      return {
        allowed: false,
        assignedProductsCount,
        message: `⚠️ Cannot delete category: ${assignedProductsCount} active product(s) are assigned to this category. Please reassign or delete those products first.`
      };
    }

    // 2. Check DB assigned products if Supabase configured
    if (isSupabaseConfigured()) {
      const { count, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', categoryId);

      if (count && count > 0) {
        return {
          allowed: false,
          assignedProductsCount: count,
          message: `⚠️ Cannot delete category: ${count} active product(s) in Supabase database are assigned to this category. Please reassign or remove products first.`
        };
      }

      // Safe Delete from database
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      return { allowed: true, assignedProductsCount: 0, error };
    }

    return { allowed: true, assignedProductsCount: 0, error: null };
  }
};
