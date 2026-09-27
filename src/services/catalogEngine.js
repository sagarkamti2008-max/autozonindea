// Automotive Vehicle Fitment & Compatibility Engine for AutoZonIndia

export const getVehicleSlug = (make, model) => {
  if (!model && !make) return '';
  const cleanMake = (make || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const cleanModel = (model || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  if (cleanMake && cleanModel) {
    if (cleanModel.startsWith(cleanMake)) return cleanModel;
    return `${cleanMake}-${cleanModel}`;
  }
  return cleanModel || cleanMake || '';
};

export const checkVehicleProductCompatibility = (product, selectedVehicle) => {
  if (!product) {
    return { compatible: false, isCompatible: false, status: 'Invalid Product', badge: '✕ Incompatible' };
  }

  if (product.isActive === false || product.status === 'inactive' || product.activeStatus === 'inactive') {
    return { compatible: false, isCompatible: false, status: 'Inactive Product', badge: '✕ Inactive' };
  }

  if (!selectedVehicle) {
    return { compatible: true, isCompatible: true, status: 'No Vehicle Selected', badge: '⚠ Select Vehicle' };
  }

  if (product.isUniversal || product.is_universal || product.brand === 'Universal' || product.isUniversalFit) {
    return { compatible: true, isCompatible: true, status: 'Universal Fitment', badge: '✓ Universal Fit' };
  }

  const targetMake = (selectedVehicle.makeName || selectedVehicle.make || selectedVehicle.makeId || '').toLowerCase().trim();
  const targetModel = (selectedVehicle.modelName || selectedVehicle.model || selectedVehicle.modelId || '').toLowerCase().trim();
  const targetSlug = selectedVehicle.vehicleId || selectedVehicle.modelId || getVehicleSlug(targetMake, targetModel);

  // If selectedVehicle has a specific model (e.g. 'Innova Crysta')
  if (targetModel && targetModel !== 'all' && targetModel !== 'all models') {
    const pVehicleId = (product.vehicleId || product.modelId || '').toLowerCase().trim();
    const pCarModel = (product.carModel || product.model || '').toLowerCase().trim();
    const pCompat = (product.compatibleVehicles || []).map(v => typeof v === 'string' ? v.toLowerCase().trim() : (v.vehicleId || v.modelId || v.model || '').toLowerCase().trim());
    const pTitle = (product.title || product.name || '').toLowerCase();
    const pDesc = (product.description || '').toLowerCase();

    // Specific sub-model disambiguation for Innova Crysta, Hycross, Innova (old), Fortuner, etc.
    if (targetSlug.includes('crysta') || targetModel.includes('crysta')) {
      const match = pVehicleId.includes('crysta') || pCarModel.includes('crysta') || pCompat.some(v => v.includes('crysta')) || pTitle.includes('crysta') || pDesc.includes('crysta');
      return match
        ? { compatible: true, isCompatible: true, status: 'Verified Fitment for Crysta', badge: '✓ Verified Compatible' }
        : { compatible: false, isCompatible: false, status: 'Not Compatible with Crysta', badge: '✕ Incompatible' };
    }

    if (targetSlug.includes('hycross') || targetModel.includes('hycross')) {
      const match = pVehicleId.includes('hycross') || pCarModel.includes('hycross') || pCompat.some(v => v.includes('hycross')) || pTitle.includes('hycross') || pDesc.includes('hycross');
      return match
        ? { compatible: true, isCompatible: true, status: 'Verified Fitment for Hycross', badge: '✓ Verified Compatible' }
        : { compatible: false, isCompatible: false, status: 'Not Compatible with Hycross', badge: '✕ Incompatible' };
    }

    if (targetSlug === 'toyota-innova' || targetModel === 'innova') {
      const isCrystaOrHycross = pVehicleId.includes('crysta') || pVehicleId.includes('hycross') || pTitle.includes('crysta') || pTitle.includes('hycross') || pCarModel.includes('crysta') || pCarModel.includes('hycross') || pCompat.some(v => v.includes('crysta') || v.includes('hycross'));
      const hasInnova = pVehicleId.includes('innova') || pCarModel.includes('innova') || pCompat.some(v => v.includes('innova')) || pTitle.includes('innova');
      const match = hasInnova && !isCrystaOrHycross;
      return match
        ? { compatible: true, isCompatible: true, status: 'Verified Fitment for Innova', badge: '✓ Verified Compatible' }
        : { compatible: false, isCompatible: false, status: 'Not Compatible with Innova (Old)', badge: '✕ Incompatible' };
    }

    if (targetSlug.includes('fortuner') || targetModel.includes('fortuner')) {
      const match = pVehicleId.includes('fortuner') || pCarModel.includes('fortuner') || pCompat.some(v => v.includes('fortuner')) || pTitle.includes('fortuner') || pDesc.includes('fortuner');
      return match
        ? { compatible: true, isCompatible: true, status: 'Verified Fitment for Fortuner', badge: '✓ Verified Compatible' }
        : { compatible: false, isCompatible: false, status: 'Not Compatible with Fortuner', badge: '✕ Incompatible' };
    }

    if (targetSlug.includes('glanza') || targetModel.includes('glanza')) {
      const match = pVehicleId.includes('glanza') || pCarModel.includes('glanza') || pCompat.some(v => v.includes('glanza')) || pTitle.includes('glanza') || pDesc.includes('glanza');
      return match
        ? { compatible: true, isCompatible: true, status: 'Verified Fitment for Glanza', badge: '✓ Verified Compatible' }
        : { compatible: false, isCompatible: false, status: 'Not Compatible with Glanza', badge: '✕ Incompatible' };
    }

    // General Model / VehicleId slug match
    const modelSlug = targetModel.replace(/\s+/g, '-');
    const isDirectMatch = pVehicleId === targetSlug ||
                          pVehicleId === modelSlug ||
                          pCarModel === targetModel ||
                          pCompat.includes(targetSlug) ||
                          pCompat.includes(modelSlug) ||
                          pTitle.includes(targetModel);

    if (isDirectMatch) {
      return { compatible: true, isCompatible: true, status: 'Verified Fitment', badge: '✓ Verified Compatible' };
    }
  }

  // Fallback: Check if product has any vehicle constraints at all
  const hasFitmentData = (product.compatibleVehicles && product.compatibleVehicles.length > 0) || product.carModel || product.vehicleId;
  if (!hasFitmentData) {
    return { compatible: true, isCompatible: true, status: 'General Fitment', badge: '✓ Compatible' };
  }

  return { compatible: false, isCompatible: false, status: 'Not Verified', badge: '✕ Incompatible' };
};

export const filterCatalogByVehicleFitment = (products, selectedVehicle) => {
  if (!selectedVehicle) return products;
  return products.filter(p => {
    const check = checkVehicleProductCompatibility(p, selectedVehicle);
    return check.compatible || check.isCompatible;
  });
};

export const isProductMatchingVehicleAndCategory = (
  product,
  activeBrand,
  activeModel,
  activeCategory,
  activeSubCategory,
  activeVariant = '',
  activeYear = ''
) => {
  if (!product) return false;

  // 0. ACTIVE / INACTIVE CHECK
  if (product.isActive === false || product.status === 'inactive' || product.activeStatus === 'inactive' || product.statusText === 'Inactive') {
    return false;
  }

  // Universal product always matches
  if (product.isUniversal || product.is_universal || product.brand === 'Universal' || product.isUniversalFit) {
    if (activeCategory && activeCategory !== 'all') {
      const catLower = activeCategory.toLowerCase().trim();
      const pCat = (product.category || product.categorySlug || '').toLowerCase().trim();
      const pSub = (product.subCategory || '').toLowerCase().trim();
      const pTitle = (product.title || product.name || '').toLowerCase();
      if (!pCat.includes(catLower) && !pSub.includes(catLower) && !pTitle.includes(catLower)) {
        return false;
      }
    }
    return true;
  }

  // 1. BRAND MATCHING
  if (activeBrand && activeBrand !== 'all') {
    const brandSlug = activeBrand.toLowerCase().trim();
    const pBrand = (product.carBrand || product.brand || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();
    const pDesc = (product.description || product.desc || '').toLowerCase();
    const pCompat = (product.compatibleVehicles || []).map(v => typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());

    const brandMatch = pBrand.includes(brandSlug) ||
                       pTitle.includes(brandSlug) ||
                       pDesc.includes(brandSlug) ||
                       pCompat.some(v => v.includes(brandSlug));

    if (!brandMatch) {
      return false;
    }
  }

  // 2. MODEL MATCHING (Strict model-specific disambiguation)
  if (activeModel && activeModel !== 'all' && activeModel !== 'All Models') {
    const targetSlug = getVehicleSlug(activeBrand, activeModel);
    
    const check = checkVehicleProductCompatibility(product, {
      makeName: activeBrand,
      modelName: activeModel,
      vehicleId: targetSlug,
      year: activeYear,
      variant: activeVariant
    });

    if (!check.compatible && !check.isCompatible) {
      return false;
    }
  }

  // 3. VARIANT MATCHING
  if (activeVariant && activeVariant !== 'all' && activeVariant !== 'All') {
    const vLower = activeVariant.toLowerCase().trim();
    const pVariant = (product.variant || product.variantId || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();
    const pCompat = (product.compatibleVehicles || []).map(v => typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    const pFitments = (product.fitments || []).map(f => (f.variant || '').toLowerCase());

    const variantMatch = pVariant.includes(vLower) ||
                         pTitle.includes(vLower) ||
                         pCompat.some(v => v.includes(vLower)) ||
                         pFitments.some(f => f.includes(vLower));

    if (!variantMatch && !product.isUniversal) {
      return false;
    }
  }

  // 4. YEAR MATCHING
  if (activeYear && activeYear !== 'all' && activeYear !== 'All') {
    const targetYr = parseInt(activeYear, 10);
    if (!isNaN(targetYr)) {
      let yearMatch = false;

      // Single year field
      if (product.year && parseInt(product.year, 10) === targetYr) {
        yearMatch = true;
      }

      // Start/End year
      if (!yearMatch && product.yearStart && product.yearEnd) {
        const yS = parseInt(product.yearStart, 10);
        const yE = parseInt(product.yearEnd, 10);
        if (targetYr >= yS && targetYr <= yE) yearMatch = true;
      }

      // Check fitments
      if (!yearMatch && Array.isArray(product.fitments)) {
        yearMatch = product.fitments.some(f => {
          const yF = parseInt(f.yearFrom || f.yearStart, 10);
          const yT = parseInt(f.yearTo || f.yearEnd, 10);
          if (!isNaN(yF) && !isNaN(yT)) {
            return targetYr >= yF && targetYr <= yT;
          }
          return false;
        });
      }

      // Check compatibleVehicles
      if (!yearMatch && Array.isArray(product.compatibleVehicles)) {
        yearMatch = product.compatibleVehicles.some(v => {
          if (typeof v === 'string') return v.includes(String(targetYr));
          const yS = parseInt(v.yearStart || v.yearFrom, 10);
          const yE = parseInt(v.yearEnd || v.yearTo, 10);
          if (!isNaN(yS) && !isNaN(yE)) {
            return targetYr >= yS && targetYr <= yE;
          }
          return false;
        });
      }

      // Check title string for year range e.g. "2016-2020" or "2014"
      if (!yearMatch) {
        const pTitle = (product.title || '').toLowerCase();
        if (pTitle.includes(String(targetYr))) yearMatch = true;
      }

      if (!yearMatch && !product.isUniversal) {
        return false;
      }
    }
  }

  // 5. CATEGORY MATCHING (14 Master Parts Categories)
  if (activeCategory && activeCategory !== 'all') {
    const catLower = activeCategory.toLowerCase().trim();
    const pCat = (product.category || product.categorySlug || '').toLowerCase().trim();
    const pSub = (product.subCategory || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    let catMatch = false;

    if (catLower === 'engine-parts' || catLower === 'cat-engine' || catLower === 'engine_parts' || catLower === 'engine parts') {
      catMatch = pCat.includes('engine') || pSub.includes('engine') || pTitle.includes('engine') || pTitle.includes('spark') || pTitle.includes('clutch') || pTitle.includes('piston') || pTitle.includes('gasket');
    } else if (catLower === 'brake-parts' || catLower === 'cat-brakes' || catLower === 'braking_system' || catLower === 'brake parts') {
      catMatch = pCat.includes('brake') || pCat.includes('suspension') || pSub.includes('brake') || pSub.includes('shock') || pTitle.includes('brake') || pTitle.includes('pad') || pTitle.includes('disc') || pTitle.includes('absorber');
    } else if (catLower === 'filters' || catLower === 'cat-filters' || catLower === 'filters_oils') {
      catMatch = pCat.includes('filter') || pSub.includes('filter') || pTitle.includes('filter');
    } else if (catLower === 'body-parts' || catLower === 'cat-body' || catLower === 'body-bumper' || catLower === 'body parts') {
      catMatch = pCat.includes('body') || pCat.includes('bumper') || pSub.includes('bumper') || pTitle.includes('bumper') || pTitle.includes('fender') || pTitle.includes('door') || pTitle.includes('mirror');
    } else if (catLower === 'electrical-parts' || catLower === 'cat-electrical' || catLower === 'lighting_electrical' || catLower === 'electrical parts') {
      catMatch = pCat.includes('electric') || pCat.includes('lighting') || pSub.includes('electric') || pSub.includes('light') || pTitle.includes('light') || pTitle.includes('headlight') || pTitle.includes('battery') || pTitle.includes('switch');
    } else if (catLower === 'oils-fluids' || catLower === 'lubricants') {
      catMatch = pCat.includes('oil') || pCat.includes('fluid') || pSub.includes('oil') || pTitle.includes('oil') || pTitle.includes('fluid') || pTitle.includes('coolant');
    } else if (catLower === 'ac-parts' || catLower === 'cat-ac' || catLower === 'air-conditioning' || catLower === 'ac parts') {
      catMatch = pCat.includes('ac') || pCat.includes('air-condition') || pSub.includes('ac') || pTitle.includes('ac') || pTitle.includes('compressor') || pTitle.includes('condenser') || pTitle.includes('cooling coil');
    } else if (catLower === 'clutch-parts' || catLower === 'cat-clutch' || catLower === 'clutch parts') {
      catMatch = pCat.includes('clutch') || pSub.includes('clutch') || pTitle.includes('clutch') || pTitle.includes('friction disc') || pTitle.includes('pressure plate');
    } else if (catLower === 'suspension-parts' || catLower === 'cat-suspension' || catLower === 'suspension parts') {
      catMatch = pCat.includes('suspension') || pSub.includes('suspension') || pTitle.includes('shock') || pTitle.includes('strut') || pTitle.includes('arm') || pTitle.includes('bushing');
    } else if (catLower === 'transmission-parts' || catLower === 'cat-transmission' || catLower === 'transmission parts') {
      catMatch = pCat.includes('transmission') || pSub.includes('transmission') || pTitle.includes('gear') || pTitle.includes('cv axle') || pTitle.includes('drive shaft');
    } else if (catLower === 'steering-parts' || catLower === 'cat-steering' || catLower === 'steering parts') {
      catMatch = pCat.includes('steering') || pSub.includes('steering') || pTitle.includes('steering') || pTitle.includes('tie rod') || pTitle.includes('rack end');
    } else if (catLower === 'cooling-system' || catLower === 'cat-cooling' || catLower === 'cooling system') {
      catMatch = pCat.includes('cool') || pSub.includes('cool') || pTitle.includes('radiator') || pTitle.includes('water pump') || pTitle.includes('thermostat');
    } else if (catLower === 'fuel-system' || catLower === 'cat-fuel' || catLower === 'fuel system') {
      catMatch = pCat.includes('fuel') || pSub.includes('fuel') || pTitle.includes('fuel pump') || pTitle.includes('injector');
    } else if (catLower === 'interior-parts' || catLower === 'cat-interior' || catLower === 'accessories' || catLower === 'cat-accessories' || catLower === 'interior parts') {
      catMatch = pCat.includes('interior') || pCat.includes('accessori') || pSub.includes('accessori') || pTitle.includes('holder') || pTitle.includes('mat') || pTitle.includes('cover') || pTitle.includes('seat');
    } else {
      catMatch = pCat.includes(catLower) || pSub.includes(catLower) || pTitle.includes(catLower);
    }

    if (!catMatch) return false;
  }

  // 6. SUB-CATEGORY MATCHING
  if (activeSubCategory && activeSubCategory !== 'all') {
    const subLower = activeSubCategory.toLowerCase().trim();
    const pSub = (product.subCategory || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    const subMatch = pSub.includes(subLower) || pTitle.includes(subLower);
    if (!subMatch) return false;
  }

  return true;
};

