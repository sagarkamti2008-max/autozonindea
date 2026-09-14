import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_MAKES } from '../data/vehicles';
import { BRANDS_DATABASE } from '../data/brands';
import { ProductImageUploader } from '../components/ProductImageUploader';
import {
  Package, Plus, Trash2, Edit, CheckCircle2, AlertTriangle, ShieldCheck,
  Search, RefreshCw, FileText, ArrowRight, Layers, Upload, Download, Tag,
  Copy, Eye, Save, Filter, Clock, Check, X, Car, DollarSign, Database, Image as ImageIcon, Settings
} from 'lucide-react';

export const AdminCatalogManager = ({ defaultTab = 'catalog-list' }) => {
  const { products, setProducts, showToast, categories } = useStore();

  // User Role State (Super Admin vs Catalog Staff)
  const [userRole, setUserRole] = useState('super_admin'); // 'super_admin' | 'catalog_staff'
  const [activeTab, setActiveTab] = useState(defaultTab); // 'catalog-list', 'add-product', 'categories', 'csv-import', 'audit-log'

  // Search & Filters for Product Table
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Table Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Table Column Customization (View Options)
  const [visibleColumns, setVisibleColumns] = useState({
    productInfo: true,
    sku: true,
    category: true,
    price: true,
    salePrice: true,
    taxPercent: true,
    warranty: true,
    stock: true,
    fitment: true,
    status: true,
    actions: true
  });
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // Bulk CSV Import Progress & History State
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([
    { id: 'up-101', fileName: 'Products_Batch_Sep2026.xlsx', rows: 245, status: 'Success ✓', user: 'Sagar (Super Admin)', time: '2026-09-08 14:00' },
    { id: 'up-102', fileName: 'Fitment_Matrix_Swift_Innova.csv', rows: 1420, status: 'Success ✓', user: 'Catalog Staff', time: '2026-09-05 11:30' }
  ]);

  // Inline Quick-Edit State
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlinePrice, setInlinePrice] = useState('');
  const [inlineStock, setInlineStock] = useState('');

  // Dynamic AAIA Category Taxonomy Mapping with 13 Core Automotive Categories
  const CATEGORY_TAXONOMY = {
    'Engine Parts': {
      'Air Systems & Intake': ['Engine Air Filter', 'High-Flow Cold Air Intake Filter', 'Turbo Air Hose Filter'],
      'Fuel Supply & Injection': ['In-Line Fuel Filter', 'Diesel Fuel Injector', 'Fuel Pump Assembly'],
      'Ignition & Plugs': ['Spark Plugs (Set of 4)', 'Ignition Coils', 'Glow Plugs', 'Ignition Wire Set'],
      'Engine Components': ['Engine Oil (Synthetic)', 'Timing Belt Kit', 'Water Pump Assembly', 'Engine Mount']
    },
    'Brake Parts': {
      'Brake Pads': ['Front Brake Pads', 'Rear Brake Pads', 'Ceramic Racing Brake Pads', 'Semi-Metallic Brake Pads'],
      'Brake Disc Rotors': ['Ventilated Disc Rotors', 'Solid Disc Rotors', 'Drilled & Slotted Rotors'],
      'Brake Hydraulics': ['DOT 4 Brake Fluid', 'Brake Master Cylinder', 'Brake Caliper Assembly']
    },
    'Clutch Parts': {
      'Clutch Assembly': ['Clutch Kit (Plate & Pressure)', 'Release Bearing', 'Dual Mass Flywheel'],
      'Clutch Hydraulics': ['Clutch Master Cylinder', 'Clutch Slave Cylinder', 'Clutch Cable']
    },
    'Electrical Parts': {
      'Sensors & Relays': ['O2 Oxygen Sensor', 'ABS Wheel Sensor', 'Combination Switch', 'Crankshaft Sensor'],
      'Power & Ignition': ['Starter Motor', 'Alternator Assembly', 'Electric Horn Kit']
    },
    'Suspension Parts': {
      'Shock Absorbers & Struts': ['Front Shock Absorbers', 'Rear Shock Absorbers', 'Strut Assembly'],
      'Control Arms & Links': ['Lower Control Arm', 'Sway Bar Link', 'Tie Rod End', 'Coil Spring']
    },
    'Steering Parts': {
      'Steering Assemblies': ['Power Steering Rack Assembly', 'Power Steering Pump', 'Tie Rod End Set'],
      'Steering Column': ['Steering Shaft', 'Steering Column Lock', 'EPS Module']
    },
    'Body Parts': {
      'Wiper Blades': ['Frameless Wiper Blades', 'Hybrid Wiper Blades', 'Rear Wiper Blade'],
      'Body Panels & Trims': ['Front Bumper', 'Fender Lining', 'Side View Mirror', 'Headlight Bracket']
    },
    'Filters': {
      'Air Filters': ['Engine Air Filter', 'High-Flow Performance Air Filter', 'Cold Air Intake Filter'],
      'Oil Filters': ['Spin-On Oil Filter', 'Cartridge Oil Filter', 'Heavy Duty Oil Filter'],
      'Cabin AC Filters': ['Standard Cabin AC Filter', 'Activated Carbon Filter', 'HEPA Anti-Bacterial Cabin Filter'],
      'Fuel Filters': ['In-Line Fuel Filter', 'Diesel Fuel Filter Assembly', 'Petrol Fuel Filter']
    },
    'Lights': {
      'Headlamp Assemblies': ['LED Headlight Bulbs', 'Projector Headlamps', 'Fog Lamp Kits', 'Tail Light Assembly'],
      'Auxiliary & Signal': ['Turn Signal Lamps', 'Interior Ambient Lighting', 'DRL Daytime Running Lights']
    },
    'Car Accessories': {
      'Interior Comfort': ['7D Custom Floor Mats', '360 Mobile Holder', 'Seat Covers', 'Sun Shades'],
      'Car Care & Detailing': ['Microfiber Cloth', 'Dashboard Polish', 'Car Shampoo', 'Car Perfume']
    },
    'Tyres': {
      'Radial Tyres': ['15-Inch Radial Tubeless Tyre', '16-Inch SUV Tyre', 'High Performance Sport Tyre'],
      'Spare & Tubes': ['Compact Spare Wheel', 'Heavy Duty Inner Tube']
    },
    'Batteries': {
      '12V Automotive Batteries': ['Maintenance-Free 12V 35Ah Battery', 'Heavy Duty 45Ah SUV Battery', 'AGM Start-Stop Battery'],
      'Battery Accessories': ['Jumper Cables', 'Battery Terminal Clamps', 'Smart Battery Charger']
    },
    'Lubricants': {
      'Engine Lubricants': ['Synthetic Engine Oil 5W-30', '15W-40 Diesel Engine Oil', '0W-20 Eco Synthetic Oil'],
      'Fluids & Coolants': ['Radiator Coolant Concentrate', 'Transmission Fluid ATF', 'Gear Oil 80W-90', 'Brake Fluid DOT 4']
    }
  };

  // State for Collapsible Secondary Technical Fields (SKU, MPN, OEM Numbers)
  const [showOptionalTechFields, setShowOptionalTechFields] = useState(false);
  const [skuSearchQuery, setSkuSearchQuery] = useState('');
  const [showSkuAutofillDropdown, setShowSkuAutofillDropdown] = useState(false);

  // 3-Level AAIA Category Taxonomy State (13 Core Automotive Categories)
  const [categoryTree, setCategoryTree] = useState([
    { id: 'cat-engine', name: 'Engine Parts', subCategories: [{ id: 'sub-air', name: 'Air Systems & Intake', partTypes: ['Engine Air Filter', 'Turbo Air Hose'] }] },
    { id: 'cat-brakes', name: 'Brake Parts', subCategories: [{ id: 'sub-pads', name: 'Brake Pads', partTypes: ['Front Brake Pads', 'Rear Brake Pads'] }] },
    { id: 'cat-clutch', name: 'Clutch Parts', subCategories: [{ id: 'sub-clutch-kit', name: 'Clutch Assembly', partTypes: ['Clutch Kit', 'Release Bearing'] }] },
    { id: 'cat-electrical', name: 'Electrical Parts', subCategories: [{ id: 'sub-sensors', name: 'Sensors & Relays', partTypes: ['O2 Sensor', 'ABS Sensor'] }] },
    { id: 'cat-suspension', name: 'Suspension Parts', subCategories: [{ id: 'sub-shocks', name: 'Shock Absorbers', partTypes: ['Front Shocks', 'Rear Shocks'] }] },
    { id: 'cat-steering', name: 'Steering Parts', subCategories: [{ id: 'sub-rack', name: 'Steering Assemblies', partTypes: ['Power Steering Rack'] }] },
    { id: 'cat-body', name: 'Body Parts', subCategories: [{ id: 'sub-wipers', name: 'Wiper Blades', partTypes: ['Frameless Wipers', 'Hybrid Wipers'] }] },
    { id: 'cat-filters', name: 'Filters', subCategories: [{ id: 'sub-filters-all', name: 'Air & Oil Filters', partTypes: ['Engine Air Filter', 'Spin-On Oil Filter'] }] },
    { id: 'cat-lights', name: 'Lights', subCategories: [{ id: 'sub-headlights', name: 'Headlamp Assemblies', partTypes: ['LED Headlight Bulbs', 'Fog Lamps'] }] },
    { id: 'cat-accessories', name: 'Car Accessories', subCategories: [{ id: 'sub-interior', name: 'Interior Comfort', partTypes: ['7D Floor Mats', 'Mobile Holder'] }] },
    { id: 'cat-tyres', name: 'Tyres', subCategories: [{ id: 'sub-radial', name: 'Radial Tyres', partTypes: ['15-Inch Tubeless', '16-Inch SUV Tyre'] }] },
    { id: 'cat-batteries', name: 'Batteries', subCategories: [{ id: 'sub-bat-12v', name: '12V Automotive Batteries', partTypes: ['35Ah Battery', '45Ah SUV Battery'] }] },
    { id: 'cat-lubricants', name: 'Lubricants', subCategories: [{ id: 'sub-oils', name: 'Engine Lubricants', partTypes: ['Synthetic Oil 5W-30', 'Brake Fluid DOT 4'] }] }
  ]);

  // Form State for Adding / Editing Product
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    // Basic Info
    title: '',
    sku: '',
    brand: 'Bosch',
    mpn: '',
    oemNumbers: '',
    category: 'Engine Parts',
    subCategory: 'Air Systems & Intake',
    partType: 'Engine Air Filter',
    shortDescription: '',
    longDescription: '',
    condition: 'New',

    // Fitment
    isUniversal: false,
    fitments: [
      { id: 'compat-001', vehicle_id: 'v801a1e2-1001-4000-8000-000000000001', make: 'Maruti', model: 'Swift', variant: 'VXi', yearFrom: '2018', yearTo: '2024', fuelType: 'Petrol', transmission: 'Manual', notes: 'Front Axle Disc Brake Pad Fitment for 2018-2024 Swift' }
    ],

    // Pricing, Tax & Inventory Control (Postgres Schema Parity)
    mrp: '',
    sellingPrice: '',
    costPrice: '',
    taxPercent: 18,
    warranty: '12 Months Manufacturer Warranty',
    categoryId: 'cat-brakes',
    brandId: 'brand-bosch',
    stock: 25,
    reservedQuantity: 3,
    lowStockThreshold: 5,
    warehouse: 'Mumbai Central Hub',

    // Media
    images: ['https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80'],
    videoUrl: '',

    // SEO & Publishing
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'Published',
    tags: 'filter, air filter, engine'
  });

  // Category Cascading Handlers
  const handleCategoryLevel1Change = (newCat) => {
    const subCatsObj = CATEGORY_TAXONOMY[newCat] || CATEGORY_TAXONOMY['Filters & Maintenance'];
    const firstSub = Object.keys(subCatsObj)[0];
    const firstPartType = subCatsObj[firstSub][0];
    setProductForm(prev => ({
      ...prev,
      category: newCat,
      subCategory: firstSub,
      partType: firstPartType
    }));
  };

  const handleCategoryLevel2Change = (newSub) => {
    const currentCatObj = CATEGORY_TAXONOMY[productForm.category] || CATEGORY_TAXONOMY['Filters & Maintenance'];
    const partTypes = currentCatObj[newSub] || ['Standard Part'];
    const firstPartType = partTypes[0];
    setProductForm(prev => ({
      ...prev,
      subCategory: newSub,
      partType: firstPartType
    }));
  };

  // Real-Time Category Mismatch Validator
  const getCategoryMismatchAlert = () => {
    if (!productForm.title) return null;
    const titleLower = productForm.title.toLowerCase();
    const cat = productForm.category;
    const sub = productForm.subCategory;

    // Air Filter in Title vs Wrong Category
    if ((titleLower.includes('air filter') || titleLower.includes('air felter') || titleLower.includes('filter')) && 
        cat !== 'Filters & Maintenance' && cat !== 'Engine & Transmission') {
      return {
        message: `⚠️ Mismatch Warning: Title contains "Air Filter", but Category is set to "${cat} > ${sub}".`,
        recommendedCat: 'Filters & Maintenance',
        recommendedSub: 'Air Filters',
        recommendedType: 'Engine Air Filter'
      };
    }

    // Brake Pad in Title vs Wrong Category
    if ((titleLower.includes('brake') || titleLower.includes('pad') || titleLower.includes('braik')) && cat !== 'Brake System') {
      return {
        message: `⚠️ Mismatch Warning: Title contains "Brake Pad", but Category is set to "${cat} > ${sub}".`,
        recommendedCat: 'Brake System',
        recommendedSub: 'Brake Pads',
        recommendedType: 'Front Brake Pads'
      };
    }

    // Spark Plug in Title vs Wrong Sub-Category
    if ((titleLower.includes('spark') || titleLower.includes('plug')) && sub !== 'Ignition & Plugs') {
      return {
        message: `⚠️ Mismatch Warning: Title contains "Spark Plug", but Sub-Category is set to "${sub}".`,
        recommendedCat: 'Engine & Transmission',
        recommendedSub: 'Ignition & Plugs',
        recommendedType: 'Spark Plugs (Set of 4)'
      };
    }

    return null;
  };

  // SKU / MPN Database Autofill Matcher
  const handleAutofillFromProductObj = (prod) => {
    setProductForm({
      title: prod.title || prod.name || '',
      sku: prod.sku || prod.partNumber || '',
      brand: prod.brand || 'Bosch',
      mpn: prod.mpn || prod.partNumber || '',
      oemNumbers: prod.oemNumber || prod.oemNumbers || '',
      category: prod.category || 'Filters & Maintenance',
      subCategory: prod.subCategory || 'Air Filters',
      partType: prod.partType || 'Engine Air Filter',
      shortDescription: prod.shortDescription || prod.description || '',
      longDescription: prod.description || '',
      condition: prod.condition || 'New',
      isUniversal: prod.isUniversal || false,
      fitments: prod.fitments && prod.fitments.length > 0 ? prod.fitments : [{ make: 'Toyota', model: 'Innova Crysta', yearFrom: '2016', yearTo: '2026', variant: '2.4L Diesel VX', engineType: '2GD-FTV' }],
      mrp: prod.price || prod.mrp || '',
      sellingPrice: prod.sale_price || prod.price || '',
      costPrice: prod.costPrice || '',
      taxPercent: prod.tax_percent || prod.taxPercent || 18,
      warranty: prod.warranty || '12 Months Manufacturer Warranty',
      categoryId: prod.category_id || prod.categoryId || 'cat-brakes',
      brandId: prod.brand_id || prod.brandId || 'brand-bosch',
      stock: prod.stock || 25,
      lowStockThreshold: prod.lowStockThreshold || 5,
      warehouse: prod.warehouse || 'Mumbai Central Hub',
      images: prod.images || [prod.image || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80'],
      videoUrl: prod.videoUrl || '',
      slug: prod.slug || '',
      metaTitle: prod.metaTitle || '',
      metaDescription: prod.metaDescription || '',
      status: prod.status || 'Published',
      tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : 'spare, part'
    });
    setShowSkuAutofillDropdown(false);
    showToast(`⚡ Auto-filled Brand, Category, Fitments & Prices from catalog database for "${prod.title}"!`);
  };

  // Real-Time Fitment Conflict Checker (Year Range)
  const validateFitmentYearRange = (fit) => {
    const from = parseInt(fit.yearFrom, 10);
    const to = parseInt(fit.yearTo, 10);
    if (!isNaN(from) && !isNaN(to) && from > to) {
      return `⚠️ Conflict: Year From (${fit.yearFrom}) cannot be after Year To (${fit.yearTo})!`;
    }
    return null;
  };

  // Title Auto-Correction & Suggestion Helper
  const getTitleCorrections = (title) => {
    if (!title) return null;
    const lower = title.toLowerCase();

    // Check common misspellings
    if (lower.includes('feltr') || lower.includes('felter')) {
      return title.replace(/feltr|felter/gi, 'Filter');
    }
    if (lower.includes('braik') || lower.includes('brak')) {
      return title.replace(/braik|brak/gi, 'Brake');
    }
    if (lower.includes('sparc') || lower.includes('sparkplug')) {
      return title.replace(/sparc|sparkplug/gi, 'Spark Plug');
    }
    if (lower.includes('indica') || lower.includes('innov')) {
      // auto-capitalize car names if typed lowercase
      return title.replace(/\b(innova|swift|baleno|creta|fortuner|city|verna)\b/gi, (match) => match.charAt(0).toUpperCase() + match.slice(1));
    }
    return null;
  };

  // Validation Warnings State
  const [skuWarning, setSkuWarning] = useState('');
  const [priceWarning, setPriceWarning] = useState('');
  const [copyFromProduct, setCopyFromProduct] = useState('');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-101', action: 'PRODUCT_CREATED', details: 'Added Bosch Super 4 Spark Plugs (SKU: BOSCH-SP-FR7DC)', user: 'Sagar (Super Admin)', timestamp: '2026-09-10 10:15 AM' },
    { id: 'log-102', action: 'FITMENT_UPDATED', details: 'Added 4 new Maruti Swift fitment rows to Uno Minda LED Kit', user: 'Catalog Staff', timestamp: '2026-09-09 04:30 PM' },
    { id: 'log-103', action: 'BULK_CSV_IMPORT', details: 'Imported 45 OEM Filter SKUs via CSV', user: 'Sagar (Super Admin)', timestamp: '2026-09-08 02:00 PM' }
  ]);

  // Autosave Draft Timer Effect
  useEffect(() => {
    const draftTimer = setTimeout(() => {
      if (productForm.title && !editingProductId) {
        localStorage.setItem('autozon_product_draft', JSON.stringify(productForm));
      }
    }, 2000);
    return () => clearTimeout(draftTimer);
  }, [productForm, editingProductId]);

  // Title change -> Slug generator
  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const metaTitle = `${title} - Buy Online | AutoZon India`;
    setProductForm(prev => ({ ...prev, title, slug, metaTitle }));
  };

  // Local Image File Upload Handler (Computer / Phone file picker)
  const handleImageFileUpload = (e) => {
    const files = Array.from(e.target?.files || e.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, base64Data]
        }));
      };
      reader.readAsDataURL(file);
    });
    showToast(`🖼️ ${files.length} Image file(s) uploaded successfully!`);
  };

  // SKU check
  const handleSkuChange = (sku) => {
    const upperSku = sku.trim().toUpperCase();
    const isDuplicate = products.some(p => (p.sku?.toUpperCase() === upperSku || p.partNumber?.toUpperCase() === upperSku) && p.id !== editingProductId);
    if (isDuplicate) {
      setSkuWarning(`❌ Warning: SKU / MPN "${upperSku}" already exists in store catalog.`);
    } else {
      setSkuWarning('');
    }
    setProductForm(prev => ({ ...prev, sku: upperSku }));
  };

  // Price validation check
  const handlePriceChange = (sellingPrice, mrp) => {
    const sPrice = parseFloat(sellingPrice) || 0;
    const mPrice = parseFloat(mrp) || 0;
    if (mPrice > 0 && sPrice > mPrice) {
      setPriceWarning('⚠️ Warning: Selling Price cannot be greater than MRP!');
    } else {
      setPriceWarning('');
    }
  };

  // Fitment handlers
  const handleAddFitmentRow = () => {
    setProductForm(prev => ({
      ...prev,
      fitments: [...prev.fitments, {
        id: `compat-${Date.now()}`,
        vehicle_id: `v801a1e2-${Math.floor(1000 + Math.random() * 9000)}-4000-8000-000000000000`,
        make: 'Maruti',
        model: 'Swift',
        variant: 'VXi',
        yearFrom: '2018',
        yearTo: '2024',
        fuelType: 'Petrol',
        transmission: 'Manual',
        notes: 'Front Axle Fitment for 2018-2024 Swift VXi'
      }]
    }));
  };

  const handleRemoveFitmentRow = (index) => {
    setProductForm(prev => ({
      ...prev,
      fitments: prev.fitments.filter((_, i) => i !== index)
    }));
  };

  const handleFitmentChange = (index, field, value) => {
    const updated = [...productForm.fitments];
    updated[index][field] = value;
    setProductForm(prev => ({ ...prev, fitments: updated }));
  };

  // Copy Fitment from another product
  const handleCopyFitmentFromProduct = (productId) => {
    setCopyFromProduct(productId);
    const target = products.find(p => p.id === productId);
    if (target && target.fitments) {
      setProductForm(prev => ({ ...prev, fitments: JSON.parse(JSON.stringify(target.fitments)) }));
      showToast(`📋 Fitment list copied from "${target.title}"!`);
    } else {
      showToast('ℹ️ Default 100% Fitment template applied.');
    }
  };

  // Save Product (Draft vs Published based on Role)
  const handleSaveProduct = (targetStatus) => {
    // Auto-generate SKU if blank
    let generatedSku = productForm.sku.trim();
    if (!generatedSku) {
      const brandCode = (productForm.brand || 'AZ').slice(0, 3).toUpperCase();
      generatedSku = `SKU-${brandCode}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Phase 1 Validation Rules: Title, Category, Price, and at least 1 image required before publishing
    if (!productForm.title.trim() || !productForm.category || !productForm.sellingPrice) {
      showToast('❌ Phase 1 Validation Error: Title, Category, and Selling Price are required!');
      return;
    }

    if (!productForm.images || productForm.images.length === 0) {
      showToast('❌ Phase 1 Validation Error: At least 1 image is required to publish a product!');
      return;
    }

    if (skuWarning) {
      showToast('❌ Cannot save duplicate SKU. Please change the SKU code.');
      return;
    }

    const finalStatus = userRole === 'catalog_staff' && targetStatus === 'Published' ? 'Pending Review' : targetStatus;

    const isPublished = finalStatus === 'Published';
    const newProductObj = {
      id: editingProductId || `prod-${Date.now()}`,
      name: productForm.title,
      title: productForm.title,
      slug: productForm.slug || productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: generatedSku,
      category_id: productForm.categoryId || 'cat-brakes',
      brand_id: productForm.brandId || 'brand-bosch',
      description: productForm.longDescription || productForm.shortDescription,
      short_description: productForm.shortDescription,
      price: parseFloat(productForm.mrp) || parseFloat(productForm.sellingPrice) * 1.2,
      sale_price: parseFloat(productForm.sellingPrice),
      tax_percent: parseFloat(productForm.taxPercent) || 18.0,
      warranty: productForm.warranty || '12 Months Manufacturer Warranty',
      status: isPublished, // boolean for SQL schema parity (true = active/published)
      statusText: finalStatus,
      created_at: new Date().toISOString(),
      // Additional Rich Catalog properties for admin view & filters
      partNumber: productForm.mpn || generatedSku,
      mpn: productForm.mpn,
      oemNumber: productForm.oemNumbers,
      brand: productForm.brand,
      category: productForm.category,
      subCategory: productForm.subCategory,
      partType: productForm.partType,
      shortDescription: productForm.shortDescription,
      condition: productForm.condition,
      isUniversal: productForm.isUniversal,
      fitments: productForm.fitments,
      mrp: parseFloat(productForm.mrp) || parseFloat(productForm.sellingPrice) * 1.2,
      costPrice: parseFloat(productForm.costPrice) || 0,
      stock: parseInt(productForm.stock, 10) || 0,
      reservedQuantity: parseInt(productForm.reservedQuantity, 10) || 0,
      availableStock: Math.max(0, (parseInt(productForm.stock, 10) || 0) - (parseInt(productForm.reservedQuantity, 10) || 0)),
      lowStockThreshold: parseInt(productForm.lowStockThreshold, 10) || 5,
      warehouse: productForm.warehouse || 'Mumbai Central Hub',
      inventory: {
        id: `inv-${Date.now()}`,
        product_id: editingProductId || `prod-${Date.now()}`,
        quantity: parseInt(productForm.stock, 10) || 0,
        reserved_quantity: parseInt(productForm.reservedQuantity, 10) || 0,
        low_stock_limit: parseInt(productForm.lowStockThreshold, 10) || 5,
        warehouse: productForm.warehouse || 'Mumbai Central Hub',
        updated_at: new Date().toISOString()
      },
      image: productForm.images[0] || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80',
      product_compatibility: productForm.isUniversal ? [] : productForm.fitments.map((fit, fIdx) => ({
        id: fit.id || `compat-${Date.now()}-${fIdx}`,
        product_id: editingProductId || `prod-${Date.now()}`,
        vehicle_id: fit.vehicle_id || `v801a1e2-1001-4000-8000-${String(fIdx + 1).padStart(12, '0')}`,
        notes: fit.notes || `${fit.make} ${fit.model} (${fit.yearFrom || '2018'}-${fit.yearTo || '2024'}) ${fit.variant || ''} ${fit.fuelType || 'Petrol'} ${fit.transmission || 'Manual'} Fitment`
      })),
      product_images: (productForm.images || []).map((imgUrl, imgIdx) => ({
        id: `img-${Date.now()}-${imgIdx + 1}`,
        product_id: editingProductId || `prod-${Date.now()}`,
        image_url: imgUrl.startsWith('data:') ? `https://autozonindia.supabase.co/storage/v1/object/public/product-images/${editingProductId || 'prod-' + Date.now()}_img_${imgIdx + 1}.webp` : imgUrl,
        alt_text: `${productForm.title} - Photo #${imgIdx + 1} (${productForm.brand || 'AutoZon'})`,
        sort_order: imgIdx + 1,
        is_primary: imgIdx === 0
      })),
      tags: productForm.tags.split(',').map(t => t.trim()),
      updatedAt: new Date().toISOString()
    };

    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? newProductObj : p));
      showToast(`✅ Product "${newProductObj.title}" updated successfully (${finalStatus})!`);
    } else {
      setProducts([newProductObj, ...products]);
      showToast(`🎉 New Part "${newProductObj.title}" created (${finalStatus})!`);
    }

    // Add Audit Log
    const newLog = {
      id: `log-${Date.now()}`,
      action: editingProductId ? 'PRODUCT_UPDATED' : 'PRODUCT_CREATED',
      details: `${editingProductId ? 'Updated' : 'Added'} ${newProductObj.title} (SKU: ${newProductObj.sku}) - Status: ${finalStatus}`,
      user: userRole === 'super_admin' ? 'Sagar (Super Admin)' : 'Catalog Manager Staff',
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs([newLog, ...auditLogs]);

    localStorage.removeItem('autozon_product_draft');
    resetForm();
    setActiveTab('catalog-list');
  };

  const resetForm = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      sku: '',
      brand: 'Bosch',
      mpn: '',
      oemNumbers: '',
      category: 'Brake System',
      subCategory: 'Brake Pads',
      partType: 'Front Brake Pads',
      shortDescription: '',
      longDescription: '',
      condition: 'New',
      isUniversal: false,
      fitments: [{ make: 'Toyota', model: 'Innova Crysta', yearFrom: '2016', yearTo: '2026', variant: '2.4L Diesel VX', engineType: '2GD-FTV Diesel' }],
      mrp: '',
      sellingPrice: '',
      costPrice: '',
      taxPercent: 18,
      warranty: '12 Months Manufacturer Warranty',
      categoryId: 'cat-brakes',
      brandId: 'brand-bosch',
      stock: 25,
      reservedQuantity: 3,
      lowStockThreshold: 5,
      warehouse: 'Mumbai Central Hub',
      images: ['https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80'],
      videoUrl: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      status: 'Published',
      tags: 'brake, pad, ceramic'
    });
    setSkuWarning('');
    setPriceWarning('');
  };

  const handleEditProductClick = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title || prod.name || '',
      sku: prod.sku || prod.partNumber || '',
      brand: prod.brand || 'Bosch',
      mpn: prod.mpn || prod.partNumber || '',
      oemNumbers: prod.oemNumber || '',
      category: prod.category || 'Brake System',
      subCategory: prod.subCategory || 'Brake Pads',
      partType: prod.partType || 'Front Brake Pads',
      shortDescription: prod.short_description || prod.shortDescription || prod.description || '',
      longDescription: prod.description || '',
      condition: prod.condition || 'New',
      isUniversal: prod.isUniversal || false,
      fitments: prod.fitments && prod.fitments.length > 0 ? prod.fitments : [{ make: 'Toyota', model: 'Innova Crysta', yearFrom: '2016', yearTo: '2026', variant: '2.4L Diesel VX', engineType: '2GD-FTV' }],
      mrp: prod.price || prod.mrp || '',
      sellingPrice: prod.sale_price || prod.price || '',
      costPrice: prod.costPrice || '',
      taxPercent: prod.tax_percent || prod.taxPercent || 18,
      warranty: prod.warranty || '12 Months Manufacturer Warranty',
      categoryId: prod.category_id || prod.categoryId || 'cat-brakes',
      brandId: prod.brand_id || prod.brandId || 'brand-bosch',
      stock: prod.inventory?.quantity ?? (prod.stock || 0),
      reservedQuantity: prod.inventory?.reserved_quantity ?? (prod.reservedQuantity || 3),
      lowStockThreshold: prod.inventory?.low_stock_limit ?? (prod.lowStockThreshold || 5),
      warehouse: prod.inventory?.warehouse || prod.warehouse || 'Mumbai Central Hub',
      images: prod.images || [prod.image || 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80'],
      videoUrl: prod.videoUrl || '',
      slug: prod.slug || '',
      metaTitle: prod.metaTitle || '',
      metaDescription: prod.metaDescription || '',
      status: prod.status || 'Published',
      tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : 'spare, part'
    });
    setActiveTab('add-product');
  };

  // Inline quick edit save
  const handleSaveInline = (prodId) => {
    const updated = products.map(p => {
      if (p.id === prodId) {
        return {
          ...p,
          price: inlinePrice ? parseFloat(inlinePrice) : p.price,
          stock: inlineStock ? parseInt(inlineStock, 10) : p.stock
        };
      }
      return p;
    });
    setProducts(updated);
    setInlineEditingId(null);
    showToast('⚡ Quick Price & Stock inline edit saved!');
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedProductIds.length === 0) {
      showToast('❌ Please select at least one product row.');
      return;
    }

    if (action === 'delete') {
      setProducts(products.filter(p => !selectedProductIds.includes(p.id)));
      showToast(`🗑️ Deleted ${selectedProductIds.length} products.`);
    } else if (action === 'publish') {
      setProducts(products.map(p => selectedProductIds.includes(p.id) ? { ...p, status: 'Published' } : p));
      showToast(`✅ Published ${selectedProductIds.length} products.`);
    } else if (action === 'archive') {
      setProducts(products.map(p => selectedProductIds.includes(p.id) ? { ...p, status: 'Archived' } : p));
      showToast(`📁 Archived ${selectedProductIds.length} products.`);
    }
    setSelectedProductIds([]);
  };

  // Live Bulk CSV Import Handler
  const handleStartBulkImport = () => {
    setIsImporting(true);
    setImportProgress(15);
    showToast('🚀 Bulk Data Import started... Processing 242 product & fitment rows!');

    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          const newHistory = {
            id: `up-${Date.now()}`,
            fileName: 'Products_Batch_Sep2026.xlsx',
            rows: 242,
            status: 'Success ✓',
            user: userRole === 'super_admin' ? 'Sagar (Super Admin)' : 'Catalog Staff',
            time: new Date().toLocaleString()
          };
          setUploadHistory(prevHist => [newHistory, ...prevHist]);
          showToast('🎉 Bulk Batch Committed! 242 SKUs & 1,420 Fitment rows published to store.');
          setActiveTab('catalog-list');
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  // Filtered Product Table List
  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.sku || p.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesBrand = filterBrand === 'all' || p.brand === filterBrand;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesCat && matchesBrand && matchesStatus;
  });

  // Export Catalog Data to CSV Handler
  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      showToast('❌ No products available to export.');
      return;
    }

    const headers = ['ID', 'Title', 'SKU_MPN', 'Brand', 'Category', 'Selling_Price_INR', 'MRP_INR', 'Stock_Units', 'Status', 'Fitments'];
    const rows = filteredProducts.map(p => [
      `"${p.id}"`,
      `"${(p.title || p.name || '').replace(/"/g, '""')}"`,
      `"${p.sku || p.partNumber || ''}"`,
      `"${p.brand || ''}"`,
      `"${p.category || ''}"`,
      p.price || 0,
      p.mrp || 0,
      p.stock || 0,
      `"${p.status || 'Published'}"`,
      `"${p.isUniversal ? 'UNIVERSAL' : `${p.fitments?.length || 1} Cars`}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AutoZon_Product_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 Exported ${filteredProducts.length} products to CSV file!`);
  };

  // Paginated Product List Calculations
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PRD Header Control Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">AutoZon Catalog Management PRD System</h1>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  PRD v1.0 Standard
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Owner Sagar • AAIA 3-Level Taxonomy • Multi-Fitment Vehicle Matrix • Bulk CSV Pipeline
              </p>
            </div>
          </div>

          {/* User Role Selector Switch */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 px-2">Active Role:</span>
            <button
              onClick={() => setUserRole('super_admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                userRole === 'super_admin' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              👑 Super Admin (Sagar)
            </button>
            <button
              onClick={() => setUserRole('catalog_staff')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                userRole === 'catalog_staff' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧑‍💻 Catalog Staff
            </button>
          </div>
        </div>

        {/* AutoZoneIndia 21-Entity Database Schema Explorer Banner */}
        <div className="bg-slate-950/90 border border-blue-900/50 rounded-3xl p-5 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>AutoZoneIndia Enterprise Database Schema</span>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full lowercase">21 entities synced</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Single Owner Sagar Platform • Relational Database Tables & Data Inspectors
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full hidden sm:inline">
              ✓ Database Status: Healthy
            </span>
          </div>

          {/* 21 Entity Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-xs">
            {[
              { name: 'Products', count: `${products.length} SKUs`, icon: '📦', tab: 'catalog-list' },
              { name: 'Categories', count: '4 Taxonomies', icon: '📂', tab: 'categories' },
              { name: 'Sub Categories', count: '18 Part Types', icon: '🏷️', tab: 'categories' },
              { name: 'Brands', count: '8 OE Brands', icon: '🏭', tab: 'catalog-list' },
              { name: 'Vehicles', count: '350+ Models', icon: '🚗', tab: 'catalog-list' },
              { name: 'Product Comp.', count: '1.4k Matrix', icon: '🚘', tab: 'catalog-list' },
              { name: 'Product Images', count: '64 Media', icon: '🖼️', tab: 'add-product' },
              { name: 'Inventory / Stock', count: '2.4k Units', icon: '📊', tab: 'catalog-list' },
              { name: 'Customers', count: '1,280 Users', icon: '👥', tab: 'audit-log' },
              { name: 'Addresses', count: '1.9k Locations', icon: '📍', tab: 'audit-log' },
              { name: 'Orders', count: '845 Orders', icon: '🛒', tab: 'audit-log' },
              { name: 'Order Items', count: '2.1k Items', icon: '📋', tab: 'audit-log' },
              { name: 'Enquiries', count: '42 B2B Leads', icon: '💬', tab: 'audit-log' },
              { name: 'Quotations', count: '18 Quotes', icon: '📄', tab: 'audit-log' },
              { name: 'Reviews', count: '320 Ratings', icon: '⭐', tab: 'catalog-list' },
              { name: 'Wishlist', count: '540 Items', icon: '❤️', tab: 'catalog-list' },
              { name: 'Coupons', count: '12 Codes', icon: '🎟️', tab: 'catalog-list' },
              { name: 'Payments', count: '₹14.8L Live', icon: '💳', tab: 'audit-log' },
              { name: 'Shipping', count: '840 AWBs', icon: '🚚', tab: 'audit-log' },
              { name: 'Admin Users', count: '3 Admins', icon: '👑', tab: 'audit-log' },
              { name: 'Website Settings', count: 'Config', icon: '⚙️', tab: 'catalog-list' }
            ].map(ent => (
              <button
                key={ent.name}
                onClick={() => {
                  setActiveTab(ent.tab);
                  showToast(`🗄️ Inspecting Database Table: "${ent.name}" (${ent.count})`);
                }}
                className="bg-slate-900 hover:bg-blue-950/80 border border-slate-800 hover:border-blue-500/60 rounded-xl p-2 text-left transition cursor-pointer flex flex-col justify-between shadow-sm"
              >
                <div className="flex items-center gap-1 font-bold text-slate-200 text-[11px] truncate">
                  <span>{ent.icon}</span>
                  <span className="truncate">{ent.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                  {ent.count}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PRD System Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'catalog-list', label: `📦 Product Catalog (${products.length})` },
            { id: 'add-product', label: editingProductId ? '✏️ Edit Product' : '➕ Add Product (PRD Form)' },
            { id: 'categories', label: '📂 AAIA Category Taxonomy' },
            { id: 'csv-import', label: '📥 Bulk CSV Upload' },
            { id: 'audit-log', label: '📋 System Audit Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'add-product' && !editingProductId) resetForm();
                setActiveTab(tab.id);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>


        {/* ==================== TAB 1: PRODUCT CATALOG LIST ==================== */}
        {activeTab === 'catalog-list' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            
            {/* Quick Stats / Metrics Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Products</div>
                  <div className="text-lg font-black text-white">{products.length} Items</div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {products.filter(p => p.status === 'Published' || !p.status).length} Published Live
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Low Stock Items</div>
                  <div className="text-lg font-black text-amber-400">
                    {products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 5)).length} SKUs
                  </div>
                  <div className="text-[10px] text-slate-400">Reorder Threshold ≤ 5</div>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Inventory Value</div>
                  <div className="text-lg font-black text-emerald-400">
                    ₹{products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Current Stock Valuation</div>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fitment Coverage</div>
                  <div className="text-lg font-black text-purple-300">100% Fit Verified</div>
                  <div className="text-[10px] text-slate-400">Multi-Car Compatibility</div>
                </div>
              </div>
            </div>

            {/* Search & Prominent Filter Header with Column Settings */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="🔍 Search products by SKU, MPN, Title, Brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shrink-0 border ${
                    showAdvancedFilters || filterCategory !== 'all' || filterBrand !== 'all' || filterStatus !== 'all'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-950/50'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                  <span className="text-[10px] font-bold opacity-80">{showAdvancedFilters ? '▲' : '▾'}</span>
                  {(filterCategory !== 'all' || filterBrand !== 'all' || filterStatus !== 'all') && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
                  )}
                </button>

                {/* Column Customization Toggle (View Options) */}
                <div className="relative">
                  <button
                    onClick={() => setShowColumnSettings(!showColumnSettings)}
                    className="px-3.5 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                    title="Customize Visible Columns"
                  >
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Columns</span>
                  </button>

                  {showColumnSettings && (
                    <div className="absolute right-0 top-12 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 w-56 space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                        <span>⚙️ Visible Columns</span>
                        <button onClick={() => setShowColumnSettings(false)} className="text-slate-500 hover:text-white">✕</button>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {[
                          { key: 'productInfo', label: 'Product Info' },
                          { key: 'sku', label: 'SKU / MPN' },
                          { key: 'category', label: 'Category' },
                          { key: 'price', label: 'List Price (MRP)' },
                          { key: 'salePrice', label: 'Sale Price (₹)' },
                          { key: 'taxPercent', label: 'GST Tax (%)' },
                          { key: 'warranty', label: 'Warranty' },
                          { key: 'stock', label: 'Stock Units' },
                          { key: 'fitment', label: 'Fitment Rows' },
                          { key: 'status', label: 'Status' },
                          { key: 'actions', label: 'Actions' }
                        ].map(col => (
                          <label key={col.key} className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col.key]}
                              onChange={(e) => setVisibleColumns({ ...visibleColumns, [col.key]: e.target.checked })}
                              className="rounded accent-blue-600"
                            />
                            <span>{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Data Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-3 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md shrink-0"
                  title="Export Filtered Catalog to CSV File"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Compact Collapsible Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="bg-slate-950/80 border border-blue-900/40 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-inner">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Categories ({Object.keys(CATEGORY_TAXONOMY).length})</option>
                    {Object.keys(CATEGORY_TAXONOMY).map(catName => (
                      <option key={catName} value={catName}>{catName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Brand</label>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Brands ({BRANDS_DATABASE.length})</option>
                    {BRANDS_DATABASE.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    <option value="AutoZon Originals">AutoZon Originals</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Status</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Archived">Archived</option>
                    </select>

                    {(filterCategory !== 'all' || filterBrand !== 'all' || filterStatus !== 'all') && (
                      <button
                        onClick={() => { setFilterCategory('all'); setFilterBrand('all'); setFilterStatus('all'); }}
                        className="text-[10px] font-bold text-amber-400 hover:underline whitespace-nowrap px-2"
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Action Controls */}
            {selectedProductIds.length > 0 && (
              <div className="bg-blue-950/60 border border-blue-500/40 rounded-2xl p-3 flex items-center justify-between gap-4">
                <span className="text-xs font-black text-blue-300">
                  ⚡ {selectedProductIds.length} Products Selected
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleBulkAction('publish')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                    Publish Selected
                  </button>
                  <button onClick={() => handleBulkAction('archive')} className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                    Archive Selected
                  </button>
                  <button onClick={() => handleBulkAction('delete')} className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Main Product Table with Sticky Actions Column & Paginated Rows */}
            <div className="overflow-x-auto relative rounded-2xl border border-slate-800/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-wider bg-slate-950/90">
                    <th className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProductIds(paginatedProducts.map(p => p.id));
                          else setSelectedProductIds([]);
                        }}
                      />
                    </th>
                    {visibleColumns.productInfo && <th className="py-3.5 px-4">Product Info</th>}
                    {visibleColumns.sku && <th className="py-3.5 px-4">SKU / MPN</th>}
                    {visibleColumns.category && <th className="py-3.5 px-4">Category</th>}
                    {visibleColumns.price && <th className="py-3.5 px-4">MRP (price)</th>}
                    {visibleColumns.salePrice && <th className="py-3.5 px-4">Selling Price (sale_price)</th>}
                    {visibleColumns.taxPercent && <th className="py-3.5 px-4">GST Tax % (tax_percent)</th>}
                    {visibleColumns.warranty && <th className="py-3.5 px-4">Warranty</th>}
                    {visibleColumns.stock && <th className="py-3.5 px-4">Stock Units</th>}
                    {visibleColumns.fitment && <th className="py-3.5 px-4">Fitment Rows</th>}
                    {visibleColumns.status && <th className="py-3.5 px-4">Status</th>}
                    {visibleColumns.actions && (
                      <th className="py-3.5 px-4 text-right sticky right-0 bg-slate-950 border-l border-slate-800 shadow-xl z-20">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  {paginatedProducts.map(prod => {
                    const isInline = inlineEditingId === prod.id;
                    const fitmentCount = prod.isUniversal ? 'UNIVERSAL' : `${prod.fitments?.length || 1} Cars`;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-800/40 transition group">
                        <td className="py-4 px-3">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(prod.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedProductIds([...selectedProductIds, prod.id]);
                              else setSelectedProductIds(selectedProductIds.filter(id => id !== prod.id));
                            }}
                          />
                        </td>
                        {visibleColumns.productInfo && (
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt="" className="w-11 h-11 rounded-xl object-cover bg-slate-950 border border-slate-700 shrink-0 shadow-md" />
                              <div>
                                <div className="font-bold text-white max-w-xs truncate text-xs">{prod.title || prod.name}</div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{prod.brand}</div>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.sku && (
                          <td className="py-4 px-4 font-mono font-bold text-slate-300 text-[11px]">
                            {prod.sku || prod.partNumber}
                          </td>
                        )}
                        {visibleColumns.category && (
                          <td className="py-4 px-4 text-slate-300 text-xs">
                            {prod.category}
                          </td>
                        )}
                        {visibleColumns.price && (
                          <td className="py-4 px-4 text-slate-400 font-mono line-through text-xs">
                            ₹{(prod.price || prod.mrp || 0)?.toLocaleString()}
                          </td>
                        )}
                        {visibleColumns.salePrice && (
                          <td className="py-4 px-4">
                            {isInline ? (
                              <input
                                type="number"
                                defaultValue={prod.sale_price || prod.price}
                                onChange={(e) => setInlinePrice(e.target.value)}
                                className="w-20 bg-slate-950 border border-blue-500 rounded px-1.5 py-1 text-white font-bold"
                              />
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm">
                                ₹{(prod.sale_price || prod.price || 0)?.toLocaleString()}
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.taxPercent && (
                          <td className="py-4 px-4 font-mono font-bold text-amber-400 text-xs">
                            <span className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                              {prod.tax_percent || prod.taxPercent || 18}% GST
                            </span>
                          </td>
                        )}
                        {visibleColumns.warranty && (
                          <td className="py-4 px-4 text-slate-300 text-[11px] truncate max-w-[140px]" title={prod.warranty}>
                            🛡️ {prod.warranty || '12 Months'}
                          </td>
                        )}
                        {visibleColumns.stock && (
                          <td className="py-4 px-4">
                            {isInline ? (
                              <input
                                type="number"
                                defaultValue={prod.stock}
                                onChange={(e) => setInlineStock(e.target.value)}
                                className="w-16 bg-slate-950 border border-blue-500 rounded px-1.5 py-1 text-white font-bold"
                              />
                            ) : (
                              <div className="space-y-1">
                                {(() => {
                                  const totalQty = prod.inventory?.quantity ?? (prod.stock || 25);
                                  const reservedQty = prod.inventory?.reserved_quantity ?? (prod.reservedQuantity || 3);
                                  const availQty = Math.max(0, totalQty - reservedQty);
                                  const lowLimit = prod.inventory?.low_stock_limit ?? (prod.lowStockThreshold || 5);
                                  const isLowAlert = availQty <= lowLimit;

                                  return (
                                    <>
                                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                                        availQty > lowLimit
                                          ? 'bg-slate-950 border border-emerald-500/40 text-slate-200'
                                          : availQty > 0
                                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-black'
                                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/40 font-black'
                                      }`}>
                                        <span className="text-blue-400">Stock: {totalQty}</span>
                                        <span className="text-slate-600">|</span>
                                        <span className="text-amber-400">Reserved: {reservedQty}</span>
                                        <span className="text-slate-600">|</span>
                                        <span className="text-emerald-400 font-black">Available: {availQty}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                        <span>🏬 {prod.inventory?.warehouse || prod.warehouse || 'Mumbai Central Hub'}</span>
                                        {isLowAlert && <span className="text-rose-400 font-bold">(Low Stock ≤ {lowLimit})</span>}
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </td>
                        )}
                        {visibleColumns.fitment && (
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-[10px] font-bold text-amber-400 border border-slate-700">
                              🚘 {fitmentCount}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                              prod.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                              prod.status === 'Pending Review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {prod.status || 'Published'}
                            </span>
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td className="py-4 px-4 text-right sticky right-0 bg-slate-950/95 group-hover:bg-slate-900/95 border-l border-slate-800/80 shadow-2xl z-10 transition">
                            {isInline ? (
                              <button onClick={() => handleSaveInline(prod.id)} className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold">
                                Save
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setInlineEditingId(prod.id);
                                    setInlinePrice(prod.price);
                                    setInlineStock(prod.stock);
                                  }}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition"
                                  title="Quick Edit Price & Stock"
                                >
                                  ⚡ Quick Edit
                                </button>
                                <button
                                  onClick={() => handleEditProductClick(prod)}
                                  className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setProducts(products.filter(p => p.id !== prod.id));
                                    showToast(`🗑️ Product "${prod.title || prod.name}" deleted.`);
                                  }}
                                  className="bg-rose-950/80 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white px-2 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition"
                                  title="Delete Product"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Rows Per Page Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-slate-400">
                <span>
                  Showing <strong className="text-white">{filteredProducts.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                  <strong className="text-white">{Math.min(startIndex + rowsPerPage, filteredProducts.length)}</strong> of{' '}
                  <strong className="text-white">{filteredProducts.length}</strong> products
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black text-slate-500">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200 font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-1"
                >
                  ◀ Prev
                </button>
                
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-blue-400 rounded-xl font-black">
                  Page {validCurrentPage} of {totalPages}
                </span>

                <button
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-1"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ==================== TAB 2: ADD / EDIT PRODUCT FORM ==================== */}
        {activeTab === 'add-product' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingProductId ? `Edit Product (ID: ${editingProductId})` : 'Create New Car Spare Part'}
                </h2>
                <p className="text-xs text-slate-400">Complete PRD product entry form with fitment data & validation</p>
              </div>

              {/* Copy Fitment Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">📋 Copy Fitment From:</span>
                <select
                  value={copyFromProduct}
                  onChange={(e) => handleCopyFitmentFromProduct(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 font-bold"
                >
                  <option value="">Select Existing Product Template...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title || p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Validation Warnings */}
            {skuWarning && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                {skuWarning}
              </div>
            )}
            {priceWarning && (
              <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {priceWarning}
              </div>
            )}

            {/* Category Mismatch Red Alert Banner */}
            {(() => {
              const mismatchAlert = getCategoryMismatchAlert();
              if (mismatchAlert) {
                return (
                  <div className="bg-rose-500/20 border-2 border-rose-500/70 rounded-2xl p-4 text-xs font-bold text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl shadow-rose-950/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/30 text-rose-300 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-rose-300">Category Mismatch Warning Alert!</div>
                        <div className="text-xs text-rose-200 font-normal">{mismatchAlert.message}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleCategoryLevel1Change(mismatchAlert.recommendedCat);
                        setProductForm(prev => ({
                          ...prev,
                          category: mismatchAlert.recommendedCat,
                          subCategory: mismatchAlert.recommendedSub,
                          partType: mismatchAlert.recommendedType
                        }));
                        showToast(`✅ Fixed Category to "${mismatchAlert.recommendedCat} > ${mismatchAlert.recommendedSub}"`);
                      }}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
                    >
                      <span>⚡ Auto-Fix Category Mismatch</span>
                    </button>
                  </div>
                );
              }
              return null;
            })()}

            {/* SKU / MPN DATABASE AUTOFILL BAR */}
            <div className="bg-blue-950/40 border border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-white text-xs">🔍 Auto-fill Form from SKU / MPN Database Match:</span>
                  <p className="text-[11px] text-slate-400">Search existing catalog parts to instantly pre-fill Brand, Categories, Prices & Fitments</p>
                </div>
              </div>

              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search SKU or MPN (e.g. BOSCH-BP)..."
                  value={skuSearchQuery}
                  onChange={(e) => {
                    setSkuSearchQuery(e.target.value);
                    setShowSkuAutofillDropdown(true);
                  }}
                  className="w-full bg-slate-950 border border-blue-500/60 rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold focus:border-amber-400"
                />
                {showSkuAutofillDropdown && skuSearchQuery.trim() && (
                  <div className="absolute right-0 top-full mt-1 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-52 overflow-y-auto divide-y divide-slate-800">
                    {products.filter(p => 
                      (p.sku && p.sku.toLowerCase().includes(skuSearchQuery.toLowerCase())) ||
                      (p.partNumber && p.partNumber.toLowerCase().includes(skuSearchQuery.toLowerCase())) ||
                      (p.mpn && p.mpn.toLowerCase().includes(skuSearchQuery.toLowerCase())) ||
                      (p.title && p.title.toLowerCase().includes(skuSearchQuery.toLowerCase()))
                    ).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          handleAutofillFromProductObj(p);
                          setSkuSearchQuery('');
                        }}
                        className="p-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 transition"
                      >
                        <div>
                          <div className="font-bold text-white text-xs max-w-[200px] truncate">{p.title || p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.sku || p.partNumber} • {p.brand}</div>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
                          Autofill ➔
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 1: BASIC INFORMATION & DYNAMIC TAXONOMY */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                1️⃣ Basic Info & Dynamic Category Taxonomy
              </h3>
              
              <div className="space-y-4 text-xs">
                {/* Product Title & Brand Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-300">
                        Product Title <span className="text-rose-400 font-black">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Real-time Spelling & Mismatch Check</span>
                    </div>
                    <input
                      type="text"
                      value={productForm.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Bosch Engine Air Filter / Front Brake Pad Set"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold focus:border-blue-500 text-sm"
                    />

                    {/* Title Auto-Spelling Correction Banner */}
                    {(() => {
                      const corrected = getTitleCorrections(productForm.title);
                      if (corrected && corrected !== productForm.title) {
                        return (
                          <div className="flex items-center justify-between gap-2 mt-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-[11px] text-amber-300 font-bold">
                            <span>💡 Fix Spelling Suggestion: "{corrected}"</span>
                            <button
                              type="button"
                              onClick={() => handleTitleChange(corrected)}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-black cursor-pointer transition"
                            >
                              Apply Fix ✨
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Quick Title Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-bold">Quick Presets:</span>
                      {['Engine Air Filter', 'Front Brake Pad Set', 'Synthetic Engine Oil 5W-30', 'Spark Plugs (Set of 4)'].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleTitleChange(`${productForm.brand || 'Bosch'} ${preset}`)}
                          className="bg-slate-950 hover:bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md border border-slate-800 transition cursor-pointer"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      Brand / Manufacturer <span className="text-rose-400 font-black">*</span>
                    </label>
                    <select
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold"
                    >
                      {BRANDS_DATABASE.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                      <option value="AutoZon Originals">AutoZon Originals</option>
                      <option value="Toyota Genuine">Toyota Genuine</option>
                      <option value="Maruti Suzuki Genuine">Maruti Suzuki Genuine</option>
                      <option value="Hyundai Genuine">Hyundai Genuine</option>
                    </select>
                  </div>
                </div>

                {/* AAIA 3-Level Cascading Category Selectors */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>🏷️ 3-Level Dynamic Category Cascading</span>
                    <span className="text-[10px] text-emerald-400 font-normal">✓ Strict Filter & Engine Cascading</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Level 1: Category */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">
                        Level 1: Category <span className="text-rose-400 font-black">*</span>
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => handleCategoryLevel1Change(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold focus:border-amber-400"
                      >
                        {Object.keys(CATEGORY_TAXONOMY).map(catKey => (
                          <option key={catKey} value={catKey}>{catKey}</option>
                        ))}
                      </select>
                    </div>

                    {/* Level 2: Sub-Category */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">
                        Level 2: Sub-Category <span className="text-rose-400 font-black">*</span>
                      </label>
                      <select
                        value={productForm.subCategory}
                        onChange={(e) => handleCategoryLevel2Change(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold focus:border-amber-400"
                      >
                        {Object.keys(CATEGORY_TAXONOMY[productForm.category] || CATEGORY_TAXONOMY['Filters & Maintenance']).map(subKey => (
                          <option key={subKey} value={subKey}>{subKey}</option>
                        ))}
                      </select>
                    </div>

                    {/* Level 3: Part Type */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">
                        Level 3: Part Type <span className="text-rose-400 font-black">*</span>
                      </label>
                      <select
                        value={productForm.partType}
                        onChange={(e) => setProductForm({ ...productForm, partType: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-300 font-bold focus:border-amber-400"
                      >
                        {((CATEGORY_TAXONOMY[productForm.category] || {})[productForm.subCategory] || ['Standard Part']).map((partType, ptIdx) => (
                          <option key={ptIdx} value={partType}>{partType}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Collapsible Advanced Technical Identifiers Accordion */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowOptionalTechFields(!showOptionalTechFields)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-black">⚙️ Advanced Technical Details (SKU, MPN, OEM Numbers - Optional)</span>
                      <span className="text-[10px] text-slate-500 font-normal">(Keep form compact or expand for OEM codes)</span>
                    </div>
                    <span className="bg-slate-900 border border-slate-700 text-[10px] px-2.5 py-1 rounded-lg text-slate-400 font-mono">
                      {showOptionalTechFields ? '▲ Collapse Section' : '▼ Expand SKU / OEM Numbers'}
                    </span>
                  </button>

                  {showOptionalTechFields && (
                    <div className="space-y-4 pt-3 border-t border-slate-800 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">SKU / Code <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input
                            type="text"
                            value={productForm.sku}
                            onChange={(e) => handleSkuChange(e.target.value)}
                            placeholder="e.g. BOSCH-BP-SWF01 (Auto-generated if empty)"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Manufacturer Part Number (MPN) <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input
                            type="text"
                            value={productForm.mpn}
                            onChange={(e) => setProductForm({ ...productForm, mpn: e.target.value })}
                            placeholder="e.g. 0986AB2391"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">OEM Cross-Reference Numbers <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input
                            type="text"
                            value={productForm.oemNumbers}
                            onChange={(e) => setProductForm({ ...productForm, oemNumbers: e.target.value })}
                            placeholder="e.g. 04465-0K240, 04465-YZZF2"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Short Technical Specs Summary <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input
                            type="text"
                            value={productForm.shortDescription}
                            onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                            placeholder="e.g. High-performance engine air filter for dust protection."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Product Video Link <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input
                            type="text"
                            value={productForm.videoUrl}
                            onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* SECTION 2: FITMENT MATRIX (CRITICAL FOR AUTO PARTS) */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    2️⃣ Vehicle Fitment & Compatibility Matrix
                  </h3>
                  <p className="text-[11px] text-slate-400">Specify exact car models, year ranges & engine variants that fit this part</p>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isUniversal}
                    onChange={(e) => setProductForm({ ...productForm, isUniversal: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Universal Fitment (Fits all vehicles)</span>
                </label>
              </div>

              {!productForm.isUniversal && (
                <div className="space-y-3">
                  {productForm.fitments.map((fit, idx) => {
                    const yearConflict = validateFitmentYearRange(fit);
                    return (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2.5 text-xs items-center">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Make (make) *</label>
                            <select
                              value={fit.make}
                              onChange={(e) => {
                                const newMake = e.target.value;
                                handleFitmentChange(idx, 'make', newMake);
                                const makeObj = VEHICLE_MAKES.find(m => m.name.toLowerCase() === newMake.toLowerCase() || m.id === newMake.toLowerCase());
                                if (makeObj && makeObj.models && makeObj.models.length > 0) {
                                  handleFitmentChange(idx, 'model', makeObj.models[0].name);
                                }
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-bold"
                            >
                              {VEHICLE_MAKES.map(m => (
                                <option key={m.id} value={m.name}>{m.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Model (model) *</label>
                            <select
                              value={fit.model}
                              onChange={(e) => handleFitmentChange(idx, 'model', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-bold"
                            >
                              {(() => {
                                const selectedMakeObj = VEHICLE_MAKES.find(m => m.name.toLowerCase() === (fit.make || '').toLowerCase() || m.id === (fit.make || '').toLowerCase());
                                const availableModels = selectedMakeObj ? selectedMakeObj.models : [];
                                return availableModels.length > 0 ? (
                                  availableModels.map(mod => (
                                    <option key={mod.id} value={mod.name}>{mod.name}</option>
                                  ))
                                ) : (
                                  <option value={fit.model}>{fit.model}</option>
                                );
                              })()}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Variant (variant)</label>
                            <input
                              type="text"
                              value={fit.variant || ''}
                              onChange={(e) => handleFitmentChange(idx, 'variant', e.target.value)}
                              placeholder="e.g. VXi"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Year From *</label>
                            <input
                              type="text"
                              value={fit.yearFrom || '2018'}
                              onChange={(e) => handleFitmentChange(idx, 'yearFrom', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Year To *</label>
                            <input
                              type="text"
                              value={fit.yearTo || '2024'}
                              onChange={(e) => handleFitmentChange(idx, 'yearTo', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Fuel Type</label>
                            <select
                              value={fit.fuelType || 'Petrol'}
                              onChange={(e) => handleFitmentChange(idx, 'fuelType', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-amber-300 font-bold"
                            >
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                              <option value="CNG">CNG</option>
                              <option value="Electric (EV)">Electric (EV)</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block">Transmission</label>
                            <select
                              value={fit.transmission || 'Manual'}
                              onChange={(e) => handleFitmentChange(idx, 'transmission', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-blue-300 font-bold"
                            >
                              <option value="Manual">Manual</option>
                              <option value="Automatic">Automatic</option>
                              <option value="AMT">AMT</option>
                              <option value="CVT">CVT</option>
                              <option value="DCT">DCT</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1">
                              <label className="text-[10px] text-slate-400 font-bold block">Notes (notes)</label>
                              <input
                                type="text"
                                value={fit.notes || ''}
                                onChange={(e) => handleFitmentChange(idx, 'notes', e.target.value)}
                                placeholder="Fitment notes..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 text-[11px]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFitmentRow(idx)}
                              className="text-rose-400 hover:text-rose-300 font-bold text-xs p-1 cursor-pointer mt-4"
                              title="Delete fitment row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Fitment Real-time Year Conflict Alert */}
                        {yearConflict && (
                          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{yearConflict}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleAddFitmentRow}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Add Another Compatible Vehicle Row</span>
                    </button>
                    <p className="text-[11px] text-slate-400 font-normal mt-1.5">
                      💡 <strong>Use Case Note:</strong> Agar yeh part ek se zyada car models (e.g. Innova Crysta, Fortuner & Hilux) mein fit hota hai, toh yahan click kar ke naya car model row add karein.
                    </p>
                  </div>
                </div>
              )}
            </div>


            {/* SECTION 3: MEDIA & PRODUCT GALLERY (SUPABASE STORAGE CDN INTEGRATION) */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <ProductImageUploader
                productId={editingProductId}
                images={productForm.images}
                onChange={(updatedImages) => {
                  setProductForm(prev => ({
                    ...prev,
                    images: updatedImages
                  }));
                }}
                onToast={showToast}
              />
            </div>

            {/* SECTION 4: PRICING & INVENTORY CONTROL (POSTGRES SCHEMA PARITY FOR INVENTORY TABLE) */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                    4️⃣ Pricing & Inventory Control (SQL Table: <code className="text-emerald-400 font-mono">inventory</code>)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Set selling prices, tax, warranty &amp; full warehouse inventory metrics (<code className="text-amber-300 font-mono">quantity, reserved_quantity, low_stock_limit, warehouse</code>)
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center gap-3 text-xs font-mono shadow-md">
                  <span className="text-slate-400 font-bold">Calculated Available Stock:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {Math.max(0, (parseInt(productForm.stock, 10) || 0) - (parseInt(productForm.reservedQuantity, 10) || 0))} units
                  </span>
                </div>
              </div>

              {/* Inventory Schema Parity Live Banner */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 font-black px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px] uppercase tracking-wider">
                    SQL SCHEMA PARITY
                  </span>
                  <span className="text-slate-300 font-bold">
                    Inventory Formula: <code className="text-amber-300 font-mono">Available = quantity - reserved_quantity</code>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                  <span>Part: <strong>{productForm.title || 'Brake Pad'}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span className="text-blue-400">Stock (quantity): <strong>{productForm.stock || 25}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span className="text-amber-400">Reserved (reserved_quantity): <strong>{productForm.reservedQuantity || 3}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400 font-black">Available: <strong>{Math.max(0, (parseInt(productForm.stock, 10) || 0) - (parseInt(productForm.reservedQuantity, 10) || 0))}</strong></span>
                </div>
              </div>

              {/* Pricing & Tax Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    MRP / List Price (price) (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => {
                      setProductForm({ ...productForm, mrp: e.target.value });
                      handlePriceChange(productForm.sellingPrice, e.target.value);
                    }}
                    placeholder="e.g. 2500"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Sale Price (sale_price) (₹) <span className="text-rose-400 font-black">*</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.sellingPrice}
                    onChange={(e) => {
                      setProductForm({ ...productForm, sellingPrice: e.target.value });
                      handlePriceChange(e.target.value, productForm.mrp);
                    }}
                    placeholder="e.g. 1899"
                    className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl px-3 py-2.5 text-emerald-400 font-black text-sm focus:border-emerald-400 shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    GST Tax (tax_percent) (%) <span className="text-amber-400 font-black">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.taxPercent}
                    onChange={(e) => setProductForm({ ...productForm, taxPercent: e.target.value })}
                    placeholder="18.00"
                    className="w-full bg-slate-950 border border-amber-500/60 text-amber-300 rounded-xl px-3 py-2.5 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Warranty (warranty) <span className="text-slate-400 font-normal">(Text)</span>
                  </label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    placeholder="e.g. 12 Months Manufacturer Warranty"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 font-bold"
                  />
                </div>
              </div>

              {/* Inventory Table Specific Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center justify-between">
                    <span>Total Physical Stock (<code className="text-blue-400 font-mono">quantity</code>)</span>
                    <span className="text-rose-400 font-black">*</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full bg-slate-950 border border-blue-500/50 rounded-xl px-3 py-2.5 text-blue-300 font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Reserved Quantity (<code className="text-amber-400 font-mono">reserved_quantity</code>)
                  </label>
                  <input
                    type="number"
                    value={productForm.reservedQuantity}
                    onChange={(e) => setProductForm({ ...productForm, reservedQuantity: e.target.value })}
                    placeholder="e.g. 3"
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2.5 text-amber-300 font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Low Stock Alert Limit (<code className="text-rose-400 font-mono">low_stock_limit</code>)
                  </label>
                  <input
                    type="number"
                    value={productForm.lowStockThreshold}
                    onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Warehouse Location (<code className="text-emerald-400 font-mono">warehouse</code>)
                  </label>
                  <select
                    value={productForm.warehouse}
                    onChange={(e) => setProductForm({ ...productForm, warehouse: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                  >
                    <option value="Mumbai Central Hub">Mumbai Central Hub</option>
                    <option value="Delhi NCR Logistics Warehouse">Delhi NCR Logistics Warehouse</option>
                    <option value="Bengaluru Tech Depot">Bengaluru Tech Depot</option>
                    <option value="Chennai Port Warehouse">Chennai Port Warehouse</option>
                    <option value="Kolkata Distribution Hub">Kolkata Distribution Hub</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FORM SUBMISSION ACTIONS STICKY FOOTER */}
            <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl">
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Form & Clear</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveProduct('Draft')}
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer shadow-md transition"
                >
                  💾 Save as Draft
                </button>

                {userRole === 'super_admin' ? (
                  <button
                    type="button"
                    onClick={() => handleSaveProduct('Published')}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer transition uppercase tracking-wider"
                  >
                    🚀 Publish Product Live
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSaveProduct('Pending Review')}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-8 py-3 rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer transition"
                  >
                    Submit for Super Admin Review
                  </button>
                )}
              </div>
            </div>

          </div>
        )}


        {/* ==================== TAB 3: AAIA CATEGORY TAXONOMY ==================== */}
        {activeTab === 'categories' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">AAIA 3-Level Category Taxonomy Tree</h2>
                <p className="text-xs text-slate-400">Structured Category → Sub-Category → Part Type Hierarchy</p>
              </div>
              <button onClick={() => showToast('➕ Added Category node')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Add Top Level Category
              </button>
            </div>

            <div className="space-y-4">
              {categoryTree.map(cat => (
                <div key={cat.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm font-black text-amber-400 border-b border-slate-800 pb-2">
                    <span>📁 Level 1: {cat.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{cat.subCategories.length} Sub-Categories</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                    {cat.subCategories.map(sub => (
                      <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
                        <div className="text-xs font-bold text-white">📂 Level 2: {sub.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {sub.partTypes.map((pt, pIdx) => (
                            <span key={pIdx} className="bg-slate-950 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800 font-mono">
                              ⚙️ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ==================== TAB 4: BULK CSV & EXCEL UPLOAD SYSTEM ==================== */}
        {activeTab === 'csv-import' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
            
            {/* Header & Template Download */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Database className="w-6 h-6 text-amber-400" />
                  Bulk Catalog & Fitment Importer (PRD 2-File System)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload Products and Fitments in bulk with pre-database validation, diff previews & error reporting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('📥 Downloaded Products_Template.xlsx (Products + Fitments sheets)')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 2-Sheet Excel Template</span>
                </button>
              </div>
            </div>

            {/* Step 1: File Upload Drop Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File 1: Products Sheet */}
              <div className="border-2 border-dashed border-blue-500/40 rounded-3xl p-6 text-center bg-slate-950/60 space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">File 1: Products Sheet</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">sku | title | brand | category_path | mrp | selling_price | stock</p>
                </div>
                <button
                  onClick={() => showToast('📁 Products.xlsx selected (245 rows detected)')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Browse Products File
                </button>
              </div>

              {/* File 2: Fitments Sheet */}
              <div className="border-2 border-dashed border-emerald-500/40 rounded-3xl p-6 text-center bg-slate-950/60 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">File 2: Vehicle Fitments Sheet</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">sku | make | model | year_from | year_to | variant</p>
                </div>
                <button
                  onClick={() => showToast('📁 Fitments.xlsx selected (1,420 compatibility rows detected)')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Browse Fitments File
                </button>
              </div>
            </div>

            {/* Step 2: Pre-Validation Analysis Report & Live Import Progress */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              
              {/* Live Import Progress Bar */}
              {isImporting && (
                <div className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-5 space-y-3 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-black text-white">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                      Importing Bulk Batch & Validating Store Fitments...
                    </span>
                    <span className="text-blue-400 font-mono text-sm">{importProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full transition-all duration-300 rounded-full shadow-lg"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono text-center">
                    Processing row {Math.floor((importProgress / 100) * 242)} of 242... Matching SKUs against store database...
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Pre-Database Commit Validation Report (245 Rows Analyzed)
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">✓ 242 Valid • 🔴 3 Flagged Errors</span>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-slate-400 font-bold text-[10px]">New SKUs to Create</span>
                  <div className="text-xl font-black text-emerald-400 my-0.5">204 SKUs</div>
                  <span className="text-[10px] text-slate-500">Default Status: Draft</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-slate-400 font-bold text-[10px]">Existing SKU Updates</span>
                  <div className="text-xl font-black text-amber-400 my-0.5">38 SKUs</div>
                  <span className="text-[10px] text-amber-500 font-bold">Diff Preview Available</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-slate-400 font-bold text-[10px]">Vehicle Fitment Links</span>
                  <div className="text-xl font-black text-blue-400 my-0.5">1,420 Rows</div>
                  <span className="text-[10px] text-slate-500">Mode: Append New</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-slate-400 font-bold text-[10px]">Flagged Error Rows</span>
                  <div className="text-xl font-black text-rose-400 my-0.5">3 Errors</div>
                  <span className="text-[10px] text-rose-400 font-bold">Action: Skip or Fix</span>
                </div>
              </div>

              {/* Row-Level Errors Log Table */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">Row-Level Error & Warning Details:</h4>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold">Row #45 (SKU: AZI-BRK-UNKNOWN)</span>: Missing required Category path field. Did you mean <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">Brake System &gt; Brake Pads</code>?
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold">Row #82 (SKU: AZI-OIL-99)</span>: Fitment year range invalid (<code className="bg-slate-950 px-1 py-0.5 rounded">year_from 2026 &gt; year_to 2018</code>).
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold">Row #112 (SKU: BOSCH-SP-FR7DC)</span>: Price Update Diff detected: Selling Price changing from <code className="line-through text-slate-400">₹1,450</code> to <code className="text-emerald-400">₹1,250</code> (-13.7%).
                    </div>
                  </div>
                </div>
              </div>

              {/* Commit Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <button
                  onClick={() => showToast('📥 Downloading Error_Report_Row_45_82.csv...')}
                  className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Flagged Error Rows CSV
                </button>

                <button
                  disabled={isImporting}
                  onClick={handleStartBulkImport}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs px-8 py-3.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isImporting ? `Importing Batch (${importProgress}%)...` : 'Confirm & Commit 242 Valid Rows to Store'}</span>
                </button>
              </div>

            </div>

            {/* Step 3: Recent Upload History Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Recent Upload History Log
              </h3>
              <div className="divide-y divide-slate-800/80 text-xs">
                {uploadHistory.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-2">
                        <span>📄 {item.fileName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({item.rows} rows)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.user} • {item.time}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}


        {/* ==================== TAB 5: SYSTEM AUDIT LOGS ==================== */}
        {activeTab === 'audit-log' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-black text-white">Catalog Audit Log & Activity Tracker</h2>
            <div className="divide-y divide-slate-800/80 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{log.details}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.user} • {log.timestamp}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-emerald-400 border border-slate-700">
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
