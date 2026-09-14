import { supabase } from './supabaseClient';
import { logAdminAudit } from './adminAnalyticsEngine';

/**
 * AutoZoneIndia Bulk Import, Catalog Management & Data Quality Engine
 * Production-ready server-side validated CSV batch import, duplicate protection,
 * category/brand mapping, bulk edit, bulk price/stock updates, catalog health quality scoring.
 */

// Supported CSV Header Columns
export const SUPPORTED_CSV_COLUMNS = [
  'sku',
  'name',
  'slug',
  'category',
  'brand',
  'description',
  'short_description',
  'mrp',
  'price',
  'sale_price',
  'tax_rate',
  'warranty',
  'status',
  'featured',
  'stock',
  'reorder_level',
  'supplier_sku',
  'purchase_price',
  'image_1',
  'image_2',
  'image_3',
  'image_4',
  'image_5',
  'meta_title',
  'meta_description',
  'search_keywords'
];

// ----------------------------------------------------------------------
// 1. CSV PARSING & TEMPLATE GENERATION
// ----------------------------------------------------------------------

export function generateCSVTemplate() {
  const headers = SUPPORTED_CSV_COLUMNS.join(',');
  const sampleRow = [
    'AZI-BRK-994201',
    'Ceramic High-Performance Front Brake Pad Kit',
    'ceramic-high-performance-front-brake-pad-kit',
    'Brake Parts',
    'BOSCH',
    'High performance ceramic brake pads designed for extreme heat resistance and low dust.',
    'OEM Original Front Brake Pad Kit for Innova Crysta',
    '4200',
    '3450',
    '3200',
    '18',
    '1 Year / 20,000 KM',
    'active',
    'true',
    '24',
    '5',
    'BOS-BP-9942',
    '2450',
    'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=800',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800',
    '',
    '',
    '',
    'Buy Bosch Ceramic Front Brake Pad Kit Online India',
    'Genuine Bosch ceramic front brake pads for Toyota Innova Crysta with 1 year warranty.',
    'brake pad, bosch brake pad, innova crysta brake pad'
  ].map(val => `"${val.replace(/"/g, '""')}"`).join(',');

  return `${headers}\n${sampleRow}`;
}

export function parseCSVText(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r\n|\n|\r/);
  if (lines.length === 0) return [];

  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawHeaders = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const lineStr = lines[i].trim();
    if (!lineStr) continue;
    const values = parseLine(lineStr);
    const rowObj = {};
    rawHeaders.forEach((h, index) => {
      if (h) {
        rowObj[h] = values[index] !== undefined ? values[index] : '';
      }
    });
    rowObj._rowNumber = i + 1;
    rows.push(rowObj);
  }

  return rows;
}

export function generateErrorCSV(jobRows) {
  const headers = 'row_number,sku,product_name,status,action_type,error_messages,warning_messages';
  const csvLines = [headers];

  (jobRows || []).forEach(row => {
    const errors = Array.isArray(row.error_messages) ? row.error_messages.join(' | ') : (row.error_messages || '');
    const warnings = Array.isArray(row.warning_messages) ? row.warning_messages.join(' | ') : (row.warning_messages || '');

    const line = [
      row.row_number,
      `"${(row.sku || '').replace(/"/g, '""')}"`,
      `"${(row.product_name || '').replace(/"/g, '""')}"`,
      row.status,
      row.action_type,
      `"${errors.replace(/"/g, '""')}"`,
      `"${warnings.replace(/"/g, '""')}"`
    ].join(',');

    csvLines.push(line);
  });

  return csvLines.join('\n');
}

// ----------------------------------------------------------------------
// 2. VALIDATION ENGINE & MAPPING DETECTOR
// ----------------------------------------------------------------------

export function validateImportBatch(parsedRows, importMode = 'create_update', existingProducts = [], categoriesList = [], brandsList = [], categoryMapping = {}, brandMapping = {}) {
  const skuMapDB = new Map();
  const slugMapDB = new Map();

  existingProducts.forEach(p => {
    if (p.sku) skuMapDB.set(p.sku.toLowerCase(), p);
    if (p.slug) slugMapDB.set(p.slug.toLowerCase(), p);
  });

  const categoryNameMap = new Map();
  categoriesList.forEach(c => categoryNameMap.set(c.name.toLowerCase(), c.id));

  const brandNameMap = new Map();
  brandsList.forEach(b => brandNameMap.set(b.name.toLowerCase(), b.id));

  const csvSkusSeen = new Set();
  const csvSlugsSeen = new Set();

  const validatedRows = [];
  let validCount = 0;
  let invalidCount = 0;
  let createCount = 0;
  let updateCount = 0;
  let skipCount = 0;

  parsedRows.forEach(row => {
    const errors = [];
    const warnings = [];
    const rowNum = row._rowNumber;
    const rawSku = (row.sku || '').trim();
    const rawName = (row.name || '').trim();
    const rawCategory = (row.category || '').trim();
    const rawBrand = (row.brand || '').trim();
    const rawPrice = (row.price || '').trim();

    // 1. Required Fields Check
    if (!rawSku) errors.push('SKU is required.');
    if (!rawName) errors.push('Product Name is required.');
    if (!rawPrice) errors.push('Price is required.');

    // 2. Format & Duplicates in CSV
    if (rawSku) {
      const skuLower = rawSku.toLowerCase();
      if (csvSkusSeen.has(skuLower)) {
        errors.push(`Duplicate SKU "${rawSku}" found within the CSV file.`);
      } else {
        csvSkusSeen.add(skuLower);
      }
    }

    let slug = row.slug ? row.slug.trim().toLowerCase() : rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (slug) {
      if (csvSlugsSeen.has(slug)) {
        warnings.push(`Duplicate slug "${slug}" in CSV. Unique slug will be auto-generated.`);
        slug = `${slug}-${rowNum}`;
      }
      csvSlugsSeen.add(slug);
    }

    // 3. Category Validation / Mapping
    let resolvedCategoryId = null;
    if (rawCategory) {
      const catLower = rawCategory.toLowerCase();
      if (categoryMapping[catLower]) {
        resolvedCategoryId = categoryMapping[catLower];
      } else if (categoryNameMap.has(catLower)) {
        resolvedCategoryId = categoryNameMap.get(catLower);
      } else {
        errors.push(`Category "${rawCategory}" not found in database. Please map to an existing category.`);
      }
    }

    // 4. Brand Validation / Mapping
    let resolvedBrandId = null;
    if (rawBrand) {
      const brandLower = rawBrand.toLowerCase();
      if (brandMapping[brandLower]) {
        resolvedBrandId = brandMapping[brandLower];
      } else if (brandNameMap.has(brandLower)) {
        resolvedBrandId = brandNameMap.get(brandLower);
      } else {
        warnings.push(`Brand "${rawBrand}" not found in database. Will require mapping or creation.`);
      }
    }

    // 5. Numeric & Financial Validation
    const priceVal = parseFloat(rawPrice);
    if (isNaN(priceVal) || priceVal < 0) {
      errors.push('Price must be a valid positive number.');
    }

    const mrpVal = row.mrp ? parseFloat(row.mrp) : priceVal;
    if (isNaN(mrpVal) || mrpVal < 0) {
      errors.push('MRP must be a valid non-negative number.');
    } else if (mrpVal < priceVal) {
      warnings.push(`MRP (₹${mrpVal}) is less than Selling Price (₹${priceVal}).`);
    }

    const salePriceVal = row.sale_price ? parseFloat(row.sale_price) : null;
    if (salePriceVal !== null && (isNaN(salePriceVal) || salePriceVal > priceVal)) {
      errors.push(`Sale Price (₹${salePriceVal}) cannot exceed Selling Price (₹${priceVal}).`);
    }

    const taxVal = row.tax_rate ? parseFloat(row.tax_rate) : 18;
    if (isNaN(taxVal) || taxVal < 0 || taxVal > 100) {
      errors.push('Tax rate percentage must be between 0 and 100.');
    }

    const stockVal = row.stock ? parseInt(row.stock, 10) : 0;
    if (isNaN(stockVal) || stockVal < 0) {
      errors.push('Stock quantity must be a non-negative integer.');
    }

    // 6. Database Match & Mode Enforcement
    const existingDbProd = rawSku ? skuMapDB.get(rawSku.toLowerCase()) : null;
    let actionType = 'create';

    if (existingDbProd) {
      actionType = 'update';
      if (importMode === 'create_only') {
        errors.push(`SKU "${rawSku}" already exists in database (CREATE ONLY mode prevents updates).`);
      }
    } else {
      actionType = 'create';
      if (importMode === 'update_only') {
        errors.push(`SKU "${rawSku}" does not exist in database (UPDATE ONLY mode prevents creations).`);
      }
    }

    const isValid = errors.length === 0;
    if (isValid) {
      validCount++;
      if (actionType === 'create') createCount++;
      else if (actionType === 'update') updateCount++;
    } else {
      invalidCount++;
      actionType = 'error';
    }

    validatedRows.push({
      row_number: rowNum,
      sku: rawSku,
      name: rawName,
      slug: slug,
      category_name: rawCategory,
      category_id: resolvedCategoryId,
      brand_name: rawBrand,
      brand_id: resolvedBrandId,
      mrp: mrpVal,
      price: priceVal,
      sale_price: salePriceVal,
      tax_rate: taxVal,
      stock: stockVal,
      reorder_level: row.reorder_level ? parseInt(row.reorder_level, 10) : 5,
      warranty: row.warranty || 'Standard Warranty',
      status: row.status || 'active',
      featured: row.featured === 'true' || row.featured === '1',
      description: row.description || '',
      short_description: row.short_description || '',
      supplier_sku: row.supplier_sku || '',
      purchase_price: row.purchase_price ? parseFloat(row.purchase_price) : 0,
      image_urls: [row.image_1, row.image_2, row.image_3, row.image_4, row.image_5].filter(Boolean),
      meta_title: row.meta_title || '',
      meta_description: row.meta_description || '',
      search_keywords: row.search_keywords || '',
      isValid,
      actionType,
      error_messages: errors,
      warning_messages: warnings,
      rawData: row
    });
  });

  return {
    validatedRows,
    totalRows: parsedRows.length,
    validRows: validCount,
    invalidRows: invalidCount,
    createRows: createCount,
    updateRows: updateCount,
    skipRows: skipCount
  };
}

export function detectUnmappedCategories(parsedRows, existingCategories = []) {
  const catSetDB = new Set(existingCategories.map(c => c.name.toLowerCase()));
  const unmapped = new Set();
  parsedRows.forEach(row => {
    const cat = (row.category || '').trim();
    if (cat && !catSetDB.has(cat.toLowerCase())) {
      unmapped.add(cat);
    }
  });
  return Array.from(unmapped);
}

export function detectUnmappedBrands(parsedRows, existingBrands = []) {
  const brandSetDB = new Set(existingBrands.map(b => b.name.toLowerCase()));
  const unmapped = new Set();
  parsedRows.forEach(row => {
    const brand = (row.brand || '').trim();
    if (brand && !brandSetDB.has(brand.toLowerCase())) {
      unmapped.add(brand);
    }
  });
  return Array.from(unmapped);
}

// ----------------------------------------------------------------------
// 3. SERVER-SIDE BATCH IMPORT EXECUTOR
// ----------------------------------------------------------------------

export async function executeImportJob({
  fileName,
  importMode = 'create_update',
  validatedRows,
  adminName = 'Admin User',
  onProgress = null
}) {
  let jobId = null;
  let createdCount = 0;
  let updatedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  try {
    // 1. Create Import Job Record
    const validRowsList = validatedRows.filter(r => r.isValid);
    const totalCount = validatedRows.length;

    const { data: jobData, error: jobErr } = await supabase
      .from('product_import_jobs')
      .insert({
        file_name: fileName,
        import_mode: importMode,
        total_rows: totalCount,
        valid_rows: validRowsList.length,
        status: 'processing',
        started_at: new Date().toISOString(),
        created_by: adminName
      })
      .select()
      .single();

    if (jobErr) {
      console.warn('Import job creation fallback:', jobErr);
    }
    jobId = jobData?.id || `job-${Date.now()}`;

    // 2. Process in Batches of 20
    const BATCH_SIZE = 20;
    const jobRowsLogs = [];

    for (let i = 0; i < validatedRows.length; i += BATCH_SIZE) {
      const chunk = validatedRows.slice(i, i + BATCH_SIZE);

      for (const row of chunk) {
        if (!row.isValid) {
          failedCount++;
          jobRowsLogs.push({
            job_id: jobId,
            row_number: row.row_number,
            sku: row.sku,
            product_name: row.name,
            status: 'failed',
            action_type: 'error',
            error_messages: row.error_messages,
            warning_messages: row.warning_messages,
            row_data: row.rawData
          });
          continue;
        }

        try {
          // Check if SKU exists
          const { data: existing } = await supabase
            .from('products')
            .select('id, name, price, sku')
            .eq('sku', row.sku)
            .maybeSingle();

          let targetProductId = null;
          let isUpdate = false;

          if (existing) {
            targetProductId = existing.id;
            isUpdate = true;

            const { error: updErr } = await supabase
              .from('products')
              .update({
                name: row.name,
                slug: row.slug,
                category_id: row.category_id || undefined,
                brand_id: row.brand_id || undefined,
                description: row.description,
                short_description: row.short_description,
                price: row.price,
                sale_price: row.sale_price,
                mrp: row.mrp,
                tax_percent: row.tax_rate,
                warranty: row.warranty,
                status: row.status === 'active' || row.status === 'true' || row.status === true,
                featured: row.featured,
                reorder_level: row.reorder_level,
                supplier_sku: row.supplier_sku,
                purchase_price: row.purchase_price,
                meta_title: row.meta_title,
                meta_description: row.meta_description,
                search_keywords: row.search_keywords,
                updated_at: new Date().toISOString()
              })
              .eq('id', targetProductId);

            if (updErr) throw updErr;
            updatedCount++;
          } else {
            // Insert New Product
            const { data: newProd, error: insErr } = await supabase
              .from('products')
              .insert({
                name: row.name,
                slug: row.slug,
                sku: row.sku,
                category_id: row.category_id || null,
                brand_id: row.brand_id || null,
                description: row.description,
                short_description: row.short_description,
                price: row.price,
                sale_price: row.sale_price,
                mrp: row.mrp,
                tax_percent: row.tax_rate,
                warranty: row.warranty,
                status: row.status === 'active' || row.status === 'true' || row.status === true,
                featured: row.featured,
                reorder_level: row.reorder_level,
                supplier_sku: row.supplier_sku,
                purchase_price: row.purchase_price,
                meta_title: row.meta_title,
                meta_description: row.meta_description,
                search_keywords: row.search_keywords
              })
              .select('id')
              .single();

            if (insErr) throw insErr;
            targetProductId = newProd.id;
            createdCount++;
          }

          // Upsert Inventory
          if (targetProductId) {
            await supabase.from('inventory').upsert({
              product_id: targetProductId,
              quantity: row.stock,
              low_stock_limit: row.reorder_level || 5,
              updated_at: new Date().toISOString()
            }, { onConflict: 'product_id' });
          }

          // Upsert Product Images if provided
          if (targetProductId && row.image_urls && row.image_urls.length > 0) {
            // Remove existing primary images if update
            if (isUpdate) {
              await supabase.from('product_images').delete().eq('product_id', targetProductId);
            }
            const imgRecords = row.image_urls.map((url, idx) => ({
              product_id: targetProductId,
              image_url: url,
              is_primary: idx === 0,
              sort_order: idx
            }));
            await supabase.from('product_images').insert(imgRecords);
          }

          jobRowsLogs.push({
            job_id: jobId,
            row_number: row.row_number,
            sku: row.sku,
            product_name: row.name,
            status: isUpdate ? 'updated' : 'created',
            action_type: isUpdate ? 'update' : 'create',
            error_messages: [],
            warning_messages: row.warning_messages,
            row_data: row.rawData
          });

        } catch (err) {
          console.error(`Error processing row ${row.row_number} (SKU: ${row.sku}):`, err);
          failedCount++;
          jobRowsLogs.push({
            job_id: jobId,
            row_number: row.row_number,
            sku: row.sku,
            product_name: row.name,
            status: 'failed',
            action_type: 'error',
            error_messages: [err.message || 'Database error during insertion/update'],
            warning_messages: row.warning_messages,
            row_data: row.rawData
          });
        }
      }

      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, validatedRows.length), validatedRows.length);
      }
    }

    // Insert Job Rows Logs
    if (jobRowsLogs.length > 0) {
      await supabase.from('product_import_job_rows').insert(jobRowsLogs);
    }

    // Finalize Job Status
    const finalStatus = failedCount === 0 ? 'completed' : 'completed_with_errors';
    await supabase
      .from('product_import_jobs')
      .update({
        status: finalStatus,
        created_rows: createdCount,
        updated_rows: updatedCount,
        failed_rows: failedCount,
        skipped_rows: skippedCount,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Write Audit Log
    await logAdminAudit({
      action: 'BULK_PRODUCT_IMPORT',
      entity_type: 'catalog',
      details: {
        file_name: fileName,
        import_mode: importMode,
        created_count: createdCount,
        updated_count: updatedCount,
        failed_count: failedCount
      },
      performed_by: adminName
    });

    return {
      success: true,
      jobId,
      status: finalStatus,
      totalRows: validatedRows.length,
      createdRows: createdCount,
      updatedRows: updatedCount,
      failedRows: failedCount,
      skippedRows: skippedCount,
      jobRowsLogs
    };

  } catch (err) {
    console.error('Fatal error executing import job:', err);
    if (jobId) {
      await supabase
        .from('product_import_jobs')
        .update({ status: 'failed', completed_at: new Date().toISOString() })
        .eq('id', jobId);
    }
    return {
      success: false,
      error: err.message || 'Fatal error executing import job'
    };
  }
}

// ----------------------------------------------------------------------
// 4. IMPORT HISTORY & DETAILS
// ----------------------------------------------------------------------

export async function getImportJobs() {
  try {
    const { data, error } = await supabase
      .from('product_import_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Fallback fetching import jobs:', err);
    return [];
  }
}

export async function getImportJobById(jobId) {
  try {
    const { data: job, error: jErr } = await supabase
      .from('product_import_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jErr) throw jErr;

    const { data: rows, error: rErr } = await supabase
      .from('product_import_job_rows')
      .select('*')
      .eq('job_id', jobId)
      .order('row_number', { ascending: true });

    if (rErr) throw rErr;

    return {
      job,
      rows: rows || []
    };
  } catch (err) {
    console.error('Error fetching import job detail:', err);
    return null;
  }
}

// ----------------------------------------------------------------------
// 5. CATALOG QUALITY & COMPLETENESS SCORER
// ----------------------------------------------------------------------

export async function scanCatalogQuality() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id, name, sku, slug, price, mrp, description, short_description,
        category_id, brand_id, status,
        categories(name),
        brands(name),
        inventory(quantity),
        product_images(image_url),
        product_compatibility(id)
      `);

    if (error) throw error;

    let totalCritical = 0;
    let totalWarning = 0;
    let totalGood = 0;

    const scoredProducts = (products || []).map(p => {
      const issues = [];
      let score = 0;

      // 1. Name (15%)
      if (p.name && p.name.trim()) score += 15;
      else issues.push('Missing product title');

      // 2. SKU (15%)
      if (p.sku && p.sku.trim()) score += 15;
      else issues.push('Missing SKU');

      // 3. Category (15%)
      if (p.category_id || p.categories?.name) score += 15;
      else issues.push('Missing category assignment');

      // 4. Brand (10%)
      if (p.brand_id || p.brands?.name) score += 10;
      else issues.push('Missing brand assignment');

      // 5. Price > 0 (15%)
      if (p.price && p.price > 0) score += 15;
      else issues.push('Invalid or 0 price');

      // 6. Image (15%)
      if (p.product_images && p.product_images.length > 0) score += 15;
      else issues.push('Missing product image');

      // 7. Inventory (10%)
      if (p.inventory && p.inventory.quantity !== null && p.inventory.quantity !== undefined) score += 10;
      else issues.push('Missing inventory tracking record');

      // 8. Description (5%)
      if (p.description || p.short_description) score += 5;
      else issues.push('Missing detailed description');

      let healthStatus = 'good';
      if (score < 60) {
        healthStatus = 'critical';
        totalCritical++;
      } else if (score < 85) {
        healthStatus = 'warning';
        totalWarning++;
      } else {
        healthStatus = 'good';
        totalGood++;
      }

      return {
        ...p,
        completenessScore: score,
        healthStatus,
        issues
      };
    });

    return {
      products: scoredProducts,
      totalProducts: scoredProducts.length,
      totalCritical,
      totalWarning,
      totalGood,
      averageCompleteness: scoredProducts.length > 0
        ? Math.round(scoredProducts.reduce((sum, p) => sum + p.completenessScore, 0) / scoredProducts.length)
        : 0
    };
  } catch (err) {
    console.error('Error scanning catalog quality:', err);
    return {
      products: [],
      totalProducts: 0,
      totalCritical: 0,
      totalWarning: 0,
      totalGood: 0,
      averageCompleteness: 0
    };
  }
}

// ----------------------------------------------------------------------
// 6. BULK EDIT, BULK PRICE UPDATE & BULK STOCK UPDATE
// ----------------------------------------------------------------------

export async function applyBulkProductEdit({ productIds, updates, adminName = 'Admin' }) {
  if (!productIds || productIds.length === 0) return { success: false, error: 'No products selected.' };
  try {
    const { error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .in('id', productIds);

    if (error) throw error;

    await logAdminAudit({
      action: 'BULK_PRODUCT_EDIT',
      entity_type: 'products',
      details: { affected_count: productIds.length, updates },
      performed_by: adminName
    });

    return { success: true, count: productIds.length };
  } catch (err) {
    console.error('Error applying bulk product edit:', err);
    return { success: false, error: err.message };
  }
}

export async function validateAndApplyBulkPriceUpdate({ csvRows, adminName = 'Admin', reason = 'Bulk Price Revision' }) {
  const results = [];
  let updatedCount = 0;
  let failedCount = 0;

  for (const row of csvRows) {
    const sku = (row.sku || '').trim();
    if (!sku) continue;

    const newPrice = parseFloat(row.price);
    const newMrp = row.mrp ? parseFloat(row.mrp) : newPrice;
    const newSalePrice = row.sale_price ? parseFloat(row.sale_price) : null;

    if (isNaN(newPrice) || newPrice < 0) {
      results.push({ sku, status: 'failed', error: 'Invalid price number' });
      failedCount++;
      continue;
    }

    try {
      const { data: current } = await supabase
        .from('products')
        .select('id, price, mrp, sale_price')
        .eq('sku', sku)
        .single();

      if (!current) {
        results.push({ sku, status: 'failed', error: 'SKU not found in database' });
        failedCount++;
        continue;
      }

      // Update Product Prices
      await supabase
        .from('products')
        .update({
          price: newPrice,
          mrp: newMrp,
          sale_price: newSalePrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', current.id);

      // Audit Price History
      await supabase.from('product_price_history').insert({
        product_id: current.id,
        sku: sku,
        old_mrp: current.mrp,
        new_mrp: newMrp,
        old_price: current.price,
        new_price: newPrice,
        old_sale_price: current.sale_price,
        new_sale_price: newSalePrice,
        changed_by: adminName,
        change_reason: reason
      });

      results.push({
        sku,
        status: 'updated',
        oldPrice: current.price,
        newPrice: newPrice,
        diff: newPrice - current.price
      });
      updatedCount++;
    } catch (err) {
      results.push({ sku, status: 'failed', error: err.message });
      failedCount++;
    }
  }

  await logAdminAudit({
    action: 'BULK_PRICE_UPDATE',
    entity_type: 'products',
    details: { updatedCount, failedCount, reason },
    performed_by: adminName
  });

  return {
    success: true,
    updatedCount,
    failedCount,
    results
  };
}

export async function validateAndApplyBulkStockUpdate({ csvRows, adminName = 'Admin', reason = 'Bulk Inventory Adjustment' }) {
  const results = [];
  let updatedCount = 0;
  let failedCount = 0;

  for (const row of csvRows) {
    const sku = (row.sku || '').trim();
    const adjustmentQty = parseInt(row.quantity, 10);

    if (!sku || isNaN(adjustmentQty)) {
      results.push({ sku, status: 'failed', error: 'Invalid SKU or quantity' });
      failedCount++;
      continue;
    }

    try {
      const { data: prod } = await supabase
        .from('products')
        .select('id, sku, name')
        .eq('sku', sku)
        .single();

      if (!prod) {
        results.push({ sku, status: 'failed', error: 'SKU not found' });
        failedCount++;
        continue;
      }

      const { data: inv } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', prod.id)
        .maybeSingle();

      const oldStock = inv ? inv.quantity : 0;
      const newStock = Math.max(0, oldStock + adjustmentQty);

      await supabase.from('inventory').upsert({
        product_id: prod.id,
        quantity: newStock,
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id' });

      results.push({
        sku,
        productName: prod.name,
        oldStock,
        adjustment: adjustmentQty,
        newStock,
        status: 'updated'
      });
      updatedCount++;
    } catch (err) {
      results.push({ sku, status: 'failed', error: err.message });
      failedCount++;
    }
  }

  await logAdminAudit({
    action: 'BULK_STOCK_ADJUSTMENT',
    entity_type: 'inventory',
    details: { updatedCount, failedCount, reason },
    performed_by: adminName
  });

  return {
    success: true,
    updatedCount,
    failedCount,
    results
  };
}

export const catalogImportService = {
  SUPPORTED_CSV_COLUMNS,
  generateCSVTemplate,
  parseCSVText,
  generateErrorCSV,
  validateImportBatch,
  detectUnmappedCategories,
  detectUnmappedBrands,
  executeImportJob,
  getImportJobs,
  getImportJobById,
  scanCatalogQuality,
  applyBulkProductEdit,
  validateAndApplyBulkPriceUpdate,
  validateAndApplyBulkStockUpdate
};

export default catalogImportService;
