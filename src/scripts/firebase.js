import { firebaseConfig } from "./config.js"; // تأكد من المسار الصحيح
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, limit, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getAllProducts() {
  const q = query(collection(db, "products"), limit(6));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log("✅ تم جلب المنتجات:", products);
  return products;
}