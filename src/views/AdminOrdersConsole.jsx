import React, { useState, useEffect } from 'react';
import { SupabaseAPI } from '../services/supabaseClient';
import { BarcodePrintLabelModal } from '../components/BarcodePrintLabelModal';
import { 
  ShoppingBag, Search, Filter, Eye, CheckCircle2, Clock, Truck, 
  XCircle, AlertTriangle, ArrowUpRight, DollarSign, User, Phone, 
  MapPin, Calendar, Package, FileText, Download, Printer, RefreshCw, X, ChevronRight, Check, MessageSquare, Tag, Edit3, Send
} from 'lucide-react';

const INITIAL_MOCK_ORDERS = [
  {
    id: 'AZ-ORD-8821',
    orderNumber: 'AZ-ORD-8821',
    createdAt: '2026-09-20 14:15',
    date: '20 Sep 2026, 02:15 PM',
    customerName: 'Sagar Kamti',
    customerPhone: '+91 8591719499',
    customerEmail: 'sagar.kamti@autozonindia.com',
    shippingAddress: {
      addressLine: 'Flat 402, Sai Heights, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053'
    },
    items: [
      {
        id: 'item-1',
        title: 'Bosch Front Brake Pad Set for Maruti Swift',
        partNumber: 'BOSCH-BP-2022',
        brand: 'BOSCH',
        category: 'Brake Parts',
        quantity: 2,
        price: 1999,
        mrp: 2500,
        image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=400&auto=format&fit=crop&q=80'
      }
    ],
    mrpTotal: 5000,
    totalAmount: 3998,
    discountAmount: 1002,
    taxAmount: 610,
    shippingFee: 0,
    paymentMethod: 'UPI (GPay / PhonePe)',
    paymentStatus: 'Paid',
    orderStatus: 'Active',
    status: 'Active',
    trackingNumber: 'AWB-BLUEDART-882199',
    courierName: 'BlueDart Express'
  },
  {
    id: 'AZ-ORD-8820',
    orderNumber: 'AZ-ORD-8820',
    createdAt: '2026-09-20 11:30',
    date: '20 Sep 2026, 11:30 AM',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9820198273',
    customerEmail: 'rahul.s@gmail.com',
    shippingAddress: {
      addressLine: 'B-12, Sector 62, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301'
    },
    items: [
      {
        id: 'item-2',
        title: 'Engine Air Filter High Dust Protection',
        partNumber: 'FLT-AIR-99',
        brand: 'AutoZon Originals',
        category: 'Filters',
        quantity: 1,
        price: 599,
        mrp: 800,
        image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'item-3',
        title: 'Shell Helix Ultra 5W-30 Fully Synthetic 4L',
        partNumber: 'SHL-OIL-5W30',
        brand: 'Shell',
        category: 'Engine Parts',
        quantity: 1,
        price: 2850,
        mrp: 3500,
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=80'
      }
    ],
    mrpTotal: 4300,
    totalAmount: 3449,
    discountAmount: 851,
    taxAmount: 526,
    shippingFee: 0,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    status: 'Processing',
    trackingNumber: 'AWB-DELHIVERY-77129',
    courierName: 'Delhivery Logistics'
  },
  {
    id: 'AZ-ORD-8819',
    orderNumber: 'AZ-ORD-8819',
    createdAt: '2026-09-19 16:45',
    date: '19 Sep 2026, 04:45 PM',
    customerName: 'Priya Verma',
    customerPhone: '+91 9876543210',
    customerEmail: 'priya.verma@yahoo.com',
    shippingAddress: {
      addressLine: '88, 4th Main Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        id: 'item-4',
        title: 'LED Headlight Bulb H4 6000K Super White Pair',
        partNumber: 'LIT-H4-LED',
        brand: 'Philips',
        category: 'Lights',
        quantity: 2,
        price: 2100,
        mrp: 2500,
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80'
      }
    ],
    mrpTotal: 5000,
    totalAmount: 4200,
    discountAmount: 800,
    taxAmount: 640,
    shippingFee: 0,
    paymentMethod: 'Razorpay (Credit Card)',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    status: 'Shipped',
    trackingNumber: 'AWB-ECOM-992014',
    courierName: 'Ecom Express'
  },
  {
    id: 'AZ-ORD-8818',
    orderNumber: 'AZ-ORD-8818',
    createdAt: '2026-09-19 09:10',
    date: '19 Sep 2026, 09:10 AM',
    customerName: 'Amit Patel',
    customerPhone: '+91 9123456789',
    customerEmail: 'amit.patel@gmail.com',
    shippingAddress: {
      addressLine: '14, CG Road, Navrangpura',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009'
    },
    items: [
      {
        id: 'item-5',
        title: 'Front Shock Absorber Strut Assembly (Pair)',
        partNumber: 'SUS-SHK-02',
        brand: 'Monroe',
        category: 'Suspension',
        quantity: 1,
        price: 6500,
        mrp: 8000,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80'
      }
    ],
    mrpTotal: 8000,
    totalAmount: 6500,
    discountAmount: 1500,
    taxAmount: 991,
    shippingFee: 0,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    status: 'Pending',
    trackingNumber: 'Pending Dispatch',
    courierName: 'AutoZon Logistics'
  },
  {
    id: 'AZ-ORD-8817',
    orderNumber: 'AZ-ORD-8817',
    createdAt: '2026-09-18 18:20',
    date: '18 Sep 2026, 06:20 PM',
    customerName: 'Vikram Singh',
    customerPhone: '+91 9988776655',
    customerEmail: 'vikram.singh@rediffmail.com',
    shippingAddress: {
      addressLine: 'Plot 45, Tonk Road, C Scheme',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001'
    },
    items: [
      {
        id: 'item-6',
        title: 'Air Conditioner AC Compressor Unit Maruti Swift',
        partNumber: 'ACC-SWF-01',
        brand: 'Subros',
        category: 'AC Parts',
        quantity: 1,
        price: 11200,
        mrp: 14000,
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&auto=format&fit=crop&q=80'
      }
    ],
    mrpTotal: 14000,
    totalAmount: 11200,
    discountAmount: 2800,
    taxAmount: 1708,
    shippingFee: 0,
    paymentMethod: 'Net Banking (HDFC)',
    paymentStatus: 'Refunded',
    orderStatus: 'Inactive',
    status: 'Inactive',
    trackingNumber: 'N/A (Cancelled)',
    courierName: 'N/A'
  }
];

export const AdminOrdersConsole = () => {
  const [orders, setOrders] = useState(INITIAL_MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // AWB Courier Assignment Modal State
  const [awbModalOrder, setAwbModalOrder] = useState(null);
  const [inputCourier, setInputCourier] = useState('Delhivery Logistics');
  const [inputAwb, setInputAwb] = useState('');

  // Barcode Label Modal State
  const [barcodeProduct, setBarcodeProduct] = useState(null);

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, []);

  const fetchOrdersFromSupabase = async () => {
    try {
      const { data, error } = await SupabaseAPI.getOrders();
      if (data && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.log('Using default orders state:', err);
    }
  };

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus, status: newStatus } : o)
    );
    showToast(`✅ Order #${orderId} status updated to "${newStatus}"!`);

    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(prev => ({ ...prev, orderStatus: newStatus, status: newStatus }));
    }

    try {
      await SupabaseAPI.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
    }
  };

  const handleOpenAwbModal = (order) => {
    setAwbModalOrder(order);
    setInputCourier(order.courierName && order.courierName !== 'N/A' ? order.courierName : 'Delhivery Logistics');
    setInputAwb(order.trackingNumber && !order.trackingNumber.startsWith('Pending') ? order.trackingNumber : `AWB-${Date.now().toString().slice(-6)}`);
  };

  const checkAddressCompleteness = (order) => {
    if (!order) return { isComplete: false, missingFields: ['No Order Data'] };
    const addr = order.shippingAddress || {};
    const phone = (order.customerPhone || addr.phone || '').replace(/\D/g, '');
    const hasPhone = phone.length >= 10;
    const addressLine = (addr.addressLine || addr.addressLine1 || order.addressLine || '').trim();
    const hasLine = addressLine.length >= 5;
    const city = (addr.city || order.city || '').trim();
    const hasCity = city.length >= 2;
    const state = (addr.state || order.state || '').trim();
    const hasState = state.length >= 2;
    const pin = String(addr.pincode || addr.postalCode || order.pincode || '').replace(/\D/g, '');
    const hasPincode = /^[1-9][0-9]{5}$/.test(pin);
    const name = (order.customerName || addr.fullName || '').trim();
    const hasName = name.length >= 2;

    const missingFields = [
      !hasName && 'Customer Name',
      !hasPhone && '10-Digit Mobile',
      !hasLine && 'Full Address Line',
      !hasCity && 'City',
      !hasState && 'State',
      !hasPincode && '6-Digit Pincode'
    ].filter(Boolean);

    return {
      isComplete: missingFields.length === 0,
      hasPhone,
      hasLine,
      hasCity,
      hasState,
      hasPincode,
      hasName,
      missingFields,
      formattedPhone: phone,
      formattedPincode: pin,
      addressLine,
      city,
      state,
      name
    };
  };

  const handleSaveAwbFulfillment = () => {
    if (!awbModalOrder) return;

    const addrCheck = checkAddressCompleteness(awbModalOrder);
    if (!addrCheck.isComplete) {
      showToast(`⚠️ Cannot dispatch: Missing ${addrCheck.missingFields.join(', ')}`, 'error');
      return;
    }

    const updatedId = awbModalOrder.id;

    setOrders(prevOrders =>
      prevOrders.map(o => o.id === updatedId ? { 
        ...o, 
        courierName: inputCourier, 
        trackingNumber: inputAwb,
        orderStatus: o.orderStatus === 'Pending' || o.orderStatus === 'Processing' ? 'Shipped' : o.orderStatus
      } : o)
    );

    showToast(`🚚 AWB ${inputAwb} assigned via ${inputCourier}!`);

    if (selectedOrderDetails && selectedOrderDetails.id === updatedId) {
      setSelectedOrderDetails(prev => ({ 
        ...prev, 
        courierName: inputCourier, 
        trackingNumber: inputAwb,
        orderStatus: prev.orderStatus === 'Pending' || prev.orderStatus === 'Processing' ? 'Shipped' : prev.orderStatus
      }));
    }

    setAwbModalOrder(null);
  };

  const sendWhatsAppStatusUpdate = (order) => {
    const rawPhone = (order.customerPhone || '8591719499').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
    const mainItemTitle = order.items && order.items.length > 0 ? order.items[0].title : 'Spare Parts';
    const statusText = order.orderStatus || order.status || 'Active';
    const totalVal = Number(order.totalAmount || order.total_amount || 0).toLocaleString('en-IN');
    const awb = order.trackingNumber || 'Processing';
    const courier = order.courierName || 'Delhivery Logistics';

    const msg = `🚗 *SAGAR TRAVELS / KAMTI AUTOMOTIVE* Order Update\n\nDear *${order.customerName || 'Valued Customer'}*,\n\nYour order *#${order.id || order.orderNumber}* for *${mainItemTitle}* (Total: ₹${totalVal}) is currently: *${statusText.toUpperCase()}*.\n\n🚚 *Courier Partner*: ${courier}\n📦 *AWB Tracking*: ${awb}\n\n📍 Track online: https://sagar-travels-4de3b.web.app/track\n📞 Support & Helpline: 8591719499 | kamtiautomotive@gmail.com\n\nThank you for choosing SAGAR TRAVELS / KAMTI AUTOMOTIVE!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast(`📱 WhatsApp dispatch message generated for ${order.customerName}!`);
  };

  // Filtered Orders Calculation
  const filteredOrders = orders.filter(o => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !query ||
      (o.id && o.id.toLowerCase().includes(query)) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(query)) ||
      (o.items && o.items.some(i => i.title.toLowerCase().includes(query) || i.partNumber?.toLowerCase().includes(query)));

    const matchesStatus = 
      selectedStatusFilter === 'All' ? true :
      selectedStatusFilter === 'Active' ? (o.orderStatus === 'Active' || o.orderStatus === 'Delivered' || o.status === 'Active') :
      selectedStatusFilter === 'Inactive' ? (o.orderStatus === 'Inactive' || o.orderStatus === 'Cancelled' || o.status === 'Inactive') :
      (o.orderStatus === selectedStatusFilter || o.status === selectedStatusFilter);

    return matchesQuery && matchesStatus;
  });

  // Summary Metrics
  const totalOrdersCount = orders.length;
  const totalRevenueSum = orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.total_amount) || 0), 0);
  const totalSoldQuantity = orders.reduce((sum, o) => sum + (o.items ? o.items.reduce((iSum, i) => iSum + (i.quantity || 1), 0) : 1), 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
            <span>SAGAR TRAVELS / KAMTI AUTOMOTIVE</span>
            <span>•</span>
            <span>Support: 8591719499</span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>Customer Orders &amp; Courier Fulfillment Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time track customer orders, assign AWB courier tracking, print barcode labels &amp; dispatch 1-click WhatsApp alerts.
          </p>
        </div>

        <button 
          onClick={fetchOrdersFromSupabase}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-orange-400" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Total Orders</span>
            <div className="text-3xl font-black text-white mt-1">{totalOrdersCount}</div>
            <span className="text-[10px] text-emerald-400 font-bold">100% Verified Customer Calls</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Sales Value */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Total Sales</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">₹{totalRevenueSum.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400 font-bold">Avg ₹{Math.round(totalRevenueSum / (totalOrdersCount || 1)).toLocaleString('en-IN')} / Order</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Products Sold Quantity */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Products Sold</span>
            <div className="text-3xl font-black text-amber-400 mt-1">{totalSoldQuantity} Units</div>
            <span className="text-[10px] text-amber-300 font-bold">Spare Parts Dispatched</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Pending Orders</span>
            <div className="text-3xl font-black text-orange-400 mt-1">{pendingOrdersCount}</div>
            <span className="text-[10px] text-orange-300 font-bold">Requires Courier Dispatch</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controls Header: Search & Filter Tabs */}
      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="🔍 Search Order ID, Customer Name, Mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 font-bold focus:border-orange-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {['All', 'Active', 'Inactive', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(statusTab => (
            <button
              key={statusTab}
              onClick={() => setSelectedStatusFilter(statusTab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedStatusFilter === statusTab 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {statusTab === 'Active' ? '🟢 Active' : statusTab === 'Inactive' ? '⚪ Inactive' : statusTab}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Orders Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Order ID &amp; Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Product Purchased</th>
                <th className="p-4">Courier &amp; AWB</th>
                <th className="p-4">Your Price (₹)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const mainItem = order.items && order.items.length > 0 ? order.items[0] : null;
                  const isGreen = order.orderStatus === 'Active' || order.orderStatus === 'Delivered' || order.status === 'Active';
                  const isPending = order.orderStatus === 'Pending' || order.orderStatus === 'Processing';

                  return (
                    <tr key={order.id} className="hover:bg-slate-900/50 transition">
                      
                      {/* 1. Order ID & Date */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-mono font-black text-white text-sm">{order.id || order.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{order.date || order.createdAt}</span>
                        </div>
                      </td>

                      {/* 2. Customer Name & Mobile */}
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span>{order.customerName || 'Customer'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{order.customerPhone || '+91 8591719499'}</span>
                        </div>
                      </td>

                      {/* 3. Product Purchased */}
                      <td className="p-4">
                        {mainItem ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={mainItem.image || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=100&q=80'}
                              alt={mainItem.title}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-xs max-w-[200px] truncate" title={mainItem.title}>
                                {mainItem.title}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                SKU: {mainItem.partNumber || 'BOSCH-BP-2022'} • {mainItem.brand || 'BOSCH'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No Items Listed</span>
                        )}
                      </td>

                      {/* 4. Courier Partner & AWB Tracking */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-slate-200 text-xs">{order.courierName || 'Delhivery Logistics'}</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5 flex items-center gap-1">
                          <span>AWB: {order.trackingNumber || 'Pending'}</span>
                          <button
                            onClick={() => handleOpenAwbModal(order)}
                            className="text-orange-400 hover:text-orange-300 underline font-sans ml-1 text-[10px] cursor-pointer"
                            title="Edit AWB Courier Info"
                          >
                            Edit
                          </button>
                        </div>
                      </td>

                      {/* 5. Price & Total */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-black text-emerald-400 text-sm">
                          ₹{(Number(order.totalAmount || order.total_amount) || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                          {order.paymentMethod || 'COD'}
                        </div>
                      </td>

                      {/* 6. Order Status Badge & Toggle */}
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={order.orderStatus || order.status || 'Active'}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-black px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                            isGreen 
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                              : isPending 
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          <option value="Active">🟢 Active</option>
                          <option value="Delivered">🟢 Delivered</option>
                          <option value="Processing">🔵 Processing</option>
                          <option value="Shipped">🟣 Shipped</option>
                          <option value="Pending">🟠 Pending</option>
                          <option value="Inactive">⚪ Inactive</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                      </td>

                      {/* 7. Quick Action Buttons */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click WhatsApp Trigger */}
                          <button
                            onClick={() => sendWhatsAppStatusUpdate(order)}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold p-2 rounded-xl transition cursor-pointer"
                            title="Send WhatsApp Update to Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Barcode Label */}
                          <button
                            onClick={() => setBarcodeProduct(mainItem || { title: order.id, price: order.totalAmount, sku: order.id })}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold p-2 rounded-xl transition cursor-pointer"
                            title="Print Barcode Label"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>

                          {/* View Order Details */}
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-orange-400" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-bold">
                    No orders match your filter "{searchQuery || selectedStatusFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AWB Tracking & Courier Assignment Modal */}
      {awbModalOrder && (() => {
        const addrCheck = checkAddressCompleteness(awbModalOrder);
        const addr = awbModalOrder.shippingAddress || {};

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-100 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-orange-400" />
                    <span>Assign Courier &amp; AWB Dispatch</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Order #{awbModalOrder.id}</p>
                </div>
                <button 
                  onClick={() => setAwbModalOrder(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery Address & Contact Mandatory Check Card */}
              <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
                addrCheck.isComplete 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-wider">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Mandatory Delivery Address Verification</span>
                  </div>
                  {addrCheck.isComplete ? (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      ✓ 100% Verified
                    </span>
                  ) : (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                      ⚠️ Incomplete Details
                    </span>
                  )}
                </div>

                {!addrCheck.isComplete && (
                  <div className="bg-rose-950/60 border border-rose-500/40 p-2.5 rounded-xl text-rose-300 text-[11px] font-bold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span>Dispatch Blocked: Missing mandatory fields: </span>
                      <strong className="text-white underline">{addrCheck.missingFields.join(', ')}</strong>. Please fill them below before dispatching.
                    </div>
                  </div>
                )}

                {/* Inline Address & Contact Editable Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Name *</label>
                    <input 
                      type="text"
                      value={awbModalOrder.customerName || addr.fullName || ''}
                      onChange={(e) => setAwbModalOrder({ ...awbModalOrder, customerName: e.target.value })}
                      placeholder="Full Customer Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">10-Digit Mobile *</label>
                    <input 
                      type="tel"
                      maxLength={10}
                      value={(awbModalOrder.customerPhone || addr.phone || '').replace(/\D/g, '')}
                      onChange={(e) => setAwbModalOrder({ ...awbModalOrder, customerPhone: e.target.value })}
                      placeholder="8591719499"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-400 font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Address Line (House / Building / Street) *</label>
                    <input 
                      type="text"
                      value={addr.addressLine || addr.addressLine1 || awbModalOrder.addressLine || ''}
                      onChange={(e) => setAwbModalOrder({
                        ...awbModalOrder,
                        shippingAddress: { ...(awbModalOrder.shippingAddress || {}), addressLine: e.target.value, addressLine1: e.target.value }
                      })}
                      placeholder="Flat 402, Building, Street Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">City *</label>
                    <input 
                      type="text"
                      value={addr.city || awbModalOrder.city || ''}
                      onChange={(e) => setAwbModalOrder({
                        ...awbModalOrder,
                        shippingAddress: { ...(awbModalOrder.shippingAddress || {}), city: e.target.value }
                      })}
                      placeholder="Mumbai"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">State *</label>
                    <input 
                      type="text"
                      value={addr.state || awbModalOrder.state || ''}
                      onChange={(e) => setAwbModalOrder({
                        ...awbModalOrder,
                        shippingAddress: { ...(awbModalOrder.shippingAddress || {}), state: e.target.value }
                      })}
                      placeholder="Maharashtra"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block mb-1">6-Digit Indian Pincode *</label>
                    <input 
                      type="text"
                      maxLength={6}
                      value={String(addr.pincode || addr.postalCode || awbModalOrder.pincode || '').replace(/\D/g, '')}
                      onChange={(e) => setAwbModalOrder({
                        ...awbModalOrder,
                        shippingAddress: { ...(awbModalOrder.shippingAddress || {}), pincode: e.target.value, postalCode: e.target.value }
                      })}
                      placeholder="400053"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-amber-400 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Courier Partner & AWB Section */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1.5">Courier Partner</label>
                  <select
                    value={inputCourier}
                    onChange={(e) => setInputCourier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold cursor-pointer"
                  >
                    <option value="Delhivery Logistics">Delhivery Logistics</option>
                    <option value="BlueDart Express">BlueDart Express</option>
                    <option value="Ecom Express">Ecom Express</option>
                    <option value="DTDC Express">DTDC Express</option>
                    <option value="Shadowfax">Shadowfax Courier</option>
                    <option value="XpressBees">XpressBees Courier</option>
                    <option value="SAGAR / KAMTI Express">SAGAR / KAMTI Express Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1.5">AWB Tracking Number</label>
                  <input 
                    type="text"
                    placeholder="e.g. AWB-DELHIVERY-998811"
                    value={inputAwb} 
                    onChange={(e) => setInputAwb(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setAwbModalOrder(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveAwbFulfillment}
                  disabled={!addrCheck.isComplete}
                  className={`font-black text-xs px-5 py-2.5 rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 transition ${
                    addrCheck.isComplete
                      ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Update Order</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Barcode Print Label Modal */}
      {barcodeProduct && (
        <BarcodePrintLabelModal
          isOpen={!!barcodeProduct}
          onClose={() => setBarcodeProduct(null)}
          product={barcodeProduct}
        />
      )}

      {/* Order Details Modal / Drawer */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-slate-100 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Order Details:</span>
                  <span className="font-mono text-orange-400">#{selectedOrderDetails.id}</span>
                </h3>
                <p className="text-xs text-slate-400">Placed on {selectedOrderDetails.date || selectedOrderDetails.createdAt}</p>
              </div>

              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                <span className="font-black text-orange-400 uppercase tracking-wider text-[10px] block">👤 Customer Info</span>
                <div className="font-bold text-white text-sm">{selectedOrderDetails.customerName}</div>
                <div className="text-slate-400 font-mono">{selectedOrderDetails.customerPhone || '+91 8591719499'}</div>
                <div className="text-slate-400">{selectedOrderDetails.customerEmail}</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                <span className="font-black text-orange-400 uppercase tracking-wider text-[10px] block">📍 Delivery Address</span>
                <div className="text-slate-200 font-medium">{selectedOrderDetails.shippingAddress?.addressLine || 'Flat 402, Sai Heights'}</div>
                <div className="text-slate-400">
                  {selectedOrderDetails.shippingAddress?.city || 'Mumbai'}, {selectedOrderDetails.shippingAddress?.state || 'Maharashtra'} - {selectedOrderDetails.shippingAddress?.pincode || '400053'}
                </div>
              </div>
            </div>

            {/* Courier & Shipping Details */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fulfillment Courier</span>
                <div className="font-bold text-white mt-0.5">{selectedOrderDetails.courierName || 'Delhivery Logistics'}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AWB Tracking Number</span>
                <div className="font-mono font-bold text-emerald-400 mt-0.5">{selectedOrderDetails.trackingNumber || 'Pending'}</div>
              </div>

              <button
                onClick={() => handleOpenAwbModal(selectedOrderDetails)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-orange-400 px-3 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer"
              >
                Change Courier
              </button>
            </div>

            {/* Itemized Products List */}
            <div className="space-y-3">
              <span className="font-black text-white text-xs uppercase tracking-wider block">📦 Ordered Spare Parts ({selectedOrderDetails.items?.length || 1})</span>
              
              <div className="space-y-2">
                {(selectedOrderDetails.items || []).map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-900" />
                      <div>
                        <div className="font-bold text-white text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Part No: {item.partNumber} • Brand: {item.brand}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-emerald-400 font-black text-sm">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      <div className="text-slate-400 text-[10px]">{item.quantity} Qty x ₹{Number(item.price).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status Summary */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Subtotal (Items):</span>
                <span className="font-mono text-white font-bold">₹{Number(selectedOrderDetails.totalAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>GST Tax (18% Included):</span>
                <span className="font-mono text-slate-300">₹{Number(selectedOrderDetails.taxAmount || 600).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Delivery Shipping:</span>
                <span className="text-emerald-400 font-bold">FREE Delivery</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-black">
                <span className="text-white">Total Amount Paid:</span>
                <span className="text-emerald-400 font-mono text-lg">₹{Number(selectedOrderDetails.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions Sticky Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => sendWhatsAppStatusUpdate(selectedOrderDetails)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Alert</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-700 cursor-pointer transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 cursor-pointer transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

