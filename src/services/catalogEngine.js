// Automotive Vehicle Fitment & Compatibility Engine for AutoZonIndia

export const checkVehicleProductCompatibility = (product, selectedVehicle) => {
  if (!product) {
    return { compatible: false, status: 'Invalid Product', badge: '✕ Incompatible' };
  }

  if (product.isActive === false || product.status === 'inactive' || product.activeStatus === 'inactive') {
    return { compatible: false, status: 'Inactive Product', badge: '✕ Inactive' };
  }

  if (!selectedVehicle) {
    return { compatible: true, status: 'No Vehicle Selected', badge: '⚠ Select Vehicle' };
  }

  if (product.isUniversal || product.is_universal) {
    return { compatible: true, status: 'Universal Fitment', badge: '✓ Universal Fit' };
  }

  const targetMake = (selectedVehicle.makeName || selectedVehicle.makeId || '').toLowerCase().trim();
  const targetModel = (selectedVehicle.modelName || selectedVehicle.modelId || '').toLowerCase().trim();
  const targetVariant = (selectedVehicle.variant || '').toLowerCase().trim();
  const targetYear = selectedVehicle.year ? parseInt(selectedVehicle.year, 10) : null;

  // 1. Check compatibleVehicles array (New Primary Schema)
  if (Array.isArray(product.compatibleVehicles) && product.compatibleVehicles.length > 0) {
    const isMatch = product.compatibleVehicles.some(v => {
      if (!v) return false;
      if (typeof v === 'string') {
        const vLower = v.toLowerCase();
        return vLower.includes(targetModel) || vLower.includes(targetMake);
      }
      const vMake = (v.make || v.makeName || v.brand || '').toLowerCase().trim();
      const vModel = (v.model || v.modelName || '').toLowerCase().trim();
      const vVariant = (v.variant || '').toLowerCase().trim();
      const vStart = v.yearStart ? parseInt(v.yearStart, 10) : (v.yearFrom ? parseInt(v.yearFrom, 10) : null);
      const vEnd = v.yearEnd ? parseInt(v.yearEnd, 10) : (v.yearTo ? parseInt(v.yearTo, 10) : null);

      const makeOk = !vMake || vMake.includes(targetMake) || targetMake.includes(vMake);
      const modelOk = !vModel || vModel.includes(targetModel) || targetModel.includes(vModel);
      const variantOk = !targetVariant || !vVariant || vVariant.includes(targetVariant) || targetVariant.includes(vVariant);
      let yearOk = true;
      if (targetYear && vStart && vEnd) {
        yearOk = targetYear >= vStart && targetYear <= vEnd;
      }

      return makeOk && modelOk && variantOk && yearOk;
    });
    if (isMatch) {
      return { compatible: true, status: 'Verified Fitment', badge: '✓ Verified Compatible' };
    }
  }

  // 2. Check fitments array
  if (Array.isArray(product.fitments) && product.fitments.length > 0) {
    const hasFitmentMatch = product.fitments.some(f => {
      if (!f) return false;
      const fitMake = (f.make || f.makeName || '').toLowerCase();
      const fitModel = (f.model || f.modelName || '').toLowerCase();
      const fitVariant = (f.variant || '').toLowerCase();
      const fitFrom = f.yearFrom ? parseInt(f.yearFrom, 10) : null;
      const fitTo = f.yearTo ? parseInt(f.yearTo, 10) : null;

      const makeOk = !fitMake || fitMake.includes(targetMake) || targetMake.includes(fitMake);
      const modelOk = !fitModel || fitModel.includes(targetModel) || targetModel.includes(fitModel);
      const variantOk = !targetVariant || !fitVariant || fitVariant.includes(targetVariant) || targetVariant.includes(fitVariant);
      let yearOk = true;
      if (targetYear && fitFrom && fitTo) {
        yearOk = targetYear >= fitFrom && targetYear <= fitTo;
      }

      return makeOk && modelOk && variantOk && yearOk;
    });
    if (hasFitmentMatch) {
      return { compatible: true, status: 'Verified Fitment', badge: '✓ Verified Compatible' };
    }
  }

  // 3. Check product_compatibility array
  if (Array.isArray(product.product_compatibility) && product.product_compatibility.length > 0) {
    const hasCompatMatch = product.product_compatibility.some(c => {
      const notes = (c.notes || '').toLowerCase();
      return notes.includes(targetMake) || notes.includes(targetModel);
    });
    if (hasCompatMatch) {
      return { compatible: true, status: 'Verified Fitment', badge: '✓ Verified Compatible' };
    }
  }

  // 4. Fallback: If no vehicle constraints are specified, consider it generally compatible
  const hasAnyFitmentData = (product.fitments && product.fitments.length > 0) ||
                            (product.compatibleVehicles && product.compatibleVehicles.length > 0) ||
                            (product.product_compatibility && product.product_compatibility.length > 0);
  if (!hasAnyFitmentData) {
    return { compatible: true, status: 'General Fitment', badge: '✓ Compatible' };
  }

  return { compatible: false, status: 'Not Verified', badge: '⚠ Needs Verification' };
};

export const filterCatalogByVehicleFitment = (products, selectedVehicle) => {
  if (!selectedVehicle) return products;
  return products.filter(p => {
    const check = checkVehicleProductCompatibility(p, selectedVehicle);
    return check.compatible;
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

    if (!brandMatch && !product.isUniversal && product.brand !== 'Universal') {
      return false;
    }
  }

  // 2. STRICT EXACT MODEL MATCHING
  if (activeModel && activeModel !== 'all') {
    const modelClean = activeModel.toLowerCase().trim();
    const pModelId = (product.modelId || product.vehicleId || '').toLowerCase().trim();
    const pCarModel = (product.carModel || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();
    const pDesc = (product.description || product.desc || '').toLowerCase();
    const pCompat = (product.compatibleVehicles || []).map(v => typeof v === 'string' ? v.toLowerCase() : JSON.stringify(v).toLowerCase());
    const pFitments = (product.fitments || []).map(f => `${f.make || ''} ${f.model || ''} ${f.variant || ''}`.toLowerCase());

    let modelMatch = false;

    // Direct ID match
    if (pModelId && (pModelId === modelClean || pModelId === `toyota-${modelClean}` || pModelId.replace(/_/g, '-') === modelClean.replace(/_/g, '-'))) {
      modelMatch = true;
    }

    if (!modelMatch && pCarModel && pCarModel === modelClean) {
      modelMatch = true;
    }

    // Check compatibleVehicles structured items
    if (!modelMatch && Array.isArray(product.compatibleVehicles)) {
      modelMatch = product.compatibleVehicles.some(v => {
        if (!v) return false;
        if (typeof v === 'string') return v.toLowerCase().includes(modelClean);
        const m = (v.model || v.modelName || '').toLowerCase();
        return m === modelClean || m.includes(modelClean);
      });
    }

    // Sub-models strict disambiguation table
    const subModels = [
      { name: 'innova crysta', sub: 'crysta' },
      { name: 'innova hycross', sub: 'hycross' },
      { name: 'etios liva', sub: 'liva' },
      { name: 'corolla altis', sub: 'altis' },
      { name: 'landcruiser prado', sub: 'prado' },
      { name: 'thar roxx', sub: 'roxx' },
      { name: 'scorpio-n', sub: 'scorpio-n' },
      { name: 'scorpio classic', sub: 'classic' },
      { name: 'xuv3xo', sub: '3xo' },
      { name: 'bolero neo', sub: 'neo' },
      { name: 'nexon ev', sub: 'nexon ev' },
      { name: 'punch ev', sub: 'punch ev' },
      { name: 'tiago ev', sub: 'tiago ev' },
      { name: 'tigor ev', sub: 'tigor ev' },
      { name: 'curvv ev', sub: 'curvv ev' },
      { name: 'grand vitara', sub: 'vitara' },
      { name: 'alto k10', sub: 'k10' },
      { name: 'alto 800', sub: '800' },
      { name: 'elite i20', sub: 'elite' },
      { name: 'grand i10', sub: 'grand' }
    ];

    if (!modelMatch) {
      const isSelectedSubModel = subModels.find(m => modelClean.includes(m.sub) || modelClean === m.name);

      if (isSelectedSubModel) {
        const sub = isSelectedSubModel.sub;
        modelMatch = pTitle.includes(sub) ||
                     pDesc.includes(sub) ||
                     pCarModel.includes(sub) ||
                     pCompat.some(v => v.includes(sub)) ||
                     pFitments.some(f => f.includes(sub));
      } else {
        if (modelClean.includes('innova')) {
          const hasInnova = pTitle.includes('innova') || pCarModel.includes('innova') || pCompat.some(v => v.includes('innova')) || pFitments.some(f => f.includes('innova'));
          const hasCrystaOrHycross = pTitle.includes('crysta') || pTitle.includes('hycross') || pCarModel.includes('crysta') || pCarModel.includes('hycross') || pCompat.some(v => v.includes('crysta') || v.includes('hycross'));
          modelMatch = hasInnova && !hasCrystaOrHycross;
        } else if (modelClean.includes('etios')) {
          const hasEtios = pTitle.includes('etios') || pCarModel.includes('etios') || pCompat.some(v => v.includes('etios'));
          const hasLiva = pTitle.includes('liva') || pCarModel.includes('liva') || pCompat.some(v => v.includes('liva'));
          modelMatch = hasEtios && !hasLiva;
        } else if (modelClean.includes('corolla')) {
          const hasCorolla = pTitle.includes('corolla') || pCarModel.includes('corolla') || pCompat.some(v => v.includes('corolla'));
          const hasAltis = pTitle.includes('altis') || pCarModel.includes('altis') || pCompat.some(v => v.includes('altis'));
          modelMatch = hasCorolla && !hasAltis;
        } else if (modelClean.includes('scorpio')) {
          const hasScorpio = pTitle.includes('scorpio') || pCarModel.includes('scorpio') || pCompat.some(v => v.includes('scorpio'));
          const hasScorpioN = pTitle.includes('scorpio-n') || pTitle.includes('classic') || pCarModel.includes('scorpio-n') || pCarModel.includes('classic');
          modelMatch = hasScorpio && !hasScorpioN;
        } else {
          const mainWord = modelClean.split(' ')[0];
          modelMatch = pTitle.includes(mainWord) ||
                       pCarModel.includes(mainWord) ||
                       pCompat.some(v => v.includes(mainWord)) ||
                       pFitments.some(f => f.includes(mainWord));
        }
      }
    }

    if (!modelMatch && !product.isUniversal && product.brand !== 'Universal') {
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

