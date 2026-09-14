import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Home, ShoppingBag, Grid, Layers, Package, Car, Search, ShoppingCart, 
  CreditCard, CheckCircle, Truck, User, Info, PhoneCall, ShieldCheck, 
  RotateCcw, Lock, FileText, HelpCircle, BookOpen, LayoutDashboard, 
  ArrowRight, ExternalLink, Sparkles, Filter, Wrench, Shield, Check
} from 'lucide-react';

export const SitemapView = () => {
  const { navigateTo } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const sitemapData = [
    // PUBLIC CUSTOMER PAGES
    {
      id: 'home',
      title: 'Home Page',
      hindiTitle: 'होम पेज (मुख्य पृष्ठ)',
      section: 'public',
      route: 'home',
      icon: <Home className="w-5 h-5 text-blue-500" />,
      description: 'Landing page with OEM brands, hero banner, vehicle selector widget, trending categories, top sellers, and AI assistant prompt.',
      status: 'Ready',
      subpages: ['Hero Banner', 'Quick Parts Finder', 'Brand Bar', 'Top Categories Grid', 'Featured Products', 'Trust Badges']
    },
    {
      id: 'shop',
      title: 'Shop / All Categories Catalog',
      hindiTitle: 'शॉप / ऑल कैटेगरीज (पूरा कैटलॉग)',
      section: 'public',
      route: 'catalog',
      icon: <ShoppingBag className="w-5 h-5 text-indigo-500" />,
      description: 'Unified catalog page displaying all spare parts & accessories with live search, vehicle fitment filters, price sorting & brand tags.',
      status: 'Ready',
      subpages: ['All Categories', 'Brand Filter', 'Vehicle Fitment Filter', 'Sort By Price/Rating', 'Product Cards']
    },
    {
      id: 'category-engine',
      title: 'Category Page — Engine Parts',
      hindiTitle: 'कैटेगरी पेज — इंजन पार्ट्स',
      section: 'public',
      route: 'category',
      categorySlug: 'engine-parts',
      icon: <Wrench className="w-5 h-5 text-red-500" />,
      description: 'Dedicated category page for Engine Assembly, Pistons, Gaskets, Timing Belts, Spark Plugs, and Valves with spec filters.',
      status: 'Ready',
      subpages: ['Pistons & Rings', 'Gaskets & Seals', 'Timing Belts & Chains', 'Valves & Camshafts', 'Engine Oil Filters']
    },
    {
      id: 'category-oils',
      title: 'Category Page — Oils & Fluids',
      hindiTitle: 'कैटेगरी पेज — ऑयल्स और लिक्विड्स',
      section: 'public',
      route: 'category',
      categorySlug: 'oils-fluids',
      icon: <Layers className="w-5 h-5 text-amber-500" />,
      description: 'Synthetic & Mineral Engine Oils (5W-30, 20W-50), DOT 4 Brake Fluids, Radiator Coolants, Transmission Oils.',
      status: 'Ready',
      subpages: ['5W-30 Engine Oil', '15W-40 Diesel Oil', 'Brake Fluid DOT 4', 'Radiator Coolant', 'Gear Oil']
    },
    {
      id: 'category-brakes',
      title: 'Category Page — Brakes & Suspension',
      hindiTitle: 'कैटेगरी पेज — ब्रेक और सस्पेंशन',
      section: 'public',
      route: 'category',
      categorySlug: 'brakes',
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      description: 'Brake Pads, Brake Rotors/Discs, Brake Drums, Master Cylinders, Shock Absorbers & Struts.',
      status: 'Ready',
      subpages: ['Front Brake Pads', 'Rear Brake Shoes', 'Brake Discs / Rotors', 'Shock Absorbers', 'Lower Arms']
    },
    {
      id: 'category-filters',
      title: 'Category Page — Filters & Service Kits',
      hindiTitle: 'कैटेगरी पेज — फिल्टर एवं सर्विस किट्स',
      section: 'public',
      route: 'category',
      categorySlug: 'filters',
      icon: <Filter className="w-5 h-5 text-cyan-500" />,
      description: 'Air Filters, Cabin AC Filters, Fuel Filters, Oil Filters & Complete Periodic Service Bundles.',
      status: 'Ready',
      subpages: ['Air Filters', 'Cabin AC Filters', 'Fuel Filters', 'Periodic Service Combo Kits']
    },
    {
      id: 'category-body',
      title: 'Category Page — Body & Bumper',
      hindiTitle: 'कैटेगरी पेज — बॉडी पार्ट्स व बम्पर',
      section: 'public',
      route: 'category',
      categorySlug: 'body-bumper',
      icon: <Grid className="w-5 h-5 text-purple-500" />,
      description: 'Front/Rear Bumpers, Side Mirrors, Headlight Assemblies, Tail Lamps, Fenders & Grilles.',
      status: 'Ready',
      subpages: ['Front Bumpers', 'Headlights & LED Bulbs', 'Side Door Mirrors', 'Tail Light Assemblies']
    },
    {
      id: 'category-electrical',
      title: 'Category Page — Electrical & Ignition',
      hindiTitle: 'कैटेगरी पेज — इलेक्ट्रिकल व इग्निशन',
      section: 'public',
      route: 'category',
      categorySlug: 'electrical',
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      description: 'Car Batteries, Alternators, Starter Motors, Horns, Fuses, Relays, and Ignition Coils.',
      status: 'Ready',
      subpages: ['Car Batteries', 'Starter Motors', 'Alternators', 'Ignition Coils', 'Horns']
    },
    {
      id: 'category-accessories',
      title: 'Category Page — Accessories & Care',
      hindiTitle: 'कैटेगरी पेज — एक्सेसरीज और कार केयर',
      section: 'public',
      route: 'category',
      categorySlug: 'accessories',
      icon: <Package className="w-5 h-5 text-pink-500" />,
      description: 'Mobile Holders, Dash Cams, 7D Floor Mats, Seat Covers, Car Shampoos, Polishes & Cleaning Cloths.',
      status: 'Ready',
      subpages: ['Mobile Phone Holders', '4K Dash Cameras', '7D Leather Mats', 'Car Wash Shampoos']
    },
    {
      id: 'sub-category',
      title: 'Sub-Category Page (Pistons, Gaskets, Belts)',
      hindiTitle: 'सब-कैटेगरी पेज (पिस्टन, गैस्केट, बेल्ट्स)',
      section: 'public',
      route: 'category',
      categorySlug: 'engine-parts',
      icon: <Layers className="w-5 h-5 text-teal-500" />,
      description: 'Hierarchical sub-category drilling: Engine Parts > Pistons, Gaskets, Timing Belts.',
      status: 'Ready',
      subpages: ['Engine Parts > Pistons', 'Engine Parts > Cylinder Head Gasket', 'Engine Parts > Timing Belt Kit']
    },
    {
      id: 'product-detail',
      title: 'Product Page (Single Product Detail)',
      hindiTitle: 'प्रोडक्ट डिटेल पेज (एक पार्ट की पूरी जानकारी)',
      section: 'public',
      route: 'product-detail',
      icon: <Package className="w-5 h-5 text-blue-600" />,
      description: 'Detailed specifications, OEM part numbers, vehicle compatibility list, stock status, delivery pincode checker, customer reviews & Q&A.',
      status: 'Ready',
      subpages: ['Image Gallery', 'OEM Compatibility Table', 'Pincode Delivery Check', 'Technical Specs', 'Reviews & Ratings', 'Q&A']
    },
    {
      id: 'vehicle-selector',
      title: 'Vehicle Selector — "Apni Car Chuno"',
      hindiTitle: 'व्हीकल सेलेक्टर (अपनी कार चुनो)',
      section: 'public',
      route: 'car-select',
      icon: <Car className="w-5 h-5 text-emerald-600" />,
      description: 'Interactive Car & Bike Garage modal / standalone page to select Brand (Maruti, Hyundai), Model (Swift, Creta), Year, and Engine Variant.',
      status: 'Ready',
      subpages: ['Step 1: Select Brand', 'Step 2: Select Model', 'Step 3: Select Year', 'Step 4: Variant Engine', 'Garage Persistence']
    },
    {
      id: 'search-results',
      title: 'Search Results Page',
      hindiTitle: 'सर्च रिजल्ट्स पेज',
      section: 'public',
      route: 'search',
      icon: <Search className="w-5 h-5 text-indigo-600" />,
      description: 'Instant multi-attribute search results matching keyword, part number, car model, or OEM brand code with live filter badges.',
      status: 'Ready',
      subpages: ['Part Number Match', 'Exact Car Model Filters', 'Brand Highlights', 'Zero-Result Recommendations']
    },
    {
      id: 'cart-page',
      title: 'Cart Page & Slide-Out Drawer',
      hindiTitle: 'कार्ट पेज और स्लाइड-आउट ड्रॉर',
      section: 'public',
      route: 'cart',
      icon: <ShoppingCart className="w-5 h-5 text-green-600" />,
      description: 'View added spare parts, update quantities, enter promo discount codes, check delivery estimate, and proceed to checkout.',
      status: 'Ready',
      subpages: ['Item List', 'Fitment Verification Alert', 'Coupon Code Input', 'GST Invoice Toggle', 'Subtotal & Delivery Fee']
    },
    {
      id: 'checkout-page',
      title: 'Checkout Page',
      hindiTitle: 'चेकआउट पेज (ऑर्डर प्लेसमेंट)',
      section: 'public',
      route: 'checkout',
      icon: <CreditCard className="w-5 h-5 text-violet-600" />,
      description: 'Shipping address form, Pincode auto-fill, Payment mode (UPI, Credit/Debit Card, Netbanking, COD), and vehicle fitment confirmation.',
      status: 'Ready',
      subpages: ['Guest & Saved User Address', 'Pincode Validation', 'Payment Methods (UPI/COD/Cards)', 'Order Summary']
    },
    {
      id: 'order-confirm',
      title: 'Order Confirmation / Thank You Page',
      hindiTitle: 'ऑर्डर कन्फर्मेशन / थैंक यू पेज',
      section: 'public',
      route: 'order-confirm',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      description: 'Order success message with Order ID, AWB Tracking number, estimated delivery date, summary invoice & track order link.',
      status: 'Ready',
      subpages: ['Order ID Generation', 'Estimated Delivery Time', 'Download Invoice PDF', 'WhatsApp Tracking Link']
    },
    {
      id: 'track-order',
      title: 'Track Order Page',
      hindiTitle: 'ट्रैक ऑर्डर पेज (लाइव कूरियर स्टेटस)',
      section: 'public',
      route: 'track-order',
      icon: <Truck className="w-5 h-5 text-sky-500" />,
      description: 'Public order tracking page using Order ID & Mobile number to trace courier shipment status (Delhivery, Bluedart, Xpressbees).',
      status: 'Ready',
      subpages: ['Order Lookup Form', 'Timeline Progress Bar', 'Dispatch Details', 'Support Helpline Call']
    },
    {
      id: 'my-account',
      title: 'My Account / Customer Portal',
      hindiTitle: 'माई अकाउंट (ऑर्डर हिस्ट्री व गैराज)',
      section: 'public',
      route: 'my-account',
      icon: <User className="w-5 h-5 text-orange-500" />,
      description: 'Customer dashboard displaying Order History, Track Shipments, Saved Garage Vehicles, Returns & Replacements, Wishlist, and Profile Settings.',
      status: 'Ready',
      subpages: ['My Orders', 'Saved Garage Vehicles', 'My Returns & Refunds', 'Saved Addresses', 'Wishlist Items', 'GST Details']
    },
    {
      id: 'about-us',
      title: 'About Us Page',
      hindiTitle: 'अबाउट अस पेज (कंपनी की जानकारी)',
      section: 'public',
      route: 'about',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      description: 'Company vision, OEM distribution partnerships (Bosch, Uno Minda, Mobil, Castrol), pan-India logistics network & customer trust stats.',
      status: 'Ready',
      subpages: ['Company Mission', 'Authorized Brand Distributorships', 'Logistics Warehouses', 'Quality Assurance']
    },
    {
      id: 'contact-us',
      title: 'Contact Us Page',
      hindiTitle: 'कांटेक्ट अस पेज (सपोर्ट व हेल्पलाइन)',
      section: 'public',
      route: 'contact',
      icon: <PhoneCall className="w-5 h-5 text-green-500" />,
      description: 'Toll-free customer care helpline, WhatsApp instant assistance, technical support form, email addresses & warehouse location map.',
      status: 'Ready',
      subpages: ['Toll-free Hotline (1800-AZ-INDIA)', 'WhatsApp Chat Button', 'Support Inquiry Form', 'Warehouse Address']
    },
    {
      id: 'shipping-policy',
      title: 'Shipping & Delivery Policy Page',
      hindiTitle: 'शिपिंग और डिलीवरी पॉलिसी',
      section: 'public',
      route: 'shipping-policy',
      icon: <Truck className="w-5 h-5 text-cyan-600" />,
      description: 'Delivery timelines (2-4 days metro, 4-7 days rest of India), express shipping rates, logistics partners, and dispatch guidelines.',
      status: 'Ready',
      subpages: ['Delivery Timeframes', 'Shipping Charges', 'Damaged Package In-Transit Guidelines', 'Non-Deliverable Pincodes']
    },
    {
      id: 'return-policy',
      title: 'Returns / Refund / Replacement Policy',
      hindiTitle: 'रिटर्न, रिफंड व रिप्लेसमेंट पॉलिसी',
      section: 'public',
      route: 'return-policy',
      icon: <RotateCcw className="w-5 h-5 text-rose-500" />,
      description: '7-Day hassle-free return policy, fitment mismatch guarantee, reverse pickup process, refund processing time & condition rules.',
      status: 'Ready',
      subpages: ['7-Day Exchange Window', 'Wrong Fitment Guarantee', 'Reverse Pickup Process', 'Refund Timelines (3-5 Business Days)']
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy Page',
      hindiTitle: 'प्राइवेसी पॉलिसी (डेटा सुरक्षा)',
      section: 'public',
      route: 'privacy-policy',
      icon: <Lock className="w-5 h-5 text-slate-600" />,
      description: 'Detailed user data privacy policy, payment security protocols, cookie usages, data protection compliance and user rights.',
      status: 'Ready',
      subpages: ['Data Collection', 'Payment Security Encryption', 'Cookie Policy', 'Third-Party Sharing Prohibition']
    },
    {
      id: 'terms-conditions',
      title: 'Terms & Conditions Page',
      hindiTitle: 'टर्म्स एंड कंडीशंस (नियम व शर्तें)',
      section: 'public',
      route: 'terms',
      icon: <FileText className="w-5 h-5 text-slate-500" />,
      description: 'Terms of service, warranty limitations, user obligations, pricing policy, seller disclaimers, and legal jurisdiction rules.',
      status: 'Ready',
      subpages: ['Terms of Use', 'Warranty Disclaimer', 'Intellectual Property', 'Legal Jurisdiction']
    },
    {
      id: 'faq-page',
      title: 'FAQ (Frequently Asked Questions)',
      hindiTitle: 'एफएक्यू (अक्सर पूछे जाने वाले सवाल)',
      section: 'public',
      route: 'faq',
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
      description: 'Categorized FAQs covering Fitment Verification, Order Tracking, Delivery, Payment Modes, GST Invoicing, and Returns.',
      status: 'Ready',
      subpages: ['Fitment FAQs', 'Payment & Invoice FAQs', 'Shipping & Delivery FAQs', 'Return & Refund FAQs']
    },
    {
      id: 'blog-page',
      title: 'Blog (Car Maintenance & Fitting Tips)',
      hindiTitle: 'ब्लॉग पेज (कार मेंटेनेंस गाइड्स व टिप्स)',
      section: 'public',
      route: 'blog-listing',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      description: 'SEO-rich automotive blog with car maintenance tips, engine oil selection guides, DIY replacement tutorials, and safety tips.',
      status: 'Ready',
      subpages: ['Car Maintenance Articles', 'DIY Installation Guides', 'Synthetic Oil Comparison', 'SEO Keywords & Author Specs']
    },

    // ADMIN PANEL PAGES
    {
      id: 'admin-dashboard',
      title: 'Admin Dashboard Overview',
      hindiTitle: 'एडमिन डैशबोर्ड ओवरव्यू',
      section: 'admin',
      route: 'admin-dashboard',
      icon: <LayoutDashboard className="w-5 h-5 text-purple-600" />,
      description: 'Centralized admin control center displaying daily sales metrics, total orders, revenue charts, low stock alerts & quick actions.',
      status: 'Ready',
      subpages: ['Sales Revenue Metrics', 'Recent Orders Table', 'Low Stock Warnings', 'Top Selling Parts']
    },
    {
      id: 'admin-catalog',
      title: 'Admin Catalog & Parts Manager',
      hindiTitle: 'एडमिन कैटलॉग व स्पेयर पार्ट्स मैनेजर',
      section: 'admin',
      route: 'catalog-manager',
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      description: 'Create, edit, and manage spare parts listings, OEM part numbers, price points, stock counts, compatibility mapping & images.',
      status: 'Ready',
      subpages: ['Add New Spare Part', 'Edit Product Listing', 'CSV Bulk Import/Export', 'Fitment Mapping Matrix']
    },
    {
      id: 'admin-inventory',
      title: 'Admin Inventory & Warehouse Console',
      hindiTitle: 'एडमिन इन्वेंट्री व वेयरहाउस कंसोल',
      section: 'admin',
      route: 'inventory',
      icon: <Grid className="w-5 h-5 text-amber-600" />,
      description: 'Real-time warehouse inventory tracking, low-stock threshold alerts, stock adjustments, and bin-location management.',
      status: 'Ready',
      subpages: ['Warehouse Stock Levels', 'Low Stock Reorder Alerts', 'Stock Audit Logs', 'Supplier Purchase Orders']
    },
    {
      id: 'admin-orders',
      title: 'Admin Orders & Fulfillment Manager',
      hindiTitle: 'एडमिन ऑर्डर्स व फुलफिलमेंट मैनेजर',
      section: 'admin',
      route: 'fulfillment',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      description: 'Process customer orders, print packing slips & tax invoices, assign AWB numbers, trigger courier pickups, and track status.',
      status: 'Ready',
      subpages: ['Pending Orders List', 'Dispatch Order', 'Print GST Invoice PDF', 'AWB Manifest Generation']
    },
    {
      id: 'admin-vehicles',
      title: 'Admin Vehicle Master Console',
      hindiTitle: 'एडमिन व्हीकल मास्टर कंसोल',
      section: 'admin',
      route: 'vehicle-master',
      icon: <Car className="w-5 h-5 text-rose-600" />,
      description: 'Manage Car & Bike Makes (Maruti, Hyundai, Tata), Models, Variants, Fuel Types & Year ranges database.',
      status: 'Ready',
      subpages: ['Car Makes Manager', 'Models & Variants Tree', 'Engine Displacement Specs', 'Fitment Rule Engine']
    }
  ];

  const filteredData = sitemapData.filter(item => {
    const matchesSection = selectedCategory === 'all' || item.section === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          item.hindiTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const publicCount = sitemapData.filter(d => d.section === 'public').length;
  const adminCount = sitemapData.filter(d => d.section === 'admin').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title Section */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
            <Layers size={320} />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-400/30">
              <Sparkles size={14} /> Official Site Architecture & Route Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              AutoZon<span className="text-blue-400">India</span> — Complete Website Sitemap
            </h1>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              हर पेज का कम्पलीट स्ट्रक्चर और नेविगेशन डायरेक्टरी। यहाँ पब्लिक कस्टमर पेजेज और एडमिन कंसोल पेजेज सब लिस्टेड हैं। किसी भी पेज पर क्लिक करके लाइव प्रीव्यू देखें।
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-blue-400">{sitemapData.length}</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Total Web Pages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-emerald-400">{publicCount}</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Public Pages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-purple-400">{adminCount}</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Admin Pages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-yellow-400">100%</div>
                <div className="text-xs text-slate-300 font-medium mt-1">Ready & Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Pages ({sitemapData.length})
            </button>
            <button
              onClick={() => setSelectedCategory('public')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === 'public'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Public Customer Pages ({publicCount})
            </button>
            <button
              onClick={() => setSelectedCategory('admin')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Admin Panel Pages ({adminCount})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search page name, description..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      {page.icon}
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1 ${
                        page.section === 'public' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {page.section === 'public' ? 'Public Customer Page' : 'Admin Console'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                    </div>
                  </div>
                  
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                    <Check size={12} /> {page.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-500 mb-3 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                  🇮🇳 {page.hindiTitle}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {page.description}
                </p>

                {/* Subpages / Components pill tags */}
                {page.subpages && (
                  <div className="mb-4 pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                      Key Modules / Components:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {page.subpages.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  navigateTo(page.route);
                }}
                className={`w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  page.section === 'public'
                    ? 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
                    : 'bg-purple-900 hover:bg-purple-700 text-white shadow-sm'
                }`}
              >
                <span>Launch {page.title}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SitemapView;
