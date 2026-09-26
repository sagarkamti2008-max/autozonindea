// Automotive Vehicle Fitment & Compatibility Engine for AutoZonIndia

export const checkVehicleProductCompatibility = (product, selectedVehicle) => {
  if (!product) {
    return { compatible: false, status: 'Invalid Product', badge: '✕ Incompatible' };
  }

  if (!selectedVehicle) {
    return { compatible: true, status: 'No Vehicle Selected', badge: '⚠ Select Vehicle' };
  }

  if (product.isUniversal || product.is_universal) {
    return { compatible: true, status: 'Universal Fitment', badge: '✓ Universal Fit' };
  }

  const targetMake = (selectedVehicle.makeName || selectedVehicle.makeId || '').toLowerCase();
  const targetModel = (selectedVehicle.modelName || selectedVehicle.modelId || '').toLowerCase();

  // 1. Check fitments array (primary schema used by AdminCatalogManager)
  if (Array.isArray(product.fitments) && product.fitments.length > 0) {
    const hasFitmentMatch = product.fitments.some(f => {
      if (!f) return false;
      const fitMake = (f.make || f.makeName || '').toLowerCase();
      const fitModel = (f.model || f.modelName || '').toLowerCase();
      if (!fitMake && !fitModel) return true;
      return (fitMake.includes(targetMake) || targetMake.includes(fitMake)) &&
             (fitModel.includes(targetModel) || targetModel.includes(fitModel));
    });
    if (hasFitmentMatch) {
      return { compatible: true, status: 'Verified Fitment', badge: '✓ Verified Compatible' };
    }
  }

  // 2. Check compatibleVehicles array
  if (Array.isArray(product.compatibleVehicles) && product.compatibleVehicles.length > 0) {
    const isMatch = product.compatibleVehicles.some(v => {
      if (typeof v === 'string') {
        const vLower = v.toLowerCase();
        return vLower.includes(targetModel) || vLower.includes(targetMake);
      }
      const vMake = (v.makeName || v.makeId || '').toLowerCase();
      const vModel = (v.modelName || v.modelId || '').toLowerCase();
      return (vMake.includes(targetMake) || targetMake.includes(vMake)) &&
             (vModel.includes(targetModel) || targetModel.includes(vModel));
    });
    if (isMatch) {
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

export const isProductMatchingVehicleAndCategory = (product, activeBrand, activeModel, activeCategory, activeSubCategory) => {
  if (!product || product.isActive === false) return false;

  // 1. BRAND MATCHING
  if (activeBrand && activeBrand !== 'all') {
    const brandSlug = activeBrand.toLowerCase().trim();
    const pBrand = (product.carBrand || product.brand || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();
    const pDesc = (product.description || product.desc || '').toLowerCase();
    const pCompat = (product.compatibleVehicles || []).map(v => typeof v === 'string' ? v.toLowerCase() : '');

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
    const pCompat = (product.compatibleVehicles || []).map(v => typeof v === 'string' ? v.toLowerCase() : '');
    const pFitments = (product.fitments || []).map(f => (f.model || f.modelName || '').toLowerCase());

    let modelMatch = false;

    if (pModelId && (pModelId === modelClean || pModelId === `toyota-${modelClean}` || pModelId.replace(/_/g, '-') === modelClean.replace(/_/g, '-'))) {
      modelMatch = true;
    }

    if (!modelMatch && pCarModel && pCarModel === modelClean) {
      modelMatch = true;
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

  // 3. CATEGORY MATCHING (14 Master Parts Categories)
  if (activeCategory && activeCategory !== 'all') {
    const catLower = activeCategory.toLowerCase().trim();
    const pCat = (product.category || product.categorySlug || '').toLowerCase().trim();
    const pSub = (product.subCategory || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    let catMatch = false;

    if (catLower === 'engine-parts' || catLower === 'cat-engine' || catLower === 'engine_parts') {
      catMatch = pCat.includes('engine') || pSub.includes('engine') || pTitle.includes('engine') || pTitle.includes('spark') || pTitle.includes('clutch') || pTitle.includes('piston') || pTitle.includes('gasket');
    } else if (catLower === 'brake-parts' || catLower === 'cat-brakes' || catLower === 'braking_system') {
      catMatch = pCat.includes('brake') || pCat.includes('suspension') || pSub.includes('brake') || pSub.includes('shock') || pTitle.includes('brake') || pTitle.includes('pad') || pTitle.includes('disc') || pTitle.includes('absorber');
    } else if (catLower === 'filters' || catLower === 'cat-filters' || catLower === 'filters_oils') {
      catMatch = pCat.includes('filter') || pSub.includes('filter') || pTitle.includes('filter');
    } else if (catLower === 'body-parts' || catLower === 'cat-body' || catLower === 'body-bumper') {
      catMatch = pCat.includes('body') || pCat.includes('bumper') || pSub.includes('bumper') || pTitle.includes('bumper') || pTitle.includes('fender') || pTitle.includes('door') || pTitle.includes('mirror');
    } else if (catLower === 'electrical-parts' || catLower === 'cat-electrical' || catLower === 'lighting_electrical') {
      catMatch = pCat.includes('electric') || pCat.includes('lighting') || pSub.includes('electric') || pSub.includes('light') || pTitle.includes('light') || pTitle.includes('headlight') || pTitle.includes('battery') || pTitle.includes('switch');
    } else if (catLower === 'oils-fluids' || catLower === 'lubricants') {
      catMatch = pCat.includes('oil') || pCat.includes('fluid') || pSub.includes('oil') || pTitle.includes('oil') || pTitle.includes('fluid') || pTitle.includes('coolant');
    } else if (catLower === 'ac-parts' || catLower === 'cat-ac' || catLower === 'air-conditioning') {
      catMatch = pCat.includes('ac') || pCat.includes('air-condition') || pSub.includes('ac') || pTitle.includes('ac') || pTitle.includes('compressor') || pTitle.includes('condenser') || pTitle.includes('cooling coil');
    } else if (catLower === 'clutch-parts' || catLower === 'cat-clutch') {
      catMatch = pCat.includes('clutch') || pSub.includes('clutch') || pTitle.includes('clutch') || pTitle.includes('friction disc') || pTitle.includes('pressure plate');
    } else if (catLower === 'suspension-parts' || catLower === 'cat-suspension') {
      catMatch = pCat.includes('suspension') || pSub.includes('suspension') || pTitle.includes('shock') || pTitle.includes('strut') || pTitle.includes('arm') || pTitle.includes('bushing');
    } else if (catLower === 'transmission-parts' || catLower === 'cat-transmission') {
      catMatch = pCat.includes('transmission') || pSub.includes('transmission') || pTitle.includes('gear') || pTitle.includes('cv axle') || pTitle.includes('drive shaft');
    } else if (catLower === 'steering-parts' || catLower === 'cat-steering') {
      catMatch = pCat.includes('steering') || pSub.includes('steering') || pTitle.includes('steering') || pTitle.includes('tie rod') || pTitle.includes('rack end');
    } else if (catLower === 'cooling-system' || catLower === 'cat-cooling') {
      catMatch = pCat.includes('cool') || pSub.includes('cool') || pTitle.includes('radiator') || pTitle.includes('water pump') || pTitle.includes('thermostat');
    } else if (catLower === 'fuel-system' || catLower === 'cat-fuel') {
      catMatch = pCat.includes('fuel') || pSub.includes('fuel') || pTitle.includes('fuel pump') || pTitle.includes('injector');
    } else if (catLower === 'interior-parts' || catLower === 'cat-interior' || catLower === 'accessories' || catLower === 'cat-accessories') {
      catMatch = pCat.includes('interior') || pCat.includes('accessori') || pSub.includes('accessori') || pTitle.includes('holder') || pTitle.includes('mat') || pTitle.includes('cover') || pTitle.includes('seat');
    } else {
      catMatch = pCat.includes(catLower) || pSub.includes(catLower) || pTitle.includes(catLower);
    }

    if (!catMatch) return false;
  }

  // 4. SUB-CATEGORY MATCHING
  if (activeSubCategory && activeSubCategory !== 'all') {
    const subLower = activeSubCategory.toLowerCase().trim();
    const pSub = (product.subCategory || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    const subMatch = pSub.includes(subLower) || pTitle.includes(subLower);
    if (!subMatch) return false;
  }

  return true;
};
