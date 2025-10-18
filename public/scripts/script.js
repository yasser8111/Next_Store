// ===== Navbar background toggle on scroll =====
const navbar = document.getElementById("navbar");

function toggleNavbarBg() {
  navbar.classList.toggle("top", window.scrollY <= 1);
}
window.addEventListener("scroll", toggleNavbarBg);
window.addEventListener("load", toggleNavbarBg);

// ===== Smooth scroll with offset below navbar =====
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

// ===== Close mobile nav when clicking outside =====
document.addEventListener('click', (event) => {
  // Check if click is outside nav menu and nav toggle button
  if (!navMenu.contains(event.target) && 
      !navToggle.contains(event.target) && 
      navMenu.classList.contains('show')) {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

// =============================================================
// 🛒 CART BADGE SYSTEM - نظام عداد السلة
// =============================================================

/**
 * تحديث عداد السلة في الواجهة
 * يعرض دائرة صغيرة بعدد المنتجات في السلة
 */
function updateCartCount() {
  // قراءة السلة من localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // حساب العدد الإجمالي للمنتجات (مع احتساب الكميات)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // البحث عن عنصر السلة في الصفحة
  let cartElement =
    document.querySelector(".cart-linke a") ||
    document.querySelector(".cart-linke") ||
    document.querySelector(".cart-btn");

  // إذا لم يتم العثور على عنصر السلة، أوقف التنفيذ
  if (!cartElement) {
    console.warn("⚠️ Cart element not found");
    return;
  }

  // البحث عن الدائرة (Badge) إذا كانت موجودة
  let badge = cartElement.querySelector(".cart-count");

  // إذا لم تكن الدائرة موجودة وهناك منتجات، قم بإنشائها
  if (!badge && totalItems > 0) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    cartElement.appendChild(badge);
  }

  // تحديث أو إزالة الدائرة
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
    } else {
      badge.remove();
    }
  }
}

/**
 * تهيئة نظام عداد السلة عند تحميل الصفحة
 */
function initCartBadge() {
  // تحديث العداد عند تحميل الصفحة
  updateCartCount();

  // الاستماع لتغييرات localStorage من صفحات أخرى
  window.addEventListener("storage", (e) => {
    if (e.key === "cart") {
      updateCartCount();
    }
  });
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", initCartBadge);

// جعل الدالة متاحة عالمياً
window.updateCartCount = updateCartCount;

// =============================================================
// 📦 HELPER FUNCTIONS - دوال مساعدة
// =============================================================

/**
 * إضافة منتج للسلة
 * @param {Object} item - المنتج المراد إضافته
 */
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // البحث عن المنتج إذا كان موجوداً مسبقاً
  const existing = cart.find(
    (p) =>
      p.name === item.name && p.size === item.size && p.color === item.color
  );

  if (existing) {
    // زيادة الكمية إذا كان موجوداً
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    // إضافة منتج جديد
    item.quantity = 1;
    cart.push(item);
  }

  // حفظ السلة وتحديث العداد
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/**
 * حذف منتج من السلة
 * @param {string} itemId - معرف المنتج
 */
function removeFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/**
 * تفريغ السلة بالكامل
 */
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
}

/**
 * الحصول على عدد المنتجات في السلة
 * @returns {number} - عدد المنتجات
 */
function getCartItemsCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

// جعل الدوال متاحة عالمياً
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCartItemsCount = getCartItemsCount;