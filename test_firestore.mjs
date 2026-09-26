import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_bcjbmeDQFAxfL_xWcxnxsxgwYpECEx8",
  authDomain: "studio-3796571750-e6029.firebaseapp.com",
  projectId: "studio-3796571750-e6029",
  storageBucket: "studio-3796571750-e6029.firebasestorage.app",
  messagingSenderId: "621527730116",
  appId: "1:621527730116:web:61aafd210bacbba8828691"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkProducts() {
  const productsSnap = await getDocs(collection(db, 'products'));
  const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log('Current Firestore Products Count:', products.length);

  const ordersSnap = await getDocs(collection(db, 'orders'));
  const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log('Current Firestore Orders Count:', orders.length);

  if (products.length === 0) {
    console.log('No products found in Firestore. Seeding real starter products for KAMTI AUTOMOTIVE...');
    const starterProducts = [
      {
        name: 'BOSCH Genuine OE Clutch Assembly Kit',
        title: 'BOSCH Genuine OE Clutch Assembly Kit',
        category: 'Clutch & Transmission',
        categorySlug: 'clutch-transmission',
        mrp: 4800,
        sellingPrice: 3850,
        price: 3850,
        isActive: true,
        inStock: true,
        stock: 15,
        sku: 'KAMTI-CLT-001',
        partNumber: 'KAMTI-CLT-001',
        brand: 'Bosch',
        carBrand: 'Maruti Suzuki',
        carModel: 'Swift / Dzire (2018-2024)',
        variant: '1.2L DualJet Petrol',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80'],
        desc: 'Original Bosch OEM clutch disc, pressure plate, and release bearing assembly for Maruti Swift and Dzire.',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Motul 8100 X-cess 5W-40 Synthetic Engine Oil (4L)',
        title: 'Motul 8100 X-cess 5W-40 Synthetic Engine Oil (4L)',
        category: 'Engine & Oil',
        categorySlug: 'engine-oil',
        mrp: 3600,
        sellingPrice: 2890,
        price: 2890,
        isActive: true,
        inStock: true,
        stock: 25,
        sku: 'KAMTI-OIL-002',
        partNumber: 'KAMTI-OIL-002',
        brand: 'Motul',
        carBrand: 'Universal / All Brands',
        carModel: 'Hyundai Creta / Tata Nexon / Maruti Swift',
        variant: 'Petrol & Diesel Engines',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80'],
        desc: '100% Fully Synthetic High Performance 5W-40 Motor Oil designed for high thermal stability in Indian climate.',
        createdAt: new Date().toISOString()
      },
      {
        name: 'BOSCH Low-Metallic Front Disc Brake Pad Set',
        title: 'BOSCH Low-Metallic Front Disc Brake Pad Set',
        category: 'Brakes & Suspension',
        categorySlug: 'brakes-suspension',
        mrp: 2200,
        sellingPrice: 1650,
        price: 1650,
        isActive: true,
        inStock: true,
        stock: 30,
        sku: 'KAMTI-BRK-003',
        partNumber: 'KAMTI-BRK-003',
        brand: 'Bosch',
        carBrand: 'Hyundai',
        carModel: 'Creta / Venue / i20',
        variant: 'All Petrol & Diesel Variants',
        image: 'https://images.unsplash.com/photo-1600792860026-4e2d3fb57a05?w=600&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1600792860026-4e2d3fb57a05?w=600&auto=format&fit=crop&q=80'],
        desc: 'Low-metallic noise-free front brake pads for smooth braking performance and enhanced rotor life.',
        createdAt: new Date().toISOString()
      },
      {
        name: 'MANNI-FILTER OEM Cabin Air & Dust Filter',
        title: 'MANNI-FILTER OEM Cabin Air & Dust Filter',
        category: 'Filters & Electrical',
        categorySlug: 'filters-electrical',
        mrp: 950,
        sellingPrice: 699,
        price: 699,
        isActive: true,
        inStock: true,
        stock: 40,
        sku: 'KAMTI-FLT-004',
        partNumber: 'KAMTI-FLT-004',
        brand: 'Mann Filter',
        carBrand: 'Tata Motors',
        carModel: 'Nexon / Harrier / Safari',
        variant: '1.2L Turbo Petrol / 2.0L Diesel',
        image: 'https://images.unsplash.com/photo-1597778602022-f2d97b8c1493?w=600&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1597778602022-f2d97b8c1493?w=600&auto=format&fit=crop&q=80'],
        desc: 'High-efficiency AC pollen filter ensuring 99% filtration of dust particles and allergens inside cabin.',
        createdAt: new Date().toISOString()
      }
    ];

    for (const prod of starterProducts) {
      const docRef = await addDoc(collection(db, 'products'), prod);
      console.log('Seeded Product ID:', docRef.id, '->', prod.name);
    }
    console.log('✅ Starter products seeded to Firestore successfully!');
  }
}

checkProducts().catch(console.error);
