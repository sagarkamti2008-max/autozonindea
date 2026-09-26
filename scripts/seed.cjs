/**
 * scripts/seed.cjs
 * Firestore me categories, vehicle tree aur sample products daalta hai.
 *
 * Setup:
 *   npm i firebase-admin
 *   Firebase Console > Project settings > Service accounts > Generate new private key
 *   File ko serviceAccount.json naam se isi folder me rakho (gitignore karna mat bhoolna)
 *   node scripts/seed.cjs
 */
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { readFileSync, existsSync } = require("fs");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "serviceAccount.json");

if (!existsSync(serviceAccountPath)) {
  console.log("⚠️ serviceAccount.json not found in ./scripts folder.");
  console.log("To run Firestore live seed: Place serviceAccount.json in ./scripts/ and run `node scripts/seed.cjs`.");
  process.exit(0);
}

initializeApp({
  credential: cert(JSON.parse(readFileSync(serviceAccountPath, "utf8"))),
});
const db = getFirestore();

const key = (make, model, year) =>
  `${make}|${model}|${year}`.toLowerCase().replace(/\s+/g, "-");

/** Ek model ke year range ko vehicleKeys array me expand karta hai. */
const expand = (fits) =>
  fits.flatMap(({ make, model, from, to }) =>
    Array.from({ length: to - from + 1 }, (_, i) => key(make, model, from + i))
  );

const categories = [
  { slug: "engine", name: "Engine Parts", parentId: null, order: 1 },
  { slug: "brakes", name: "Brakes & Clutch", parentId: null, order: 2 },
  { slug: "oils-fluids", name: "Oils & Fluids", parentId: null, order: 3 },
  { slug: "accessories", name: "Car Accessories", parentId: null, order: 4 },
  { slug: "clutch-assembly", name: "Clutch Assembly", parentId: "brakes", order: 1 },
  { slug: "brake-oil", name: "Brake Oil", parentId: "oils-fluids", order: 1 },
  { slug: "engine-oil", name: "Engine Oil", parentId: "oils-fluids", order: 2 },
  { slug: "mats", name: "7D Floor Mats", parentId: "accessories", order: 1 },
  { slug: "mobile-holders", name: "Mobile Holders", parentId: "accessories", order: 2 },
];

const vehicles = [
  {
    name: "Maruti Suzuki",
    models: [
      { name: "Swift", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { name: "Baleno", years: [2019, 2020, 2021, 2022, 2023, 2024] },
      { name: "Ertiga", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    name: "Hyundai",
    models: [
      { name: "i20", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
      { name: "Creta", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    name: "Toyota",
    models: [{ name: "Innova Crysta", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024] }],
  },
];

const products = [
  {
    name: "Clutch Assembly Kit (Plate + Cover + Bearing)",
    brand: "Valeo",
    oemNumber: "22400M74L00",
    categorySlugs: ["brakes", "clutch-assembly"],
    price: 6490,
    mrp: 8200,
    stock: 12,
    images: [],
    specs: { Type: "OES", Warranty: "6 months", Includes: "Plate, cover, release bearing" },
    fits: [{ make: "Maruti Suzuki", model: "Swift", from: 2018, to: 2024 }],
  },
  {
    name: "Brake Fluid DOT 4 — 500 ml",
    brand: "Bosch",
    oemNumber: "1987479107",
    categorySlugs: ["oils-fluids", "brake-oil"],
    price: 420,
    mrp: 550,
    stock: 80,
    images: [],
    specs: { Grade: "DOT 4", Volume: "500 ml", "Boiling point": "230°C" },
    fits: [
      { make: "Maruti Suzuki", model: "Swift", from: 2018, to: 2024 },
      { make: "Hyundai", model: "i20", from: 2018, to: 2024 },
      { make: "Toyota", model: "Innova Crysta", from: 2018, to: 2024 },
    ],
  },
  {
    name: "7D Floor Mat Set — Custom Fit",
    brand: "AutoZonIndia",
    oemNumber: "",
    categorySlugs: ["accessories", "mats"],
    price: 2999,
    mrp: 4500,
    stock: 25,
    images: [],
    specs: { Material: "PU leather + EVA", Pieces: "5", Colour: "Black / Tan" },
    fits: [{ make: "Toyota", model: "Innova Crysta", from: 2018, to: 2024 }],
  },
];

async function run() {
  const batch = db.batch();

  categories.forEach((c) => batch.set(db.collection("categories").doc(c.slug), c));
  batch.set(db.collection("meta").doc("vehicles"), { makes: vehicles });

  products.forEach(({ fits, ...p }) => {
    batch.set(db.collection("products").doc(), {
      ...p,
      vehicleKeys: expand(fits),
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, ${vehicles.length} makes.`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
