// js/config.js
export const firebaseConfig = {
  apiKey: window.env?.FIREBASE_API_KEY || "AIzaSyBoXoSi376ZtbrIDc0Oa4_yf8-tJKcHV-4",
  authDomain: window.env?.FIREBASE_AUTH_DOMAIN || "database-nextstore.firebaseapp.com",
  projectId: window.env?.FIREBASE_PROJECT_ID || "database-nextstore",
  storageBucket: window.env?.FIREBASE_STORAGE_BUCKET || "database-nextstore.appspot.com",
  messagingSenderId: window.env?.FIREBASE_MESSAGING_SENDER_ID || "463214736059",
  appId: window.env?.FIREBASE_APP_ID || "1:463214736059:web:d882da8f1e06968eedef9e",
};
