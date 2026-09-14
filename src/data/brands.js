// AutoZonIndia Postgres Brands Entity Schema Alignment
// Table: brands (id: UUID/string, name: text, slug: text, logo_url: text, description: text, status: boolean)

export const BRANDS_DATABASE = [
  {
    id: 'b801a1e2-1111-4000-8000-000000000001',
    name: 'Bosch',
    slug: 'bosch',
    logo_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=120&auto=format&fit=crop&q=80',
    description: 'German engineering leader specializing in spark plugs, braking systems, diesel fuel injection & filters',
    status: true
  },
  {
    id: 'b802a1e2-2222-4000-8000-000000000002',
    name: 'SKF',
    slug: 'skf',
    logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120&auto=format&fit=crop&q=80',
    description: 'Swedish multinational bearing and seal manufacturing company producing wheel bearings & drive hub kits',
    status: true
  },
  {
    id: 'b803a1e2-3333-4000-8000-000000000003',
    name: 'Valeo',
    slug: 'valeo',
    logo_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80',
    description: 'Global automotive supplier specializing in clutch plates, wiper systems, starters & thermal management',
    status: true
  },
  {
    id: 'b804a1e2-4444-4000-8000-000000000004',
    name: 'Motherson',
    slug: 'motherson',
    logo_url: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=120&auto=format&fit=crop&q=80',
    description: 'Global Tier-1 supplier for automotive wiring harnesses, rear-view mirrors & polymer interior modules',
    status: true
  },
  {
    id: 'b805a1e2-5555-4000-8000-000000000005',
    name: 'Exide',
    slug: 'exide',
    logo_url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=120&auto=format&fit=crop&q=80',
    description: "India's premier battery manufacturer delivering long-lasting maintenance-free 12V car and heavy-vehicle batteries",
    status: true
  },
  {
    id: 'b806a1e2-6666-4000-8000-000000000006',
    name: 'Amaron',
    slug: 'amaron',
    logo_url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=120&auto=format&fit=crop&q=80',
    description: 'High-performance Silver Alloy automotive battery brand for long life and heat resistance in Indian climates',
    status: true
  },
  {
    id: 'b807a1e2-7777-4000-8000-000000000007',
    name: 'Castrol',
    slug: 'castrol',
    logo_url: 'https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=120&auto=format&fit=crop&q=80',
    description: 'World leading liquid engineering lubricant brand producing GTX, MAGNATEC & EDGE synthetic engine oils',
    status: true
  },
  {
    id: 'b808a1e2-8888-4000-8000-000000000008',
    name: 'Mobil',
    slug: 'mobil',
    logo_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=120&auto=format&fit=crop&q=80',
    description: 'ExxonMobil signature motor oil brand delivering Mobil 1 advanced full synthetic engine lubricants',
    status: true
  },
  {
    id: 'b809a1e2-9999-4000-8000-000000000009',
    name: 'Uno Minda',
    slug: 'uno-minda',
    logo_url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=120&auto=format&fit=crop&q=80',
    description: 'Tier-1 OEM supplier for automotive electric horns, LED headlights, switches & alloy wheels',
    status: true
  },
  {
    id: 'b810a1e2-1010-4000-8000-000000000010',
    name: 'TVS Girling',
    slug: 'tvs-girling',
    logo_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=80',
    description: 'Brakes India brand producing OEM brake pads, disc rotors, master cylinders & brake fluid',
    status: true
  },
  {
    id: 'b811a1e2-1112-4000-8000-000000000011',
    name: 'Shell',
    slug: 'shell',
    logo_url: 'https://images.unsplash.com/photo-1620987278429-ab178d6eb547?w=120&auto=format&fit=crop&q=80',
    description: 'Shell Helix synthetic engine oils manufactured from natural gas using PurePlus technology',
    status: true
  },
  {
    id: 'b812a1e2-1212-4000-8000-000000000012',
    name: 'Gabriel',
    slug: 'gabriel',
    logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120&auto=format&fit=crop&q=80',
    description: 'Gabriel India leader in automotive ride control, shock absorbers & front fork suspension systems',
    status: true
  }
];

export const FEATURED_BRANDS = BRANDS_DATABASE.map(b => ({
  id: b.slug,
  name: b.name,
  type: 'OEM / OES Manufacturer',
  logo: '🏭',
  slogan: b.description,
  category: 'Automotive Spares & Fluids'
}));
