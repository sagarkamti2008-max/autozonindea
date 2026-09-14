// Enterprise CMS, Blog, SEO Quality & Dynamic Landing Page Service for AutoZoneIndia
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Simple, effective HTML Sanitizer to prevent XSS / script injection in rich text editor
export const sanitizeHtml = (html) => {
  if (!html) return '';
  // Strip out script tags, iframe, object, embed, javascript: protocols, and event handlers (onload, onerror, etc.)
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/\s*on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/href\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'href="#"');
  return sanitized;
};

/**
 * Requirement #13: Reusable calculateSeoCompleteness()
 * Evaluates item metadata (title, meta_title, meta_description, canonical_url, slug, indexability, content length, alt text)
 * Returns a score (0-100), status label ('Excellent', 'Good', 'Needs Improvement', 'Poor'), and list of issues.
 */
export const calculateSeoCompleteness = (item = {}) => {
  let score = 0;
  const issues = [];
  const checks = [];

  // 1. Title / Name (15 pts)
  const titleVal = item.title || item.name || item.question || '';
  if (titleVal.trim().length >= 5) {
    score += 15;
    checks.push({ name: 'Title Present', passed: true });
  } else {
    issues.push('Title/Name is missing or too short');
    checks.push({ name: 'Title Present', passed: false });
  }

  // 2. Meta Title (15 pts)
  const metaTitle = item.meta_title || titleVal;
  if (metaTitle.trim().length >= 10 && metaTitle.trim().length <= 70) {
    score += 15;
    checks.push({ name: 'Meta Title Length (10-70 chars)', passed: true });
  } else {
    if (!item.meta_title) issues.push('Meta title is missing');
    else issues.push('Meta title length should be between 10 and 70 characters');
    checks.push({ name: 'Meta Title Length', passed: false });
  }

  // 3. Meta Description (20 pts)
  const metaDesc = item.meta_description || item.excerpt || '';
  if (metaDesc.trim().length >= 50 && metaDesc.trim().length <= 160) {
    score += 20;
    checks.push({ name: 'Meta Description Length (50-160 chars)', passed: true });
  } else {
    if (!item.meta_description) issues.push('Meta description is missing');
    else issues.push('Meta description length should be between 50 and 160 characters');
    checks.push({ name: 'Meta Description Length', passed: false });
  }

  // 4. Slug / URL format (15 pts)
  const slug = item.slug || '';
  if (slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    score += 15;
    checks.push({ name: 'Clean Slug URL', passed: true });
  } else if (slug) {
    issues.push('Slug contains non-standard characters');
    checks.push({ name: 'Clean Slug URL', passed: false });
  } else {
    issues.push('Slug URL is missing');
    checks.push({ name: 'Clean Slug URL', passed: false });
  }

  // 5. Canonical URL (10 pts)
  if (item.canonical_url && item.canonical_url.startsWith('http')) {
    score += 10;
    checks.push({ name: 'Canonical URL Specified', passed: true });
  } else {
    issues.push('Canonical URL missing or invalid format');
    checks.push({ name: 'Canonical URL Specified', passed: false });
  }

  // 6. Indexability / Noindex check (10 pts)
  if (!item.noindex) {
    score += 10;
    checks.push({ name: 'Indexable (noindex false)', passed: true });
  } else {
    issues.push('Marked as noindex (hidden from search engines)');
    checks.push({ name: 'Indexable', passed: false });
  }

  // 7. Image Alt Text / Content Length (15 pts)
  const content = item.content || item.description || item.answer || '';
  const altText = item.alt_text || item.image_alt || '';
  if (content.length > 200 || altText.length > 3) {
    score += 15;
    checks.push({ name: 'Content Depth / Alt Text Present', passed: true });
  } else {
    issues.push('Content length is minimal or Image Alt text missing');
    checks.push({ name: 'Content Depth / Alt Text', passed: false });
  }

  let rating = 'Poor';
  let badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
  if (score >= 85) {
    rating = 'Excellent';
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  } else if (score >= 65) {
    rating = 'Good';
    badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  } else if (score >= 45) {
    rating = 'Needs Improvement';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }

  return {
    score,
    rating,
    badgeColor,
    issues,
    checks
  };
};

export const cmsSeoService = {
  // -------------------------------------------------------------
  // 1. CMS PAGES ENGINE & VERSIONING
  // -------------------------------------------------------------
  async getCmsPages(options = {}) {
    if (!isSupabaseConfigured()) return { data: [], count: 0, error: null };
    let query = supabase.from('cms_pages').select('*', { count: 'exact' });

    if (options.status) query = query.eq('status', options.status);
    if (options.page_type) query = query.eq('page_type', options.page_type);
    if (options.search) query = query.ilike('title', `%${options.search}%`);

    query = query.order('created_at', { ascending: false });

    const { data, count, error } = await query;
    return { data: data || [], count: count || 0, error };
  },

  async getCmsPageBySlug(slug) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  async getCmsPageById(id) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createCmsPage(pageData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    const payload = {
      ...pageData,
      content: sanitizeHtml(pageData.content || ''),
      created_by: userId,
      updated_at: new Date().toISOString()
    };
    
    if (payload.status === 'published' && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('cms_pages')
      .insert([payload])
      .select()
      .single();

    if (data && !error) {
      // Save initial version
      await this.saveCmsPageVersion(data.id, data, 1, userId);
      // Audit log
      await this.logAdminAudit('CMS Page Created', `Created page "${data.title}" (${data.slug})`);
    }

    return { data, error };
  },

  async updateCmsPage(id, pageData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    // Fetch current state for versioning count
    const { data: existing } = await supabase.from('cms_pages').select('*').eq('id', id).single();

    const payload = {
      ...pageData,
      content: sanitizeHtml(pageData.content || ''),
      updated_at: new Date().toISOString()
    };

    if (payload.status === 'published' && (!existing || !existing.published_at)) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('cms_pages')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      // Versioning
      const { count } = await supabase.from('cms_page_versions').select('id', { count: 'exact' }).eq('page_id', id);
      const nextVer = (count || 0) + 1;
      await this.saveCmsPageVersion(id, data, nextVer, userId);

      await this.logAdminAudit('CMS Page Updated', `Updated page "${data.title}" status: ${data.status}`);
    }

    return { data, error };
  },

  async saveCmsPageVersion(pageId, pageData, versionNumber, userId = null) {
    if (!isSupabaseConfigured()) return;
    await supabase.from('cms_page_versions').insert([{
      page_id: pageId,
      version_number: versionNumber,
      title: pageData.title,
      content: pageData.content,
      excerpt: pageData.excerpt,
      meta_title: pageData.meta_title,
      meta_description: pageData.meta_description,
      canonical_url: pageData.canonical_url,
      noindex: pageData.noindex,
      created_by: userId
    }]);
  },

  async getCmsPageVersions(pageId) {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    const { data, error } = await supabase
      .from('cms_page_versions')
      .select('*')
      .eq('page_id', pageId)
      .order('version_number', { ascending: false });
    return { data: data || [], error };
  },

  async restoreCmsPageVersion(pageId, versionId, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data: ver } = await supabase.from('cms_page_versions').select('*').eq('id', versionId).single();
    if (!ver) return { data: null, error: 'VERSION_NOT_FOUND' };

    return await this.updateCmsPage(pageId, {
      title: ver.title,
      content: ver.content,
      excerpt: ver.excerpt,
      meta_title: ver.meta_title,
      meta_description: ver.meta_description,
      canonical_url: ver.canonical_url,
      noindex: ver.noindex
    }, userId);
  },

  // -------------------------------------------------------------
  // 2. BLOG SYSTEM ENGINE
  // -------------------------------------------------------------
  async getBlogCategories() {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true });
    return { data: data || [], error };
  },

  async createBlogCategory(catData) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('blog_categories')
      .insert([catData])
      .select()
      .single();
    return { data, error };
  },

  async updateBlogCategory(id, catData) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('blog_categories')
      .update(catData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async getBlogPosts(options = {}) {
    if (!isSupabaseConfigured()) return { data: [], count: 0, error: null };
    let query = supabase.from('blog_posts').select(`
      *,
      category:blog_categories(id, name, slug)
    `, { count: 'exact' });

    if (options.status) query = query.eq('status', options.status);
    if (options.category_id) query = query.eq('category_id', options.category_id);
    if (options.category_slug && options.category_slug !== 'all') {
      // Find category first
      const { data: cat } = await supabase.from('blog_categories').select('id').eq('slug', options.category_slug).single();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,content.ilike.%${options.search}%`);
    }

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order('published_at', { ascending: false, nullsFirst: false }).range(from, to);

    const { data, count, error } = await query;
    return { data: data || [], count: count || 0, error };
  },

  async getBlogPostBySlug(slug) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  async createBlogPost(postData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const payload = {
      ...postData,
      content: sanitizeHtml(postData.content || ''),
      updated_at: new Date().toISOString()
    };

    if (payload.status === 'published' && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([payload])
      .select()
      .single();

    if (data && !error) {
      await this.saveBlogPostVersion(data.id, data, 1, userId);
      await this.logAdminAudit('Blog Post Created', `Created article "${data.title}" (${data.slug})`);
    }

    return { data, error };
  },

  async updateBlogPost(id, postData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const { data: existing } = await supabase.from('blog_posts').select('*').eq('id', id).single();

    const payload = {
      ...postData,
      content: sanitizeHtml(postData.content || ''),
      updated_at: new Date().toISOString()
    };

    if (payload.status === 'published' && (!existing || !existing.published_at)) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      const { count } = await supabase.from('blog_post_versions').select('id', { count: 'exact' }).eq('post_id', id);
      const nextVer = (count || 0) + 1;
      await this.saveBlogPostVersion(id, data, nextVer, userId);

      await this.logAdminAudit('Blog Post Updated', `Updated article "${data.title}" status: ${data.status}`);
    }

    return { data, error };
  },

  async saveBlogPostVersion(postId, postData, versionNumber, userId = null) {
    if (!isSupabaseConfigured()) return;
    await supabase.from('blog_post_versions').insert([{
      post_id: postId,
      version_number: versionNumber,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      meta_title: postData.meta_title,
      meta_description: postData.meta_description,
      canonical_url: postData.canonical_url,
      noindex: postData.noindex,
      created_by: userId
    }]);
  },

  async getBlogPostVersions(postId) {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    const { data, error } = await supabase
      .from('blog_post_versions')
      .select('*')
      .eq('post_id', postId)
      .order('version_number', { ascending: false });
    return { data: data || [], error };
  },

  async restoreBlogPostVersion(postId, versionId, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data: ver } = await supabase.from('blog_post_versions').select('*').eq('id', versionId).single();
    if (!ver) return { data: null, error: 'VERSION_NOT_FOUND' };

    return await this.updateBlogPost(postId, {
      title: ver.title,
      excerpt: ver.excerpt,
      content: ver.content,
      meta_title: ver.meta_title,
      meta_description: ver.meta_description,
      canonical_url: ver.canonical_url,
      noindex: ver.noindex
    }, userId);
  },

  // -------------------------------------------------------------
  // 3. REAL PRODUCT & VEHICLE REFERENCE ENGINE
  // -------------------------------------------------------------
  async fetchRealProductsByIds(productIds = []) {
    if (!isSupabaseConfigured() || !productIds.length) return [];
    const { data } = await supabase
      .from('products')
      .select('id, name, title, price, image, part_number, is_active, slug')
      .in('id', productIds);
    return (data || []).map(p => ({
      ...p,
      title: p.title || p.name || 'Auto Part',
      isActive: p.is_active !== false
    }));
  },

  async fetchRealVehiclesByIds(vehicleIds = []) {
    if (!isSupabaseConfigured() || !vehicleIds.length) return [];
    const { data } = await supabase
      .from('vehicle_master')
      .select('id, make, model, variant, year_start, year_end, slug')
      .in('id', vehicleIds);
    return data || [];
  },

  async fetchRelatedBlogPosts(currentPost) {
    if (!isSupabaseConfigured() || !currentPost) return [];
    
    let query = supabase.from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, published_at')
      .eq('status', 'published')
      .neq('id', currentPost.id)
      .limit(3);

    if (currentPost.category_id) {
      query = query.eq('category_id', currentPost.category_id);
    }

    const { data } = await query;
    return data || [];
  },

  // -------------------------------------------------------------
  // 4. FAQ SYSTEM ENGINE
  // -------------------------------------------------------------
  async getFaqs(filters = {}) {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    let query = supabase.from('faqs').select('*');

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.category_id) query = query.eq('category_id', filters.category_id);
    if (filters.product_id) query = query.eq('product_id', filters.product_id);
    if (filters.vehicle_id) query = query.eq('vehicle_id', filters.vehicle_id);

    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data: data || [], error };
  },

  async createFaq(faqData) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('faqs')
      .insert([{ ...faqData, updated_at: new Date().toISOString() }])
      .select()
      .single();
    return { data, error };
  },

  async updateFaq(id, faqData) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...faqData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteFaq(id) {
    if (!isSupabaseConfigured()) return { error: 'SUPABASE_NOT_CONFIGURED' };
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    return { error };
  },

  // -------------------------------------------------------------
  // 5. SEO REDIRECTS ENGINE
  // -------------------------------------------------------------
  async getSeoRedirects() {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    const { data, error } = await supabase
      .from('seo_redirects')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async createSeoRedirect(redirectData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    // Prevent redirect loop
    if (redirectData.source_path.trim() === redirectData.destination_path.trim()) {
      return { data: null, error: new Error('Source path and Destination path cannot be identical (Loop prevention).') };
    }

    const { data, error } = await supabase
      .from('seo_redirects')
      .insert([{
        source_path: redirectData.source_path.trim(),
        destination_path: redirectData.destination_path.trim(),
        status_code: parseInt(redirectData.status_code || 301, 10),
        active: redirectData.active !== false,
        created_by: userId
      }])
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('SEO Redirect Created', `Redirect ${data.source_path} -> ${data.destination_path} (${data.status_code})`);
    }

    return { data, error };
  },

  async updateSeoRedirect(id, redirectData) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    const { data, error } = await supabase
      .from('seo_redirects')
      .update({
        ...redirectData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteSeoRedirect(id) {
    if (!isSupabaseConfigured()) return { error: 'SUPABASE_NOT_CONFIGURED' };
    const { error } = await supabase.from('seo_redirects').delete().eq('id', id);
    return { error };
  },

  // -------------------------------------------------------------
  // 6. SEO AUDIT DASHBOARD & BROKEN LINK DETECTOR
  // -------------------------------------------------------------
  async getSeoAuditDashboardData() {
    if (!isSupabaseConfigured()) {
      return {
        stats: { totalAudited: 0, avgCompleteness: 100, missingTitles: 0, missingMetaDesc: 0, missingCanonical: 0, duplicateTitles: 0, duplicateDescs: 0, noindexCount: 0, missingAltText: 0 },
        issues: [],
        productsAudit: [],
        categoriesAudit: [],
        blogAudit: [],
        cmsAudit: []
      };
    }

    // Fetch core tables
    const [{ data: products }, { data: categories }, { data: brands }, { data: blogs }, { data: cmsPages }] = await Promise.all([
      supabase.from('products').select('id, name, title, meta_title, meta_description, canonical_url, noindex, alt_text, image, updated_at'),
      supabase.from('categories').select('id, name, meta_title, meta_description, canonical_url, noindex, alt_text, updated_at'),
      supabase.from('brands').select('id, name, meta_title, meta_description, canonical_url, noindex, updated_at'),
      supabase.from('blog_posts').select('id, title, slug, meta_title, meta_description, canonical_url, noindex, alt_text, status, updated_at'),
      supabase.from('cms_pages').select('id, title, slug, meta_title, meta_description, canonical_url, noindex, alt_text, status, updated_at')
    ]);

    const allItems = [];
    let missingTitles = 0;
    let missingMetaDesc = 0;
    let missingCanonical = 0;
    let noindexCount = 0;
    let missingAltText = 0;

    const titleMap = new Map();
    const descMap = new Map();

    const processItem = (item, type, linkPrefix) => {
      const name = item.title || item.name || '';
      const metaTitle = item.meta_title || '';
      const metaDesc = item.meta_description || '';
      const canonical = item.canonical_url || '';
      const alt = item.alt_text || item.image || '';

      const completeness = calculateSeoCompleteness({
        ...item,
        title: name,
        meta_title: metaTitle,
        meta_description: metaDesc,
        canonical_url: canonical,
        alt_text: alt
      });

      if (!metaTitle) missingTitles++;
      if (!metaDesc) missingMetaDesc++;
      if (!canonical) missingCanonical++;
      if (item.noindex) noindexCount++;
      if (!alt && type !== 'brand') missingAltText++;

      // Check duplicates
      if (metaTitle) {
        titleMap.set(metaTitle, (titleMap.get(metaTitle) || 0) + 1);
      }
      if (metaDesc) {
        descMap.set(metaDesc, (descMap.get(metaDesc) || 0) + 1);
      }

      allItems.push({
        id: item.id,
        type,
        name,
        slug: item.slug || item.id,
        link: `${linkPrefix}/${item.slug || item.id}`,
        metaTitle,
        metaDesc,
        canonical,
        noindex: Boolean(item.noindex),
        alt,
        completeness
      });
    };

    (products || []).forEach(p => processItem(p, 'product', '/product'));
    (categories || []).forEach(c => processItem(c, 'category', '/category'));
    (brands || []).forEach(b => processItem(b, 'brand', '/brand'));
    (blogs || []).filter(b => b.status === 'published').forEach(b => processItem(b, 'blog', '/blog'));
    (cmsPages || []).filter(p => p.status === 'published').forEach(p => processItem(p, 'cms', '/page'));

    // Count duplicates
    let duplicateTitles = 0;
    let duplicateDescs = 0;
    titleMap.forEach(count => { if (count > 1) duplicateTitles++; });
    descMap.forEach(count => { if (count > 1) duplicateDescs++; });

    const avgCompleteness = allItems.length 
      ? Math.round(allItems.reduce((acc, curr) => acc + curr.completeness.score, 0) / allItems.length)
      : 100;

    return {
      stats: {
        totalAudited: allItems.length,
        avgCompleteness,
        missingTitles,
        missingMetaDesc,
        missingCanonical,
        duplicateTitles,
        duplicateDescs,
        noindexCount,
        missingAltText
      },
      items: allItems
    };
  },

  async detectBrokenInternalLinks() {
    if (!isSupabaseConfigured()) return { brokenLinks: [], totalChecked: 0 };

    const brokenLinks = [];
    let totalChecked = 0;

    // Fetch published blog posts and CMS pages to inspect content
    const [{ data: blogs }, { data: cmsPages }, { data: products }, { data: categories }] = await Promise.all([
      supabase.from('blog_posts').select('id, title, slug, content').eq('status', 'published'),
      supabase.from('cms_pages').select('id, title, slug, content').eq('status', 'published'),
      supabase.from('products').select('id, slug'),
      supabase.from('categories').select('id, slug')
    ]);

    const validProductIds = new Set((products || []).flatMap(p => [p.id, p.slug]));
    const validCategoryIds = new Set((categories || []).flatMap(c => [c.id, c.slug]));
    const validBlogSlugs = new Set((blogs || []).map(b => b.slug));
    const validCmsSlugs = new Set((cmsPages || []).map(p => p.slug));

    const checkHtmlLinks = (content, sourceTitle, sourceUrl) => {
      if (!content) return;
      // Regex for href attribute
      const hrefRegex = /href=["']([^"']+)["']/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        totalChecked++;
        const targetUrl = match[1];

        if (targetUrl.startsWith('/product/')) {
          const targetId = targetUrl.replace('/product/', '');
          if (!validProductIds.has(targetId)) {
            brokenLinks.push({ sourceTitle, sourceUrl, targetUrl, reason: 'Referenced Product does not exist or was deleted' });
          }
        } else if (targetUrl.startsWith('/category/')) {
          const targetId = targetUrl.replace('/category/', '');
          if (!validCategoryIds.has(targetId)) {
            brokenLinks.push({ sourceTitle, sourceUrl, targetUrl, reason: 'Referenced Category does not exist' });
          }
        } else if (targetUrl.startsWith('/blog/')) {
          const targetSlug = targetUrl.replace('/blog/', '');
          if (!validBlogSlugs.has(targetSlug)) {
            brokenLinks.push({ sourceTitle, sourceUrl, targetUrl, reason: 'Referenced Blog Post does not exist or was unpublished' });
          }
        } else if (targetUrl.startsWith('/page/')) {
          const targetSlug = targetUrl.replace('/page/', '');
          if (!validCmsSlugs.has(targetSlug)) {
            brokenLinks.push({ sourceTitle, sourceUrl, targetUrl, reason: 'Referenced CMS Page does not exist or was archived' });
          }
        }
      }
    };

    (blogs || []).forEach(b => checkHtmlLinks(b.content, b.title, `/blog/${b.slug}`));
    (cmsPages || []).forEach(p => checkHtmlLinks(p.content, p.title, `/page/${p.slug}`));

    return {
      brokenLinks,
      totalChecked
    };
  },

  // -------------------------------------------------------------
  // 7. DYNAMIC LANDING PAGES DATA PROVIDER
  // -------------------------------------------------------------
  async getVehicleLandingData(vehicleSlug) {
    if (!isSupabaseConfigured()) return { vehicle: null, compatibleProducts: [], compatibleCategories: [], availableBrands: [], relatedArticles: [] };

    // 1. Fetch vehicle from vehicle_master (exact slug match or ID match)
    const { data: vehicle } = await supabase
      .from('vehicle_master')
      .select('*')
      .or(`slug.eq.${vehicleSlug},id.eq.${vehicleSlug}`)
      .single();

    if (!vehicle) return { vehicle: null, compatibleProducts: [], compatibleCategories: [], availableBrands: [], relatedArticles: [] };

    // 2. Fetch verified compatibility records for this vehicle
    const { data: compRecords } = await supabase
      .from('product_compatibility')
      .select('product_id')
      .eq('vehicle_id', vehicle.id);

    const productIds = (compRecords || []).map(r => r.product_id);

    if (!productIds.length) {
      return {
        vehicle,
        compatibleProducts: [],
        compatibleCategories: [],
        availableBrands: [],
        relatedArticles: []
      };
    }

    // 3. Fetch explicit products from DB
    const { data: products } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        brand_rel:brands(id, name, slug)
      `)
      .in('id', productIds)
      .eq('is_active', true);

    const compatibleProducts = products || [];

    // Extract unique categories & brands from verified products
    const categoryMap = new Map();
    const brandMap = new Map();

    compatibleProducts.forEach(p => {
      if (p.category) categoryMap.set(p.category.id, p.category);
      if (p.brand_rel) brandMap.set(p.brand_rel.id, p.brand_rel);
      else if (p.brand) brandMap.set(p.brand, { id: p.brand, name: p.brand });
    });

    const compatibleCategories = Array.from(categoryMap.values());
    const availableBrands = Array.from(brandMap.values());

    // Fetch related published blog articles referencing this vehicle
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, published_at')
      .eq('status', 'published')
      .contains('vehicle_ids', [vehicle.id])
      .limit(3);

    return {
      vehicle,
      compatibleProducts,
      compatibleCategories,
      availableBrands,
      relatedArticles: articles || []
    };
  },

  async getCategoryVehicleLandingData(categorySlug, vehicleSlug) {
    if (!isSupabaseConfigured()) return { category: null, vehicle: null, verifiedProducts: [], availableBrands: [] };

    // 1. Fetch category & vehicle
    const [{ data: category }, { data: vehicle }] = await Promise.all([
      supabase.from('categories').select('*').or(`slug.eq.${categorySlug},id.eq.${categorySlug}`).single(),
      supabase.from('vehicle_master').select('*').or(`slug.eq.${vehicleSlug},id.eq.${vehicleSlug}`).single()
    ]);

    if (!category || !vehicle) return { category: null, vehicle: null, verifiedProducts: [], availableBrands: [] };

    // 2. Fetch explicit product compatibility matches
    const { data: compRecords } = await supabase
      .from('product_compatibility')
      .select('product_id')
      .eq('vehicle_id', vehicle.id);

    const compProductIds = (compRecords || []).map(r => r.product_id);

    if (!compProductIds.length) {
      return { category, vehicle, verifiedProducts: [], availableBrands: [] };
    }

    // 3. Strict match: product.category_id matches AND product is in explicit compatibility
    const { data: products } = await supabase
      .from('products')
      .select(`
        *,
        brand_rel:brands(id, name, slug)
      `)
      .in('id', compProductIds)
      .eq('category_id', category.id)
      .eq('is_active', true);

    const verifiedProducts = products || [];

    const brandMap = new Map();
    verifiedProducts.forEach(p => {
      if (p.brand_rel) brandMap.set(p.brand_rel.id, p.brand_rel);
      else if (p.brand) brandMap.set(p.brand, { id: p.brand, name: p.brand });
    });

    return {
      category,
      vehicle,
      verifiedProducts,
      availableBrands: Array.from(brandMap.values())
    };
  },

  // -------------------------------------------------------------
  // 8. AUDIT LOG HELPER
  // -------------------------------------------------------------
  async logAdminAudit(action, details = '') {
    try {
      if (!isSupabaseConfigured()) return;
      await supabase.from('admin_audit_logs').insert([{
        action,
        details,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.warn('Audit log write error:', e);
    }
  }
};
