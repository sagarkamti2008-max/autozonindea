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
