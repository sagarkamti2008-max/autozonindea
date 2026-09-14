// Warehouse, Multi-Location Inventory, Barcode/QR & Pick/Pack/Dispatch Service for AutoZoneIndia
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const warehouseFulfillmentService = {
  // -------------------------------------------------------------
  // 1. WAREHOUSE & LOCATION MANAGEMENT
  // -------------------------------------------------------------
  async getWarehouses() {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('name', { ascending: true });
    return { data: data || [], error };
  },

  async createWarehouse(whData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
    
    // If setting as default, unset other defaults
    if (whData.is_default) {
      await supabase.from('warehouses').update({ is_default: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data, error } = await supabase
      .from('warehouses')
      .insert([{
        ...whData,
        code: whData.code.toUpperCase().trim(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Warehouse Created', `Created warehouse ${data.name} (${data.code})`, userId);
    }

    return { data, error };
  },

  async updateWarehouse(id, whData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    if (whData.is_default) {
      await supabase.from('warehouses').update({ is_default: false }).neq('id', id);
    }

    const { data, error } = await supabase
      .from('warehouses')
      .update({
        ...whData,
        code: whData.code ? whData.code.toUpperCase().trim() : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Warehouse Updated', `Updated warehouse ${data.name}`, userId);
    }

    return { data, error };
  },

  async getWarehouseLocations(warehouseId) {
    if (!isSupabaseConfigured()) return { data: [], error: null };
    let query = supabase.from('warehouse_locations').select('*');
    if (warehouseId) query = query.eq('warehouse_id', warehouseId);
    query = query.order('location_code', { ascending: true });

    const { data, error } = await query;
    return { data: data || [], error };
  },

  async createWarehouseLocation(locData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const { warehouse_id, zone, rack, shelf, bin } = locData;
    const location_code = locData.location_code || `${zone || 'A'}-${rack || 'R01'}-${shelf || 'S01'}-${bin || 'B01'}`;

    const { data, error } = await supabase
      .from('warehouse_locations')
      .insert([{
        warehouse_id,
        location_code: location_code.toUpperCase().trim(),
        zone: (zone || 'A').toUpperCase(),
        rack: (rack || 'R01').toUpperCase(),
        shelf: (shelf || 'S01').toUpperCase(),
        bin: (bin || 'B01').toUpperCase(),
        status: locData.status || 'active',
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Location Created', `Created location ${data.location_code}`, userId);
    }

    return { data, error };
  },

  // -------------------------------------------------------------
  // 2. MULTI-WAREHOUSE INVENTORY & AVAILABLE CALCULATIONS
  // -------------------------------------------------------------
  async getWarehouseStock(warehouseId = null, productId = null) {
    if (!isSupabaseConfigured()) return { data: [], error: null };

    let query = supabase.from('warehouse_inventory').select(`
      *,
      warehouse:warehouses(id, name, code),
      location:warehouse_locations(id, location_code, zone, rack, shelf, bin),
      product:products(id, name, title, sku, barcode, part_number, price, image)
    `);

    if (warehouseId) query = query.eq('warehouse_id', warehouseId);
    if (productId) query = query.eq('product_id', productId);

    const { data, error } = await query;
    
    // Attach calculated available stock: available = quantity - reserved_quantity - damaged_quantity
    const formatted = (data || []).map(item => {
      const qty = item.quantity || 0;
      const res = item.reserved_quantity || 0;
      const dmg = item.damaged_quantity || 0;
      const available = Math.max(0, qty - res - dmg);

      return {
        ...item,
        availableQuantity: available,
        isLowStock: available <= (item.reorder_level || 10)
      };
    });

    return { data: formatted, error };
  },

  // -------------------------------------------------------------
  // 3. BARCODE & QR CODE ENGINE
  // -------------------------------------------------------------
  generateInternalBarcode(product) {
    if (!product) return 'AZ8800000000';
    if (product.barcode) return product.barcode;
    const cleanId = String(product.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    const cleanSku = String(product.sku || product.part_number || 'PROD').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4);
    return `AZ-${cleanSku}-${cleanId}`.toUpperCase();
  },

  generateQRCodePayload(product) {
    if (!product) return '';
    // Public URL payload (never exposes internal DB credentials)
    return `https://autozonindia.vercel.app/product/${product.slug || product.id}`;
  },

  async lookupProductByBarcode(scannedBarcode) {
    if (!isSupabaseConfigured() || !scannedBarcode) return { data: null, error: 'NO_INPUT' };

    const term = scannedBarcode.trim();

    // Query products table by barcode, sku, part_number, or id
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`barcode.eq.${term},sku.eq.${term},part_number.eq.${term},id.eq.${term}`)
      .single();

    if (data) {
      // Also fetch stock locations for this product
      const { data: stock } = await this.getWarehouseStock(null, data.id);
      return {
        data: {
          product: data,
          stockLocations: stock || []
        },
        error: null
      };
    }

    return { data: null, error: error || 'PRODUCT_NOT_FOUND' };
  },

  // -------------------------------------------------------------
  // 4. STOCK TRANSFER WORKFLOW
  // -------------------------------------------------------------
  async getStockTransfers(filters = {}) {
    if (!isSupabaseConfigured()) return { data: [], error: null };

    let query = supabase.from('stock_transfers').select(`
      *,
      source_warehouse:warehouses!source_warehouse_id(id, name, code),
      destination_warehouse:warehouses!destination_warehouse_id(id, name, code),
      items:stock_transfer_items(
        id, product_id, quantity_requested, quantity_sent, quantity_received,
        product:products(id, name, title, sku, part_number, image)
      )
    `);

    if (filters.status) query = query.eq('status', filters.status);
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data: data || [], error };
  },

  async createStockTransfer(transferData, items = [], userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const transfer_number = `TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: transfer, error: trErr } = await supabase
      .from('stock_transfers')
      .insert([{
        transfer_number,
        source_warehouse_id: transferData.source_warehouse_id,
        destination_warehouse_id: transferData.destination_warehouse_id,
        status: 'requested',
        requested_by: userId,
        notes: transferData.notes,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (trErr || !transfer) return { data: null, error: trErr };

    // Insert line items
    const lineItems = items.map(item => ({
      transfer_id: transfer.id,
      product_id: item.product_id,
      quantity_requested: parseInt(item.quantity_requested || 1, 10),
      quantity_sent: 0,
      quantity_received: 0
    }));

    await supabase.from('stock_transfer_items').insert(lineItems);

    await this.logAdminAudit('Stock Transfer Requested', `Created transfer ${transfer_number}`, userId);

    return { data: transfer, error: null };
  },

  async approveStockTransfer(transferId, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const { data, error } = await supabase
      .from('stock_transfers')
      .update({
        status: 'approved',
        approved_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', transferId)
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Stock Transfer Approved', `Approved transfer ${data.transfer_number}`, userId);
    }

    return { data, error };
  },

  async shipStockTransfer(transferId, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    // Fetch transfer & items
    const { data: tr } = await supabase.from('stock_transfers').select('*, items:stock_transfer_items(*)').eq('id', transferId).single();
    if (!tr) return { data: null, error: 'TRANSFER_NOT_FOUND' };

    // Deduct stock from source warehouse
    for (const item of (tr.items || [])) {
      await this.recordStockTransaction({
        product_id: item.product_id,
        warehouse_id: tr.source_warehouse_id,
        quantity_change: -item.quantity_requested,
        reference_type: 'warehouse_transfer_out',
        reference_id: tr.transfer_number,
        performed_by: userId,
        reason: `Transfer OUT to Destination Warehouse (${tr.transfer_number})`
      });
    }

    const { data, error } = await supabase
      .from('stock_transfers')
      .update({
        status: 'in_transit',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', transferId)
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Stock Transfer Shipped', `Shipped transfer ${tr.transfer_number}`, userId);
    }

    return { data, error };
  },

  async receiveStockTransfer(transferId, receivedItemsMap = {}, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const { data: tr } = await supabase.from('stock_transfers').select('*, items:stock_transfer_items(*)').eq('id', transferId).single();
    if (!tr) return { data: null, error: 'TRANSFER_NOT_FOUND' };

    // Add stock to destination warehouse
    for (const item of (tr.items || [])) {
      const qtyRec = receivedItemsMap[item.id] || item.quantity_requested;
      
      await supabase.from('stock_transfer_items').update({
        quantity_sent: item.quantity_requested,
        quantity_received: qtyRec
      }).eq('id', item.id);

      await this.recordStockTransaction({
        product_id: item.product_id,
        warehouse_id: tr.destination_warehouse_id,
        quantity_change: qtyRec,
        reference_type: 'warehouse_transfer_in',
        reference_id: tr.transfer_number,
        performed_by: userId,
        reason: `Transfer IN from Source Warehouse (${tr.transfer_number})`
      });
    }

    const { data, error } = await supabase
      .from('stock_transfers')
      .update({
        status: 'received',
        received_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', transferId)
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Stock Transfer Received', `Received transfer ${tr.transfer_number}`, userId);
    }

    return { data, error };
  },

  // -------------------------------------------------------------
  // 5. ORDER FULFILLMENT PIPELINE (PICK / PACK / QC / DISPATCH)
  // -------------------------------------------------------------
  async getPickLists(status = null) {
    if (!isSupabaseConfigured()) return { data: [], error: null };

    let query = supabase.from('pick_lists').select(`
      *,
      warehouse:warehouses(id, name, code),
      items:pick_list_items(
        id, product_id, location_id, quantity_required, quantity_picked, status,
        product:products(id, name, title, sku, barcode, image),
        location:warehouse_locations(id, location_code)
      )
    `);

    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data: data || [], error };
  },

  async verifyPickItemBarcode(pickListId, itemId, scannedBarcode) {
    if (!isSupabaseConfigured()) return { success: false, error: 'SUPABASE_NOT_CONFIGURED' };

    // Fetch pick item product
    const { data: pickItem } = await supabase
      .from('pick_list_items')
      .select('*, product:products(id, barcode, sku, part_number)')
      .eq('id', itemId)
      .single();

    if (!pickItem || !pickItem.product) {
      return { success: false, error: 'ITEM_NOT_FOUND' };
    }

    const targetBarcode = String(pickItem.product.barcode || pickItem.product.sku || pickItem.product.part_number || '').toUpperCase().trim();
    const inputCode = String(scannedBarcode || '').toUpperCase().trim();

    // Verify barcode match
    if (targetBarcode !== inputCode && pickItem.product.id !== scannedBarcode) {
      return {
        success: false,
        error: `BARCODE_MISMATCH: Scanned ${inputCode} does not match required product barcode ${targetBarcode}`
      };
    }

    // Increment picked quantity
    const newPicked = (pickItem.quantity_picked || 0) + 1;
    const isCompleted = newPicked >= pickItem.quantity_required;

    await supabase
      .from('pick_list_items')
      .update({
        quantity_picked: newPicked,
        status: isCompleted ? 'picked' : 'picking'
      })
      .eq('id', itemId);

    return {
      success: true,
      newPicked,
      isCompleted
    };
  },

  async completePickList(pickListId, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    const { data, error } = await supabase
      .from('pick_lists')
      .update({
        status: 'picked',
        completed_at: new Date().toISOString()
      })
      .eq('id', pickListId)
      .select()
      .single();

    if (data && !error) {
      await this.logAdminAudit('Order Pick Completed', `Completed pick list ${data.pick_number}`, userId);
    }

    return { data, error };
  },

  async dispatchOrder(orderId, dispatchData, userId = null) {
    if (!isSupabaseConfigured()) return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };

    // 1. Create dispatch record
    const { data: dispatch, error: dispErr } = await supabase
      .from('dispatch_records')
      .insert([{
        order_id: orderId,
        warehouse_id: dispatchData.warehouse_id,
        package_count: parseInt(dispatchData.package_count || 1, 10),
        weight: parseFloat(dispatchData.weight || 1.0),
        courier_provider: dispatchData.courier_provider,
        tracking_number: dispatchData.tracking_number,
        dispatched_by: userId,
        status: 'dispatched',
        dispatched_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dispErr || !dispatch) return { data: null, error: dispErr };

    // 2. Update Order status to 'Shipped'
    await supabase.from('orders').update({
      orderStatus: 'Shipped',
      updatedAt: new Date().toISOString()
    }).eq('id', orderId);

    // 3. Log stock transactions for order items dispatch
    await this.logAdminAudit('Order Dispatched', `Dispatched Order #${orderId} via ${dispatchData.courier_provider} (AWB: ${dispatchData.tracking_number})`, userId);

    return { data: dispatch, error: null };
  },

  // -------------------------------------------------------------
  // 6. STOCK ADJUSTMENTS & TRANSACTION AUDIT LOG
  // -------------------------------------------------------------
  async recordStockTransaction(txData) {
    if (!isSupabaseConfigured()) return;

    // Fetch current product stock
    const { data: prod } = await supabase.from('products').select('stock, name, title').eq('id', txData.product_id).single();
    const qtyBefore = prod ? (prod.stock || 0) : 0;
    const qtyChange = parseInt(txData.quantity_change || 0, 10);
    const qtyAfter = Math.max(0, qtyBefore + qtyChange);

    // Update main products table stock
    if (prod) {
      await supabase.from('products').update({ stock: qtyAfter }).eq('id', txData.product_id);
    }

    // Insert immutable transaction record
    await supabase.from('inventory_transactions').insert([{
      product_id: txData.product_id,
      warehouse_id: txData.warehouse_id || null,
      location_id: txData.location_id || null,
      quantity_before: qtyBefore,
      quantity_change: qtyChange,
      quantity_after: qtyAfter,
      reference_type: txData.reference_type || 'stock_adjustment',
      reference_id: txData.reference_id || null,
      performed_by: txData.performed_by || null,
      reason: txData.reason || 'Manual Adjustment',
      created_at: new Date().toISOString()
    }]);
  },

  async getInventoryTransactions(limit = 50) {
    if (!isSupabaseConfigured()) return { data: [], error: null };

    const { data, error } = await supabase
      .from('inventory_transactions')
      .select(`
        *,
        product:products(id, name, title, sku, part_number, image),
        warehouse:warehouses(id, name, code)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data: data || [], error };
  },

  // -------------------------------------------------------------
  // 7. UNIVERSAL INVENTORY SEARCH & DASHBOARD METRICS
  // -------------------------------------------------------------
  async searchInventory(query) {
    if (!isSupabaseConfigured() || !query) return { data: [], error: null };
    const term = query.trim();

    const { data, error } = await supabase
      .from('warehouse_inventory')
      .select(`
        *,
        warehouse:warehouses(id, name, code),
        location:warehouse_locations(id, location_code, zone, rack, shelf, bin),
        product:products(id, name, title, sku, barcode, part_number, price, image)
      `)
      .or(`product.name.ilike.%${term}%,product.sku.ilike.%${term}%,product.barcode.ilike.%${term}%,location.location_code.ilike.%${term}%`);

    return { data: data || [], error };
  },

  async getFulfillmentDashboardMetrics() {
    if (!isSupabaseConfigured()) {
      return {
        totalProducts: 0,
        totalUnits: 0,
        availableStock: 0,
        reservedStock: 0,
        damagedStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        pendingTransfers: 0,
        pendingPicking: 0,
        readyToDispatch: 0
      };
    }

    const [
      { data: prods },
      { data: whStock },
      { data: transfers },
      { data: picks },
      { data: dispatches }
    ] = await Promise.all([
      supabase.from('products').select('id, stock'),
      supabase.from('warehouse_inventory').select('quantity, reserved_quantity, damaged_quantity, reorder_level'),
      supabase.from('stock_transfers').select('id').eq('status', 'in_transit'),
      supabase.from('pick_lists').select('id').eq('status', 'pending'),
      supabase.from('dispatch_records').select('id').eq('status', 'ready')
    ]);

    let totalUnits = 0;
    let availableStock = 0;
    let reservedStock = 0;
    let damagedStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    (whStock || []).forEach(item => {
      const q = item.quantity || 0;
      const r = item.reserved_quantity || 0;
      const d = item.damaged_quantity || 0;
      const avail = Math.max(0, q - r - d);

      totalUnits += q;
      reservedStock += r;
      damagedStock += d;
      availableStock += avail;

      if (avail === 0) outOfStockCount++;
      else if (avail <= (item.reorder_level || 10)) lowStockCount++;
    });

    return {
      totalProducts: (prods || []).length,
      totalUnits,
      availableStock,
      reservedStock,
      damagedStock,
      lowStockCount,
      outOfStockCount,
      pendingTransfers: (transfers || []).length,
      pendingPicking: (picks || []).length,
      readyToDispatch: (dispatches || []).length
    };
  },

  // Helper audit logger
  async logAdminAudit(action, details = '', userId = null) {
    try {
      if (!isSupabaseConfigured()) return;
      await supabase.from('admin_audit_logs').insert([{
        action,
        details,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.warn('Audit log write error:', e);
    }
  }
};
