import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

✅ إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyBoXoSi376ZtbrIDc0Oa4_yf8-tJKcHV-4",
  authDomain: "database-nextstore.firebaseapp.com",
  projectId: "database-nextstore",
  storageBucket: "database-nextstore.appspot.com",
  messagingSenderId: "463214736059",
  appId: "1:463214736059:web:d882da8f1e06968eedef9e",
  measurementId: "G-M6M6KZ1W74",
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ دالة جاهزة للاستدعاء من ملفات أخرى
async function initFirebase() {
  return { auth, db };
}

export {
  initFirebase,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
