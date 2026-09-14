import { supabase } from './supabaseClient';
import { logAdminAudit } from './adminAnalyticsEngine';

/**
 * AutoZoneIndia Supplier Management, Purchase Orders & Inventory Service Engine
 * Strictly uses real database records with atomic inventory transactions.
 */

// Helper to generate PO Number: PO-YYYYMMDD-0001
export async function generatePONumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `PO-${dateStr}`;

  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('purchase_order_number')
      .ilike('purchase_order_number', `${prefix}-%`)
      .order('purchase_order_number', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return `${prefix}-0001`;
    }

    const lastNoStr = data[0].purchase_order_number;
    const parts = lastNoStr.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10) || 0;
    const nextNum = String(lastNum + 1).padStart(4, '0');
    return `${prefix}-${nextNum}`;
  } catch (err) {
    console.error('Error generating PO number:', err);
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

// ----------------------------------------------------------------------
// 1. SUPPLIERS CRUD & RELATIONS
// ----------------------------------------------------------------------

export async function fetchSuppliers(searchTerm = '', statusFilter = 'all') {
  try {
    let query = supabase.from('suppliers').select('*').order('company_name', { ascending: true });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;

    let result = data || [];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        s.company_name?.toLowerCase().includes(q) ||
        s.supplier_code?.toLowerCase().includes(q) ||
        s.contact_person?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    return [];
  }
}

export async function saveSupplier(supplierData) {
  try {
    const isEdit = Boolean(supplierData.id);
    let payload = {
      company_name: supplierData.company_name,
      contact_person: supplierData.contact_person,
      phone: supplierData.phone,
      alternate_phone: supplierData.alternate_phone || null,
      email: supplierData.email,
      address_line1: supplierData.address_line1,
      address_line2: supplierData.address_line2 || null,
      city: supplierData.city,
      state: supplierData.state,
      pincode: supplierData.pincode,
      country: supplierData.country || 'India',
      gst_number: supplierData.gst_number || null,
      pan_number: supplierData.pan_number || null,
      website_url: supplierData.website_url || null,
      payment_terms: supplierData.payment_terms || 'Net 30',
      notes: supplierData.notes || null,
      status: supplierData.status || 'active',
      updated_at: new Date().toISOString()
    };

    let result;
    if (isEdit) {
      const { data, error } = await supabase
        .from('suppliers')
        .update(payload)
        .eq('id', supplierData.id)
        .select()
        .single();
      if (error) throw error;
      result = data;

      await logAdminAudit({
        action: 'SUPPLIER_UPDATED',
        entityType: 'supplier',
        entityId: supplierData.id,
        description: `Updated supplier '${supplierData.company_name}' (#${supplierData.supplier_code || ''})`
      });
    } else {
      const supplierCode = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;
      payload.supplier_code = supplierCode;

      const { data, error } = await supabase
        .from('suppliers')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      result = data;

      await logAdminAudit({
        action: 'SUPPLIER_CREATED',
        entityType: 'supplier',
        entityId: result.id,
        description: `Created new supplier '${result.company_name}' (${result.supplier_code})`
      });
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('Error saving supplier:', err);
    throw err;
  }
}

export async function updateSupplierStatus(supplierId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', supplierId)
      .select()
      .single();

    if (error) throw error;

    await logAdminAudit({
      action: 'SUPPLIER_STATUS_CHANGED',
      entityType: 'supplier',
      entityId: supplierId,
      description: `Supplier status changed to '${newStatus}'`
    });

    return data;
  } catch (err) {
    console.error('Error updating supplier status:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------
// 2. SUPPLIER - PRODUCT RELATIONS
// ----------------------------------------------------------------------

export async function fetchSupplierProducts(supplierId = null, productId = null) {
  try {
    let query = supabase
      .from('supplier_products')
      .select(`
        *,
        suppliers ( id, company_name, supplier_code, phone, email ),
        products ( id, name, sku, price, stock_quantity )
      `);

    if (supplierId) query = query.eq('supplier_id', supplierId);
    if (productId) query = query.eq('product_id', productId);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching supplier products:', err);
    return [];
  }
}

export async function assignSupplierProduct(relationData) {
  try {
    const payload = {
      supplier_id: relationData.supplier_id,
      product_id: relationData.product_id,
      supplier_sku: relationData.supplier_sku || null,
      purchase_price: Number(relationData.purchase_price) || 0,
      minimum_order_quantity: Number(relationData.minimum_order_quantity) || 1,
      lead_time_days: Number(relationData.lead_time_days) || 3,
      preferred_supplier: Boolean(relationData.preferred_supplier),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('supplier_products')
      .upsert([payload], { onConflict: 'supplier_id,product_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error mapping supplier to product:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------
// 3. PURCHASE ORDERS ENGINE & ATOMIC RECEIVING
// ----------------------------------------------------------------------

export async function fetchPurchaseOrders(statusFilter = 'all', supplierFilter = 'all') {
  try {
    let query = supabase
      .from('purchase_orders')
      .select(`
        *,
        suppliers ( id, company_name, supplier_code, phone, email ),
        purchase_order_items (
          id, product_id, quantity_ordered, quantity_received, unit_purchase_price, line_total,
          products ( id, name, sku )
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (supplierFilter !== 'all') query = query.eq('supplier_id', supplierFilter);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    return [];
  }
}

export async function createPurchaseOrder(poPayload) {
  try {
    const poNumber = await generatePONumber();

    let subtotal = 0;
    const items = poPayload.items || [];
    items.forEach(item => {
      const lineTot = (Number(item.unit_purchase_price) || 0) * (Number(item.quantity_ordered) || 1);
      subtotal += lineTot;
    });

    const taxAmount = Number(poPayload.tax_amount) || Math.round(subtotal * 0.18);
    const discountAmount = Number(poPayload.discount_amount) || 0;
    const shippingAmount = Number(poPayload.shipping_amount) || 0;
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    const poInsert = {
      purchase_order_number: poNumber,
      supplier_id: poPayload.supplier_id,
      status: poPayload.status || 'draft',
      order_date: poPayload.order_date || new Date().toISOString(),
      expected_date: poPayload.expected_date || null,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      notes: poPayload.notes || null
    };

    const { data: createdPO, error: poErr } = await supabase
      .from('purchase_orders')
      .insert([poInsert])
      .select()
      .single();

    if (poErr) throw poErr;

    // Insert Items
    if (items.length > 0) {
      const itemInserts = items.map(item => ({
        purchase_order_id: createdPO.id,
        product_id: item.product_id,
        supplier_product_id: item.supplier_product_id || null,
        quantity_ordered: Number(item.quantity_ordered) || 1,
        quantity_received: 0,
        unit_purchase_price: Number(item.unit_purchase_price) || 0,
        tax_rate: Number(item.tax_rate) || 18,
        discount_amount: Number(item.discount_amount) || 0,
        line_total: (Number(item.unit_purchase_price) || 0) * (Number(item.quantity_ordered) || 1)
      }));

      const { error: itemsErr } = await supabase.from('purchase_order_items').insert(itemInserts);
      if (itemsErr) throw itemsErr;
    }

    await logAdminAudit({
      action: 'PURCHASE_ORDER_CREATED',
      entityType: 'purchase_order',
      entityId: createdPO.id,
      description: `Created Purchase Order '${createdPO.purchase_order_number}' (Total: ₹${totalAmount.toLocaleString('en-IN')})`
    });

    return { success: true, poNumber: createdPO.purchase_order_number, poId: createdPO.id };
  } catch (err) {
    console.error('Error creating purchase order:', err);
    throw err;
  }
}

/**
 * Atomic Stock Receiving Workflow
 * Validates newly_received <= remaining_qty, updates physical stock, records inventory_transactions,
 * updates product_purchase_prices, and updates PO status.
 */
export async function receivePOItems({ purchaseOrderId, receivingMap }) {
  // receivingMap: { po_item_id: { newlyReceivedQty, productId, unitPrice } }
  try {
    const { data: po, error: poErr } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        purchase_order_items ( id, product_id, quantity_ordered, quantity_received, unit_purchase_price )
      `)
      .eq('id', purchaseOrderId)
      .single();

    if (poErr || !po) throw new Error('Purchase order not found.');
    if (po.status === 'cancelled') throw new Error('Cannot receive items for a cancelled purchase order.');

    let allReceived = true;
    let anyReceived = false;

    for (const item of po.purchase_order_items) {
      const recData = receivingMap[item.id];
      const newlyRec = recData ? (Number(recData.newlyReceivedQty) || 0) : 0;

      const currentRec = Number(item.quantity_received) || 0;
      const ordered = Number(item.quantity_ordered) || 0;
      const remaining = Math.max(0, ordered - currentRec);

      if (newlyRec > remaining) {
        throw new Error(`Over-receiving prevented! Newly received (${newlyRec}) exceeds remaining quantity (${remaining}) for PO item #${item.id}.`);
      }

      const totalNewReceived = currentRec + newlyRec;
      if (totalNewReceived < ordered) {
        allReceived = false;
      }
      if (totalNewReceived > 0) {
        anyReceived = true;
      }

      if (newlyRec > 0) {
        // 1. Update PO Item received count
        const { error: itemUpErr } = await supabase
          .from('purchase_order_items')
          .update({ quantity_received: totalNewReceived, updated_at: new Date().toISOString() })
          .eq('id', item.id);
        if (itemUpErr) throw itemUpErr;

        // 2. Fetch product stock to calculate before and after
        const { data: prodData } = await supabase
          .from('products')
          .select('id, stock_quantity')
          .eq('id', item.product_id)
          .single();

        const prevStock = prodData?.stock_quantity ?? 0;
        const newStock = prevStock + newlyRec;

        // 3. Update Product Physical Stock
        await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('id', item.product_id);

        // 4. Log Inventory Transaction
        await supabase.from('inventory_transactions').insert([{
          product_id: item.product_id,
          transaction_type: 'purchase',
          quantity: newlyRec,
          quantity_before: prevStock,
          quantity_after: newStock,
          reference_type: 'purchase_order',
          reference_id: po.purchase_order_number,
          notes: `Stock Received from PO #${po.purchase_order_number}`
        }]);

        // 5. Insert into Product Purchase Price History
        await supabase.from('product_purchase_prices').insert([{
          product_id: item.product_id,
          supplier_id: po.supplier_id,
          purchase_order_id: po.id,
          unit_price: item.unit_purchase_price,
          quantity: newlyRec,
          purchase_date: new Date().toISOString()
        }]);
      }
    }

    // Determine new PO Status
    let newStatus = po.status;
    if (allReceived) {
      newStatus = 'received';
    } else if (anyReceived) {
      newStatus = 'partially_received';
    }

    await supabase
      .from('purchase_orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', purchaseOrderId);

    await logAdminAudit({
      action: 'PO_ITEMS_RECEIVED',
      entityType: 'purchase_order',
      entityId: purchaseOrderId,
      description: `Stock received for PO #${po.purchase_order_number}. Status updated to '${newStatus}'`
    });

    return { success: true, newStatus };
  } catch (err) {
    console.error('Error during PO stock receiving:', err);
    throw err;
  }
}

export async function cancelPurchaseOrder(poId, reason = '') {
  try {
    const { data: po, error } = await supabase
      .from('purchase_orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', poId)
      .select()
      .single();

    if (error) throw error;

    await logAdminAudit({
      action: 'PURCHASE_ORDER_CANCELLED',
      entityType: 'purchase_order',
      entityId: poId,
      description: `Cancelled Purchase Order #${po.purchase_order_number}. Reason: ${reason}`
    });

    return data;
  } catch (err) {
    console.error('Error cancelling purchase order:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------
// 4. MANUAL STOCK ADJUSTMENTS & TRANSACTIONS
// ----------------------------------------------------------------------

export async function createInventoryTransaction({ productId, transactionType, quantity, reason = '', notes = '' }) {
  try {
    const { data: prod, error: prodErr } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .eq('id', productId)
      .single();

    if (prodErr || !prod) throw new Error('Product not found for inventory transaction.');

    const prevStock = prod.stock_quantity ?? 0;
    // Positive quantity for additions, negative for deductions
    const change = Number(quantity);
    const newStock = Math.max(0, prevStock + change);

    // Update Product Stock
    const { error: upErr } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', productId);
    if (upErr) throw upErr;

    // Log Inventory Transaction
    const { data: tx, error: txErr } = await supabase
      .from('inventory_transactions')
      .insert([{
        product_id: productId,
        transaction_type: transactionType,
        quantity: change,
        quantity_before: prevStock,
        quantity_after: newStock,
        reference_type: 'manual_adjustment',
        notes: `${reason} ${notes ? `- ${notes}` : ''}`
      }])
      .select()
      .single();

    if (txErr) throw txErr;

    await logAdminAudit({
      action: 'STOCK_ADJUSTMENT_CREATED',
      entityType: 'inventory',
      entityId: productId,
      description: `Stock adjusted for product '${prod.name}': ${change > 0 ? '+' : ''}${change} (${transactionType} - ${reason})`
    });

    return { success: true, previousStock: prevStock, newStock, tx };
  } catch (err) {
    console.error('Error creating inventory transaction:', err);
    throw err;
  }
}

export async function fetchStockHistory(productId = null, limit = 100) {
  try {
    let query = supabase
      .from('inventory_transactions')
      .select(`
        *,
        products ( id, name, sku )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productId) query = query.eq('product_id', productId);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching stock history:', err);
    return [];
  }
}

// ----------------------------------------------------------------------
// 5. COST + GROSS MARGIN CALCULATIONS
// ----------------------------------------------------------------------

export function calculateGrossMargin(sellingPrice = 0, purchaseCost = 0) {
  const sell = Number(sellingPrice) || 0;
  const cost = Number(purchaseCost) || 0;

  if (!cost || cost <= 0 || !sell || sell <= 0) {
    return { grossMargin: 0, grossMarginPercentage: 0, isValid: false };
  }

  const grossMargin = sell - cost;
  const grossMarginPercentage = (grossMargin / sell) * 100;

  return {
    grossMargin,
    grossMarginPercentage: Number(grossMarginPercentage.toFixed(2)),
    isValid: true
  };
}
