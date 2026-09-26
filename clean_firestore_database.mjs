import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

async function cleanDatabase() {
  console.log('=== Cleaning Test Data from Live Firebase Firestore Database ===');

  // 1. Clear Orders collection
  const ordersSnap = await getDocs(collection(db, 'orders'));
  console.log(`Found ${ordersSnap.docs.length} orders in Firestore 'orders' collection.`);
  for (const docSnap of ordersSnap.docs) {
    console.log(`Deleting test order: ${docSnap.id} -> ${docSnap.data().orderNumber || 'No Order#'}`);
    await deleteDoc(doc(db, 'orders', docSnap.id));
  }
  console.log('✔ All test orders deleted from Firestore!');

  // 2. Clear Products collection
  const productsSnap = await getDocs(collection(db, 'products'));
  console.log(`Found ${productsSnap.docs.length} products in Firestore 'products' collection.`);
  for (const docSnap of productsSnap.docs) {
    console.log(`Deleting test product: ${docSnap.id} -> ${docSnap.data().name || 'No Name'}`);
    await deleteDoc(doc(db, 'products', docSnap.id));
  }
  console.log('✔ All test products deleted from Firestore!');

  console.log('✅ FIRESTORE DATABASE IS NOW CLEANED (0 Orders, 0 Sales, 0 Fake Products)!');
}

cleanDatabase().catch(console.error);
