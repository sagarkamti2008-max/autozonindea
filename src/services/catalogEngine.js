import { checkProductCompatibility } from './fitmentEngine';
import { MASTER_CATEGORIES_DATA } from '../data/categoryMasterData';

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
  const result = checkProductCompatibility(product, selectedVehicle);
  return {
    compatible: result.status === 'COMPATIBLE' || result.status === 'NO_VEHICLE_SELECTED',
    isCompatible: result.status === 'COMPATIBLE',
    status: result.reason,
    badge: result.badgeText,
    isVerified: result.status === 'COMPATIBLE'
  };
};

export const filterCatalogByVehicleFitment = (products, selectedVehicle) => {
  if (!selectedVehicle) return products;
  return products.filter(p => {
    const check = checkVehicleProductCompatibility(p, selectedVehicle);
    return check.compatible || check.isCompatible;
  });
};

/**
 * System 4 - Advanced Product & Category Filter Engine
 * Evaluates VEHICLE + CATEGORY + SUBCATEGORY + PART TYPE + PRICE + BRAND + STOCK + CLASSIFICATION
 */
export const isProductMatchingVehicleAndCategory = (
  product,
  activeBrand = 'all',
  activeModel = 'all',
  activeCategory = 'all',
  activeSubCategory = 'all',
  activeVariant = '',
  activeYear = '',
  activePartType = 'all',
  activeEngine = '',
  activeFuelType = '',
  options = {}
) => {
  if (!product) return false;

  const {
    minPrice = 0,
    maxPrice = Infinity,
    availability = 'in_stock', // 'in_stock' | 'out_of_stock' | 'on_order' | 'all'
    classification = 'all', // 'OEM' | 'Aftermarket' | 'Genuine' | 'Equivalent' | 'all'
    productType = 'all', // 'vehicle_specific' | 'universal' | 'all'
    selectedVehicle = null,
    searchQuery = ''
  } = options;

  // 0. Active Status Check
  if (
    product.isActive === false || 
    product.status === 'inactive' || 
    product.activeStatus === 'inactive' || 
    product.statusText === 'Inactive'
  ) {
    return false;
  }

  // 1. Price Filtering
  const price = Number(product.sellingPrice || product.price || 0);
  if (price < minPrice || price > maxPrice) {
    return false;
  }

  // 2. Stock & Availability Filtering
  const stock = Number(product.stock !== undefined ? product.stock : (product.stockCount || 10));
  const isOutOfStock = stock <= 0 || product.inStock === false || product.status === 'out_of_stock';
  
  if (availability === 'in_stock' && isOutOfStock) {
    return false;
  } else if (availability === 'out_of_stock' && !isOutOfStock) {
    return false;
  } else if (availability === 'on_order' && product.status !== 'available_on_order' && product.isAvailableOnOrder !== true) {
    return false;
  }

  // 3. Product Classification (OEM, Aftermarket, Genuine, Equivalent)
  if (classification !== 'all') {
    const prodClass = (product.classification || product.productClassification || product.type || '').toLowerCase().trim();
    if (prodClass && prodClass !== classification.toLowerCase().trim()) {
      return false;
    }
  }

  // 4. Product Type (Vehicle Specific vs Universal)
  const isUniversalProd = product.isUniversal === true || 
                           product.is_universal === true || 
                           product.productType === 'universal' ||
                           product.brand === 'Universal';

  if (productType === 'vehicle_specific' && isUniversalProd) {
    return false;
  } else if (productType === 'universal' && !isUniversalProd) {
    return false;
  }

  // 5. Vehicle Fitment Check (If vehicle or make/model active)
  const vehicleObj = selectedVehicle || (activeBrand !== 'all' && activeModel !== 'all' ? {
    makeName: activeBrand,
    modelName: activeModel,
    year: activeYear,
    variant: activeVariant,
    engine: activeEngine,
    fuelType: activeFuelType
  } : null);

  if (vehicleObj && !isUniversalProd) {
    const check = checkProductCompatibility(product, vehicleObj);
    if (check.status !== 'COMPATIBLE') {
      return false;
    }
  }

  // 6. Category Matching (29 Main Categories Taxonomy)
  if (activeCategory && activeCategory !== 'all') {
    const catQuery = activeCategory.toLowerCase().trim();
    const pCat = (product.category || product.categoryId || product.categorySlug || '').toLowerCase().trim();
    const pSub = (product.subCategory || product.subcategoryId || product.subcategorySlug || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    // Map Master Categories
    const masterCat = MASTER_CATEGORIES_DATA.find(c => 
      c.id.toLowerCase() === catQuery ||
      c.slug.toLowerCase() === catQuery ||
      c.name.toLowerCase() === catQuery ||
      catQuery.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(catQuery)
    );

    const mainCatName = masterCat ? masterCat.name.toLowerCase() : catQuery;

    let catMatched = false;

    // Strict Category Rules: No Brake Parts inside Engine, No Engine Parts inside Brakes
    if (mainCatName.includes('engine') && !mainCatName.includes('cooling')) {
      const isBrake = pCat.includes('brake') || pSub.includes('brake') || pTitle.includes('brake') || pTitle.includes('disc') || pTitle.includes('pad');
      const isAC = pCat.includes('ac') || pSub.includes('ac') || pTitle.includes('ac compressor');
      if (isBrake || isAC) return false;

      catMatched = pCat.includes('engine') || pSub.includes('engine') || pTitle.includes('engine') ||
                 pTitle.includes('piston') || pTitle.includes('gasket') || pTitle.includes('crankshaft') ||
                 pTitle.includes('camshaft') || pTitle.includes('cylinder') || pTitle.includes('valve');
    } else if (mainCatName.includes('brake')) {
      const isEngine = (pCat.includes('engine') || pSub.includes('engine')) && !pTitle.includes('vacuum booster');
      if (isEngine) return false;

      catMatched = pCat.includes('brake') || pSub.includes('brake') || pTitle.includes('brake') ||
                 pTitle.includes('pad') || pTitle.includes('disc') || pTitle.includes('rotor') || pTitle.includes('caliper');
    } else if (mainCatName.includes('filter')) {
      catMatched = pCat.includes('filter') || pSub.includes('filter') || pTitle.includes('filter');
    } else if (mainCatName.includes('cooling')) {
      catMatched = pCat.includes('cool') || pSub.includes('cool') || pTitle.includes('radiator') || pTitle.includes('thermostat') || pTitle.includes('water pump');
    } else if (mainCatName.includes('oil') || mainCatName.includes('fluid') || mainCatName.includes('lubricant')) {
      catMatched = pCat.includes('oil') || pCat.includes('fluid') || pCat.includes('lubricant') || pSub.includes('oil') || pSub.includes('fluid') || pTitle.includes('synthetic') || pTitle.includes('engine oil') || pTitle.includes('brake fluid') || pTitle.includes('coolant');
    } else {
      catMatched = pCat.includes(mainCatName) || 
                 pSub.includes(mainCatName) || 
                 pTitle.includes(mainCatName) ||
                 (masterCat && masterCat.subcategories.some(s => pSub.includes(s.name.toLowerCase()) || pTitle.includes(s.name.toLowerCase())));
    }

    if (!catMatched) return false;
  }

  // 7. Subcategory Matching
  if (activeSubCategory && activeSubCategory !== 'all') {
    const subQuery = activeSubCategory.toLowerCase().trim();
    const pSub = (product.subCategory || product.subcategoryId || product.subcategorySlug || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    const subMatched = pSub.includes(subQuery) || pTitle.includes(subQuery) || subQuery.includes(pSub);
    if (!subMatched) return false;
  }

  // 8. Part Type Matching
  if (activePartType && activePartType !== 'all') {
    const partTypeQuery = activePartType.toLowerCase().trim();
    const pPartType = (product.partType || product.partTypeId || '').toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();

    const partTypeMatched = pPartType.includes(partTypeQuery) || pTitle.includes(partTypeQuery);
    if (!partTypeMatched) return false;
  }

  // 9. Brand Filter
  if (activeBrand && activeBrand !== 'all') {
    const brandQuery = activeBrand.toLowerCase().trim();
    const pBrand = (product.brand || product.manufacturer || '').toLowerCase().trim();
    if (pBrand && !pBrand.includes(brandQuery) && !brandQuery.includes(pBrand)) {
      return false;
    }
  }

  // 10. Search Query Filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const pTitle = (product.title || product.name || '').toLowerCase();
    const pOem = (product.oemPartNumber || product.oem || '').toLowerCase();
    const pSku = (product.sku || '').toLowerCase();
    const pBrand = (product.brand || '').toLowerCase();

    const searchMatch = pTitle.includes(q) || pOem.includes(q) || pSku.includes(q) || pBrand.includes(q);
    if (!searchMatch) return false;
  }

  return true;
};
