// src/lib/products.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const PRODUCTS = collection(db, "products");
const CATEGORIES = collection(db, "categories");

const toItem = (snap) => ({ id: snap.id, ...snap.data() });

/** Top-level categories (parentId === null) ya kisi category ke sub-categories. */
export async function getCategories(parentId = null) {
  try {
    const snap = await getDocs(
      query(CATEGORIES, where("parentId", "==", parentId), orderBy("order"))
    );
    return snap.docs.map(toItem);
  } catch (err) {
    console.warn("Firestore getCategories error:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const snap = await getDocs(query(CATEGORIES, where("slug", "==", slug), limit(1)));
    return snap.empty ? null : toItem(snap.docs[0]);
  } catch (err) {
    console.warn("Firestore getCategoryBySlug error:", err);
    return null;
  }
}

/**
 * Category listing with optional vehicle filter + pagination.
 * vehicleKey format: "maruti|swift|2018"  (seed script isi tarah banata hai)
 */
export async function getProducts({
  categorySlug,
  vehicleKey,
  brand,
  pageSize = 24,
  cursor = null,
} = {}) {
  try {
    const clauses = [where("isActive", "==", true)];

    if (categorySlug) clauses.push(where("categorySlugs", "array-contains", categorySlug));
    else if (vehicleKey) clauses.push(where("vehicleKeys", "array-contains", vehicleKey));

    if (brand) clauses.push(where("brand", "==", brand));

    clauses.push(orderBy("createdAt", "desc"));
    if (cursor) clauses.push(startAfter(cursor));
    clauses.push(limit(pageSize));

    const snap = await getDocs(query(PRODUCTS, ...clauses));
    let items = snap.docs.map(toItem);

    // Firestore ek hi query me do array-contains allow nahi karta,
    // isliye dusra filter client side lagta hai.
    if (categorySlug && vehicleKey) {
      items = items.filter((p) => (p.vehicleKeys || []).includes(vehicleKey));
    }

    return { items, cursor: snap.docs[snap.docs.length - 1] || null, done: snap.size < pageSize };
  } catch (err) {
    console.warn("Firestore getProducts error:", err);
    return { items: [], cursor: null, done: true };
  }
}

export async function getProduct(id) {
  try {
    const snap = await getDoc(doc(db, "products", id));
    return snap.exists() ? toItem(snap) : null;
  } catch (err) {
    console.warn("Firestore getProduct error:", err);
    return null;
  }
}

/** Same category ke 4 aur products — PDP ke neeche dikhane ke liye. */
export async function getRelated(product, count = 4) {
  try {
    if (!product?.categorySlugs?.length) return [];
    const snap = await getDocs(
      query(
        PRODUCTS,
        where("isActive", "==", true),
        where("categorySlugs", "array-contains", product.categorySlugs.at(-1)),
        limit(count + 1)
      )
    );
    return snap.docs.map(toItem).filter((p) => p.id !== product.id).slice(0, count);
  } catch (err) {
    console.warn("Firestore getRelated error:", err);
    return [];
  }
}

/** Vehicle finder dropdowns ke liye. */
export async function getVehicleTree() {
  try {
    const snap = await getDoc(doc(db, "meta", "vehicles"));
    return snap.exists() ? snap.data().makes : [];
  } catch (err) {
    console.warn("Firestore getVehicleTree error:", err);
    return [];
  }
}

export const vehicleKeyOf = (make, model, year) =>
  `${make}|${model}|${year}`.toLowerCase().replace(/\s+/g, "-");
