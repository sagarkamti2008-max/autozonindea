/**
 * fitmentEngine.js
 * Kamti Automotive — Advanced Vehicle Compatibility & Part Fitment Engine
 * 
 * CORE RULE:
 * CUSTOMER VEHICLE + PRODUCT COMPATIBILITY DATA = COMPATIBILITY RESULT
 * NEVER: PRODUCT NAME = COMPATIBILITY
 */

export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Petrol Hybrid',
  'Diesel Hybrid',
  'Electric',
  'CNG',
  'LPG',
  'Not specified'
];

export const TRANSMISSIONS = [
  'Manual',
  'Automatic',
  'CVT',
  'DCT / DSG',
  'AMT',
  'Not specified'
];

/**
 * Validates a single compatibility record to ensure logical correctness.
 * Returns error string if invalid, or null if valid.
 */
export function validateCompatibilityRecord(record) {
  if (!record) return 'Compatibility record is empty.';
  if (!record.brand && !record.make) return 'Vehicle Brand is required.';
  if (!record.model) return 'Vehicle Model is required.';
  
  const yearFrom = parseInt(record.yearFrom, 10);
  const yearTo = parseInt(record.yearTo, 10);

  if (!isNaN(yearFrom) && !isNaN(yearTo)) {
    if (yearFrom > yearTo) {
      return `Invalid Year Range: Year From (${yearFrom}) cannot be greater than Year To (${yearTo}).`;
    }
  }
  return null;
}

/**
 * Compatibility Matching Function
 * 
 * Input:
 * - product: Product object
 * - selectedVehicle: Customer selected vehicle object
 * - selectedCategory: Selected category ID or Name (optional)
 * 
 * Output:
 * - status: 'COMPATIBLE' | 'NOT_COMPATIBLE' | 'COMPATIBILITY_NOT_VERIFIED' | 'NO_VEHICLE_SELECTED'
 * - badgeText: String
 * - badgeColor: Tailwind class string
 * - reason: String explanation
 */
export function checkProductCompatibility(product, selectedVehicle, selectedCategory = 'all') {
  if (!product) {
    return {
      status: 'NOT_COMPATIBLE',
      badgeText: '✕ Not Compatible',
      badgeColor: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
      reason: 'Invalid product object'
    };
  }

  // Rule 1: Universal Product Check
  if (product.isUniversal === true) {
    return {
      status: 'COMPATIBLE',
      badgeText: '✓ Universal Fit (All Vehicles)',
      badgeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-extrabold',
      reason: 'Product explicitly verified as Universal Fit by Admin'
    };
  }

  // Rule 2: Category Filter Check (if provided)
  if (selectedCategory && selectedCategory !== 'all') {
    const prodCat = (product.category || '').toLowerCase().trim();
    const filterCat = selectedCategory.toLowerCase().trim();
    if (prodCat !== filterCat && prodCat !== 'universal') {
      return {
        status: 'NOT_COMPATIBLE',
        badgeText: '✕ Category Mismatch',
        badgeColor: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
        reason: `Product category '${product.category}' does not match requested category '${selectedCategory}'`
      };
    }
  }

  // Rule 3: Check Product Status / Compatibility Verification Status
  if (
    product.status === 'Compatibility Pending' ||
    product.status === 'Draft' ||
    product.compatibilityStatus === 'Pending Verification' ||
    product.compatibilityStatus === 'Incomplete'
  ) {
    return {
      status: 'COMPATIBILITY_NOT_VERIFIED',
      badgeText: '⚠ Compatibility Not Verified',
      badgeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-extrabold',
      reason: 'Compatibility information for this product is incomplete or pending verification by Admin.'
    };
  }

  // Rule 4: Check if Vehicle is Selected
  if (!selectedVehicle || (!selectedVehicle.make && !selectedVehicle.brand)) {
    return {
      status: 'NO_VEHICLE_SELECTED',
      badgeText: 'Select your vehicle to check compatibility',
      badgeColor: 'bg-blue-500/15 border-blue-500/40 text-blue-400 font-extrabold',
      reason: 'No customer vehicle selected.'
    };
  }

  // Extract customer vehicle attributes
  const selBrand = (selectedVehicle.brand || selectedVehicle.make || selectedVehicle.makeName || '').toLowerCase().trim();
  const selModel = (selectedVehicle.model || selectedVehicle.modelName || '').toLowerCase().trim();
  const selYear = selectedVehicle.year ? parseInt(selectedVehicle.year, 10) : null;
  const selGen = (selectedVehicle.generation || '').toLowerCase().trim();
  const selVariant = (selectedVehicle.variant || '').toLowerCase().trim();
  const selEngine = (selectedVehicle.engine || '').toLowerCase().trim();
  const selFuel = (selectedVehicle.fuelType || selectedVehicle.fuel || '').toLowerCase().trim();
  const selTrans = (selectedVehicle.transmission || '').toLowerCase().trim();

  // Retrieve compatibility records array
  const compatRecords = product.compatibility || product.fitments || product.compatibleVehicles || [];

  if (!Array.isArray(compatRecords) || compatRecords.length === 0) {
    return {
      status: 'COMPATIBILITY_NOT_VERIFIED',
      badgeText: '⚠ Compatibility Not Verified',
      badgeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-extrabold',
      reason: 'No structured compatibility records exist for this product.'
    };
  }

  // Strict Evaluation of Compatibility Records
  const isCompatible = compatRecords.some(record => {
    // String fallback for legacy records (e.g. "Toyota Camry 2018-2022")
    if (typeof record === 'string') {
      const recLower = record.toLowerCase();
      if (selBrand && !recLower.includes(selBrand)) return false;
      if (selModel && !recLower.includes(selModel)) return false;
      if (selYear && !recLower.includes(selYear.toString())) return false;
      return true;
    }

    const rBrand = (record.brand || record.make || record.vehicleBrand || '').toLowerCase().trim();
    const rModel = (record.model || record.vehicleModel || '').toLowerCase().trim();

    // 1. Brand Match (Priority 1)
    if (rBrand && rBrand !== 'all' && rBrand !== 'universal') {
      if (rBrand !== selBrand && !selBrand.includes(rBrand) && !rBrand.includes(selBrand)) {
        return false;
      }
    }

    // 2. Model Match (Priority 2)
    if (rModel && rModel !== 'all' && rModel !== 'universal') {
      if (rModel !== selModel && !selModel.includes(rModel) && !rModel.includes(selModel)) {
        return false;
      }
    }

    // 3. Year Match (Priority 3)
    if (selYear !== null) {
      const yearFrom = record.yearFrom !== undefined && record.yearFrom !== null && record.yearFrom !== '' 
        ? parseInt(record.yearFrom, 10) 
        : (record.year ? parseInt(record.year, 10) : null);

      const yearTo = record.yearTo !== undefined && record.yearTo !== null && record.yearTo !== ''
        ? parseInt(record.yearTo, 10)
        : yearFrom;

      if (yearFrom !== null && !isNaN(yearFrom)) {
        if (selYear < yearFrom) return false;
      }

      if (yearTo !== null && !isNaN(yearTo)) {
        if (selYear > yearTo) return false;
      }
    }

    // 4. Generation Match (Priority 4)
    const rGen = (record.generation || '').toLowerCase().trim();
    if (rGen && rGen !== 'all' && rGen !== 'not specified' && selGen && selGen !== 'not specified') {
      if (rGen !== selGen && !selGen.includes(rGen) && !rGen.includes(selGen)) {
        return false;
      }
    }

    // 5. Variant Match (Priority 5)
    const rVariant = (record.variant || '').toLowerCase().trim();
    if (rVariant && rVariant !== 'all' && rVariant !== 'not specified' && selVariant && selVariant !== 'not specified') {
      if (rVariant !== selVariant && !selVariant.includes(rVariant) && !rVariant.includes(selVariant)) {
        return false;
      }
    }

    // 6. Engine Match (Priority 6)
    const rEngine = (record.engine || '').toLowerCase().trim();
    if (rEngine && rEngine !== 'all' && rEngine !== 'not specified' && selEngine && selEngine !== 'not specified') {
      if (rEngine !== selEngine && !selEngine.includes(rEngine) && !rEngine.includes(selEngine)) {
        return false;
      }
    }

    // 7. Fuel Type Match (Priority 7)
    const rFuel = (record.fuelType || record.fuel || '').toLowerCase().trim();
    if (rFuel && rFuel !== 'all' && rFuel !== 'not specified' && selFuel && selFuel !== 'not specified') {
      if (rFuel !== selFuel) return false;
    }

    // 8. Transmission Match (Priority 8)
    const rTrans = (record.transmission || '').toLowerCase().trim();
    if (rTrans && rTrans !== 'all' && rTrans !== 'not specified' && selTrans && selTrans !== 'not specified') {
      if (rTrans !== selTrans) return false;
    }

    return true;
  });

  if (isCompatible) {
    return {
      status: 'COMPATIBLE',
      badgeText: '✓ Compatible with your vehicle',
      badgeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-extrabold',
      reason: `Verified fit for ${selectedVehicle.brand || selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year || ''}`
    };
  }

  return {
    status: 'NOT_COMPATIBLE',
    badgeText: '✕ Not compatible with your vehicle',
    badgeColor: 'bg-rose-500/15 border-rose-500/40 text-rose-400 font-extrabold',
    reason: `Product does not fit ${selectedVehicle.brand || selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year || ''})`
  };
}

/**
 * Filter catalog products for a given vehicle and optional category.
 * Returns only products that are COMPATIBLE or COMPATIBILITY_NOT_VERIFIED.
 */
export function filterProductsByVehicle(products = [], selectedVehicle = null, selectedCategory = 'all') {
  if (!Array.isArray(products) || products.length === 0) return [];

  return products.filter(product => {
    // Universal products always pass
    if (product.isUniversal === true) return true;

    // Check compatibility result
    const res = checkProductCompatibility(product, selectedVehicle, selectedCategory);

    // Only allow COMPATIBLE (or if no vehicle selected, return all for category)
    if (!selectedVehicle) {
      if (selectedCategory && selectedCategory !== 'all') {
        const pCat = (product.category || '').toLowerCase();
        return pCat === selectedCategory.toLowerCase() || pCat === 'universal';
      }
      return true;
    }

    return res.status === 'COMPATIBLE';
  });
}
