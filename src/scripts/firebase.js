// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, limit, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBoXoSi376ZtbrIDc0Oa4_yf8-tJKcHV-4",
  authDomain: "database-nextstore.firebaseapp.com",
  projectId: "database-nextstore",
  storageBucket: "database-nextstore.firebasestorage.app",
  messagingSenderId: "463214736059",
  appId: "1:463214736059:web:your-app-id"
};

// تهيئة Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// دالة جلب المنتجات
export async function getAllProducts() {
  const q = query(collection(db, "products"), limit(6));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log("✅ تم جلب المنتجات:", products);
  return products;
}
