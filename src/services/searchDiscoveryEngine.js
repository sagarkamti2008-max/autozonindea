// 9-Level Priority Ranking Engine, Hinglish/Typo Normalizer & OEM/Cross-Reference Search Engine for AutoZonIndia

// Automotive Typo & Hinglish Normalizer Dictionary
export const TYPO_NORMALIZER_MAP = {
  'toyata': 'Toyota',
  'hyundia': 'Hyundai',
  'break pad': 'Brake Pad',
  'brakepad': 'Brake Pad',
  'brk pad': 'Brake Pad',
  'brake pads': 'Brake Pad',
  'oil filterr': 'Oil Filter',
  'oil filters': 'Oil Filter',
  'air filters': 'Air Filter',
  'air filterr': 'Air Filter',
  'cabin filters': 'Cabin Filter',
  'spark plugs': 'Spark Plug',
  'cltch': 'Clutch',
  'shocker': 'Shock Absorber',
  'shockers': 'Shock Absorber',
  'meri car ka brake pad': 'Brake Pad',
  'car ka oil filter': 'Oil Filter',
  'gaadi ka shocker': 'Shock Absorber'
};

export const normalizeAutomotiveQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  let q = query.trim().toLowerCase();
  
  // Replace Hinglish / typos
  Object.entries(TYPO_NORMALIZER_MAP).forEach(([typo, corrected]) => {
    if (q.includes(typo)) {
      q = q.replace(typo, corrected.toLowerCase());
    }
  });

  return q;
};

/**
 * Identifies if query matches an OEM Number, MPN, SKU, Barcode, Old Part Number, or Cross Reference.
 * Returns matched identifier detail or null.
 */
export const findMatchedPartIdentifier = (product, searchQuery) => {
  if (!product || !searchQuery) return null;
  const qClean = searchQuery.trim().replace(/[^a-z0-9]/gi, '').toLowerCase();
  if (!qClean) return null;

  // 1. OEM Part Number
  const oemVal = product.oemNumber || product.oemPartNumber || product.oem || '';
  if (oemVal && oemVal.replace(/[^a-z0-9]/gi, '').toLowerCase().includes(qClean)) {
    return { type: 'OEM Part Number', value: oemVal };
  }

  // 2. Manufacturer Part Number (MPN)
  const mpnVal = product.mpn || product.manufacturerPartNumber || '';
  if (mpnVal && mpnVal.replace(/[^a-z0-9]/gi, '').toLowerCase().includes(qClean)) {
    return { type: 'Manufacturer Part Number (MPN)', value: mpnVal };
  }

  // 3. SKU
  const skuVal = product.sku || '';
  if (skuVal && skuVal.replace(/[^a-z0-9]/gi, '').toLowerCase().includes(qClean)) {
    return { type: 'SKU', value: skuVal };
  }

  // 4. Barcode / EAN / UPC
  const barcodeVal = product.barcode || product.ean || product.upc || '';
  if (barcodeVal && barcodeVal.replace(/[^a-z0-9]/gi, '').toLowerCase().includes(qClean)) {
    return { type: 'Barcode / EAN', value: barcodeVal };
  }

  // 5. Old / Alternate Part Number
  const oldPartVal = product.oldPartNumber || product.supersededPartNumber || product.alternatePartNumber || '';
  if (oldPartVal && oldPartVal.replace(/[^a-z0-9]/gi, '').toLowerCase().includes(qClean)) {
    return { type: 'Old / Superseded Part Number', value: oldPartVal };
  }

  // 6. Cross-Reference Numbers
  const rawCrossRefs = product.crossReferences || product.crossReferenceNumbers || product.cross_references || [];
  const crossRefList = Array.isArray(rawCrossRefs) 
    ? rawCrossRefs 
    : (typeof rawCrossRefs === 'string' ? rawCrossRefs.split(',').map(s => s.trim()) : []);

  for (const cr of crossRefList) {
    if (cr && cr.replace(/[^a-z0-9]/gi, '').toLowerCase().includes(qClean)) {
      return { type: 'Cross Reference Number', value: cr };
    }
  }

  return null;
};

// 9-Level Priority Ranking Engine with OEM / Cross-Reference Support
export const rankProductSearchResults = (productsParam, searchQueryParam, selectedVehicleParam = null) => {
  let products = Array.isArray(productsParam) ? productsParam : (Array.isArray(searchQueryParam) ? searchQueryParam : []);
  let searchQuery = typeof searchQueryParam === 'string' ? searchQueryParam : (typeof productsParam === 'string' ? productsParam : '');
  let selectedVehicle = (typeof selectedVehicleParam === 'object') ? selectedVehicleParam : null;

  if (!products || !Array.isArray(products) || products.length === 0) return [];
  if (!searchQuery || !searchQuery.trim()) return products;

  const normalizedQuery = normalizeAutomotiveQuery(searchQuery);
  const cleanPartNoQuery = normalizedQuery.replace(/[^a-z0-9]/gi, '');

  return products.map(product => {
    if (!product) return { searchScore: 0 };
    let score = 0;

    const matchedIdent = findMatchedPartIdentifier(product, searchQuery);

    if (matchedIdent) {
      if (matchedIdent.type === 'OEM Part Number') score += 1000;
      else if (matchedIdent.type === 'Manufacturer Part Number (MPN)') score += 950;
      else if (matchedIdent.type === 'SKU') score += 900;
      else if (matchedIdent.type === 'Old / Superseded Part Number') score += 850;
      else if (matchedIdent.type === 'Barcode / EAN') score += 800;
      else if (matchedIdent.type === 'Cross Reference Number') score += 750;
    }

    // Title / Name Match (+300)
    const prodTitle = (product.title || product.name || '').toLowerCase();
    const queryStem = normalizedQuery.replace(/s$/i, ''); // e.g. "air filters" -> "air filter"
    if (prodTitle && (prodTitle.includes(normalizedQuery) || (queryStem.length > 3 && prodTitle.includes(queryStem)))) {
      score += 300;
    }

    // Brand / Car Brand / Category / Car Model Match (+200)
    const prodCategory = (product.category || '').toLowerCase();
    const prodBrand = (product.brand || product.carBrand || '').toLowerCase();
    const prodModel = (product.carModel || product.model || '').toLowerCase();

    if (
      (prodCategory && (prodCategory.includes(normalizedQuery) || prodCategory.includes(queryStem))) ||
      (prodBrand && (prodBrand.includes(normalizedQuery) || prodBrand.includes(queryStem))) ||
      (prodModel && (prodModel.includes(normalizedQuery) || prodModel.includes(queryStem)))
    ) {
      score += 200;
    }

    // Verified Vehicle Fitment Boost (+250)
    if (selectedVehicle) {
      const isFit = product.isUniversal || (product.fitments && product.fitments.some(v => 
        (v.make || v.brand || '').toLowerCase().includes((selectedVehicle.brand || selectedVehicle.make || '').toLowerCase()) &&
        (v.model || '').toLowerCase().includes((selectedVehicle.model || '').toLowerCase())
      ));
      if (isFit) {
        score += 250;
      }
    }

    // In-Stock Boost (+40)
    if (product.stock > 0) {
      score += 40;
    }

    return {
      ...product,
      searchScore: score,
      matchedIdentifier: matchedIdent
    };
  })
  .filter(p => p.searchScore > 0)
  .sort((a, b) => b.searchScore - a.searchScore);
};

// Aliases for backwards compatibility
export const rankProductSearch = (a, b, c) => rankProductSearchResults(a, b, c);

export const parseNaturalLanguagePartQuery = (query) => {
  if (!query) return { intent: 'general_search', keywords: [] };
  const normalized = normalizeAutomotiveQuery(query);
  return {
    rawQuery: query,
    normalizedQuery: normalized,
    intent: 'part_lookup',
    keywords: normalized.split(/\s+/).filter(Boolean)
  };
};
