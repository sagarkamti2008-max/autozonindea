/**
 * AutoZoneIndia - Vehicle Compatibility & My Garage Core Engine
 * 
 * Rules:
 * - Strict explicit compatibility: NEVER infers fitment without database record
 * - Returns: 'compatible' | 'not_compatible' | 'not_confirmed'
 * - Manages customer saved vehicles in database (auth) & localStorage (guest)
 */

import { supabase } from './supabaseClient';

const LOCAL_GARAGE_KEY = 'autozon_garage';

/**
 * Reusable Strict Compatibility Checker
 * @param {string} productId 
 * @param {string|Object} vehicleInput (vehicle ID or vehicle object)
 * @returns {Promise<'compatible'|'not_compatible'|'not_confirmed'>}
 */
export async function checkProductCompatibility(productId, vehicleInput) {
  if (!productId || !vehicleInput) {
    return 'not_confirmed';
  }

  const vehicleId = typeof vehicleInput === 'string' ? vehicleInput : (vehicleInput.id || vehicleInput.vehicle_id);

  try {
    // 1. Direct query to product_compatibility table
    const { data: records, error } = await supabase
      .from('product_compatibility')
      .select('id, vehicle_id')
      .eq('product_id', productId);

    if (error || !records) {
      // Memory object check fallback if DB not reachable
      return 'not_confirmed';
    }

    if (records.length === 0) {
      return 'not_confirmed';
    }

    const match = records.some(r => r.vehicle_id === vehicleId);
    return match ? 'compatible' : 'not_compatible';
  } catch (err) {
    return 'not_confirmed';
  }
}

/**
 * Fetch verified compatible product IDs for a Vehicle
 */
export async function getCompatibleProducts(vehicleId) {
  if (!vehicleId) return [];

  try {
    const { data, error } = await supabase
      .from('product_compatibility')
      .select('product_id')
      .eq('vehicle_id', vehicleId);

    if (error || !data) return [];
    return data.map(r => r.product_id);
  } catch (err) {
    return [];
  }
}

/**
 * My Garage - Get Saved Customer Vehicles
 */
export async function getCustomerVehicles(customerId = null) {
  if (customerId) {
    try {
      const { data, error } = await supabase
        .from('customer_vehicles')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_default', { ascending: false });

      if (!error && data) return data;
    } catch (e) {}
  }

  // LocalStorage Fallback for guest users
  try {
    const saved = localStorage.getItem(LOCAL_GARAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

/**
 * My Garage - Save Vehicle
 */
export async function saveCustomerVehicle(vehicleData, customerId = null) {
  const newVehicle = {
    id: `gar-${Date.now()}`,
    customer_id: customerId,
    vehicle_id: vehicleData.id || vehicleData.vehicle_id || null,
    make: vehicleData.make || vehicleData.makeName || 'Unknown Make',
    model: vehicleData.model || vehicleData.modelName || 'Unknown Model',
    generation: vehicleData.generation || '',
    variant: vehicleData.variant || '',
    year: Number(vehicleData.year) || new Date().getFullYear(),
    fuel_type: vehicleData.fuel_type || vehicleData.fuelType || 'Petrol',
    transmission: vehicleData.transmission || 'Manual',
    is_default: vehicleData.is_default || false,
    created_at: new Date().toISOString()
  };

  if (customerId) {
    try {
      const { data, error } = await supabase
        .from('customer_vehicles')
        .insert([newVehicle])
        .select()
        .single();

      if (!error && data) return { success: true, vehicle: data };
    } catch (e) {}
  }

  // Guest LocalStorage saving
  try {
    const current = await getCustomerVehicles(null);
    const updated = [newVehicle, ...current.filter(v => v.id !== newVehicle.id)];
    localStorage.setItem(LOCAL_GARAGE_KEY, JSON.stringify(updated));
    return { success: true, vehicle: newVehicle };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * My Garage - Remove Saved Vehicle
 */
export async function removeCustomerVehicle(vehicleId, customerId = null) {
  if (customerId) {
    try {
      await supabase.from('customer_vehicles').delete().eq('id', vehicleId);
    } catch (e) {}
  }

  try {
    const current = await getCustomerVehicles(null);
    const updated = current.filter(v => v.id !== vehicleId);
    localStorage.setItem(LOCAL_GARAGE_KEY, JSON.stringify(updated));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * My Garage - Set Default Vehicle
 */
export async function setDefaultCustomerVehicle(vehicleId, customerId = null) {
  if (customerId) {
    try {
      await supabase.from('customer_vehicles').update({ is_default: false }).eq('customer_id', customerId);
      await supabase.from('customer_vehicles').update({ is_default: true }).eq('id', vehicleId);
    } catch (e) {}
  }

  try {
    const current = await getCustomerVehicles(null);
    const updated = current.map(v => ({ ...v, is_default: v.id === vehicleId }));
    localStorage.setItem(LOCAL_GARAGE_KEY, JSON.stringify(updated));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
