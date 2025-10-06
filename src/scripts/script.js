// ===== Navbar background toggle on scroll =====
const navbar = document.getElementById("navbar");

function toggleNavbarBg() {
  navbar.classList.toggle("top", window.scrollY <= 1);
}
window.addEventListener("scroll", toggleNavbarBg);
window.addEventListener("load", toggleNavbarBg);

// ===== Smooth scroll with small offset below navbar =====
(() => {
  const nav = document.querySelector(".navbar");

  const getOffset = () =>
    (nav?.offsetHeight || 0) + (window.innerWidth >= 992 ? 24 : 12);

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - getOffset();
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // Handle internal link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    if (!id) return;

    e.preventDefault();
    history.replaceState(null, "", "#" + id);
    scrollToId(id);
  });

  // Handle page load with hash
  window.addEventListener("load", () => {
    if (location.hash) scrollToId(location.hash.slice(1));
  });

  // Handle back/forward navigation
  window.addEventListener("hashchange", () => {
    if (location.hash) scrollToId(location.hash.slice(1));
  });
})();

// ===== Mobile nav toggle =====
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  navToggle.classList.toggle("active");
});

navMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

// ===== Fetch and display products =====

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoXoSi376ZtbrIDc0Oa4_yf8-tJKcHV-4",
  authDomain: "database-nextstore.firebaseapp.com",
  projectId: "database-nextstore",
  storageBucket: "database-nextstore.firebasestorage.app",
  messagingSenderId: "463214736059",
  appId: "1:463214736059:web:d882da8f1e06968eedef9e",
  measurementId: "G-M6M6KZ1W74",
};

// const firebaseConfig = {
//   apiKey: "VITE_FIREBASE_API_KEY",
//   authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
//   projectId: "VITE_FIREBASE_PROJECT_ID",
//   storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
//   messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
//   appId: "VITE_FIREBASE_APP_ID",
//   measurementId: "VITE_FIREBASE_MEASUREMENT_ID"
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadProducts() {
  const grid = document.querySelector(".product-grid");
  const loadingContainer = document.getElementById("loading-container");
  const customizeCard = document.getElementById("customize-card");

  // التحقق من وجود العنصر قبل المتابعة
  if (!grid) return;

  // إخفاء الشبكة في البداية
  grid.classList.remove("loaded");

  try {
    // إظهار رسالة التحميل
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }

    const snapshot = await getDocs(collection(db, "products"));

    snapshot.forEach((doc) => {
      const p = { id: doc.id, ...doc.data() };
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = p.id;

      // عند الضغط على المنتج
      card.onclick = () => {
        localStorage.setItem("selectedProduct", JSON.stringify(p));
        window.location.href = `product-details.html?id=${p.id}`;
      };

      // ✅ إضافة مسار src/assets/ تلقائياً
      const imagePath = `./src/assets/img/t-shirt/${p.images[0]}`;

      card.innerHTML = `
    <img src="${imagePath}" alt="${p.name}" loading="lazy">
    <h3>${p.name}</h3>
    <p>${p.price} ${p.currency}</p>
  `;

      grid.appendChild(card);
    });

    // إخفاء رسالة التحميل وإظهار المنتجات
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }

    // إظهار بطاقة التصميم المخصص
    if (customizeCard) {
      customizeCard.style.display = "block";
    }

    grid.classList.add("loaded");
  } catch (error) {
    console.error("Error loading products:", error);

    // عرض رسالة خطأ بدلاً من رسالة التحميل
    if (loadingContainer) {
      loadingContainer.innerHTML = `
        <p class="loading-text" style="color: #e74c3c;">حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.</p>
      `;
    }
  }
}

loadProducts();
