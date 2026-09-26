import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

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

async function runTest() {
  console.log("=== ADDING TOYOTA GLANZA BRAKE PAD TO FIRESTORE ===");
  const docRef = await addDoc(collection(db, "products"), {
    name: "Toyota Glanza Brake Pad",
    title: "Toyota Glanza Brake Pad",
    category: "Brakes",
    carBrand: "Toyota",
    carModel: "Glanza",
    variant: "V 1.2L",
    partNumber: "KAMTI-TY-GL-BP01",
    sku: "KAMTI-TY-GL-BP01",
    mrp: 2500,
    sellingPrice: 1999,
    price: 1999,
    desc: "100% Genuine Toyota Glanza OEM Front Brake Pad set with high thermal resistance ceramic friction pads.",
    stock: 25,
    inStock: true,
    isActive: true,
    image: "/images/brake_disc_rotor.jpg",
    images: ["/images/brake_disc_rotor.jpg"],
    createdAt: new Date().toISOString()
  });

  console.log("SUCCESS! Created Document ID in Firestore:", docRef.id);

  const snapshot = await getDocs(collection(db, "products"));
  console.log(`Total Products in Firestore 'products' collection: ${snapshot.docs.length}`);
}

runTest().catch(console.error);
