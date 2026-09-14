// Automotive Vehicle Fitment & Compatibility Engine for AutoZonIndia

export const checkVehicleProductCompatibility = (product, selectedVehicle) => {
  if (!product) {
    return { compatible: false, status: 'Invalid Product', badge: '✕ Incompatible' };
  }

  if (!selectedVehicle) {
    return { compatible: true, status: 'No Vehicle Selected', badge: '⚠ Select Vehicle' };
  }

  if (product.isUniversal) {
    return { compatible: true, status: 'Universal Fitment', badge: '✓ Universal Fit' };
  }

  const vehicleKey = `${selectedVehicle.makeId || selectedVehicle.makeName?.toLowerCase()}-${selectedVehicle.modelId || selectedVehicle.modelName?.toLowerCase()}`;
  const isMatch = product.compatibleVehicles && product.compatibleVehicles.some(v => {
    if (typeof v === 'string') return v.toLowerCase().includes(selectedVehicle.modelName?.toLowerCase());
    return v.makeName?.toLowerCase() === selectedVehicle.makeName?.toLowerCase() &&
           v.modelName?.toLowerCase() === selectedVehicle.modelName?.toLowerCase();
  });

  if (isMatch) {
    return { compatible: true, status: 'Verified Fitment', badge: '✓ Verified Compatible' };
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
