// Message function
function showMessage(message, isError = false) {
  const existingMessage = document.getElementById("message");
  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement("div");
  messageDiv.id = "message"; // Set the ID
  messageDiv.className = isError ? "warning" : "success"; // Fixed class logic
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  // Trigger the animation
  setTimeout(() => {
    messageDiv.classList.add("active");
  }, 10);

  // Remove after delay
  setTimeout(() => {
    messageDiv.classList.remove("active");
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 300); // Wait for fade out transition
  }, 3000);
}

// Cart functions
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    console.error("Error reading cart:", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  } catch (e) {
    console.error("Error saving cart:", e);
  }
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  let cartElement =
    document.querySelector(".cart-linke a") ||
    document.querySelector(".cart-linke") ||
    document.querySelector(".cart-btn");

  if (cartElement) {
    let badge = cartElement.querySelector(".cart-count");
    if (!badge && totalItems > 0) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      cartElement.appendChild(badge);
    }

    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems;
      } else {
        badge.remove();
      }
    }
  }
}

// Image URL helper
function getImageUrl(imagePath) {
  if (!imagePath) return "./img/logo.webp";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.includes("_") && !imagePath.includes("/")) {
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${imagePath}`;
  }
  if (imagePath.startsWith("./img/") || /\.(webp|jpg|png)$/.test(imagePath)) {
    const cleanPath = imagePath.replace("./img/", "");
    return `https://res.cloudinary.com/dxbelrmq1/image/upload/${cleanPath}`;
  }
  return "./img/logo.webp";
}

// Product ID generator
function generateProductId(product) {
  return `${product.name}_${product.size}_${product.color}`.replace(
    /\s+/g,
    "_"
  );
}

// Get cart items with details
function getCartItemsWithDetails() {
  const cart = getCart();
  if (cart.length === 0) return [];

  return cart.map((item) => ({
    cartItemId: item.id || generateProductId(item),
    name: item.name,
    price: item.price,
    currency: item.currency || "YER",
    quantity: item.quantity || 1,
    size: item.size || "",
    color: item.color || "",
    image: getImageUrl(item.image),
  }));
}

function formatPrice(price, currency) {
  if (currency === "YER") return `${price.toLocaleString()} ر.ي`;
  if (currency === "SAR") return `${price} ر.س`;
  return `${price} ${currency}`;
}

// Render cart
function renderCart() {
  const container = document.getElementById("cart-container");
  const items = getCartItemsWithDetails();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h2>السلة فارغة</h2>
        <p>لم تقم بإضافة أي منتجات بعد</p>
        <a href="./index.html#products" class="continue-shopping">تصفح المنتجات</a>
      </div>
    `;
    return;
  }

  const currency = items[0].currency;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = currency === "YER" ? 5000 : 30;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-content">
      <div class="cart-items">
        ${items
          .map(
            (item) => `
          <div class="cart-item" data-id="${item.cartItemId}">
            <img src="${item.image}" alt="${item.name}" class="item-image" 
                 onerror="this.src='./img/logo.webp'">
            <div class="item-details">
              <h3 class="item-name">${item.name}</h3>
              ${
                item.size
                  ? `<p class="item-size"> المقاس: ${item.size}</p>`
                  : ""
              }
              ${
                item.color
                  ? `<p class="item-color"> اللون: ${item.color}</p>`
                  : ""
              }
              <p class="item-price">${formatPrice(
                item.price,
                item.currency
              )}</p>
              <div class="item-controls">
                <div class="quantity-controls">
                  <button class="quantity-btn minus" data-id="${
                    item.cartItemId
                  }">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="quantity-btn plus" data-id="${
                    item.cartItemId
                  }">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <button class="remove-btn" data-id="${item.cartItemId}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="cart-summary">
        <h2 class="summary-title">ملخص الطلب</h2>
        <div class="summary-row">
          <span>المجموع الفرعي</span>
          <span>${formatPrice(subtotal, currency)}</span>
        </div>
        <div class="summary-row">
          <span>الشحن</span>
          <span>${formatPrice(shipping, currency)}</span>
        </div>
        <div class="summary-row">
          <span>المجموع الكلي</span>
          <span>${formatPrice(total, currency)}</span>
        </div>
        <button class="checkout-btn" id="checkout-btn">إتمام الطلب</button>
      </div>
    </div>
  `;

  setupEventListeners();
}

// Event listeners - FIXED to prevent multiple triggers
let isProcessing = false;

function setupEventListeners() {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }

  // Handle quantity buttons
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (isProcessing) return;
      isProcessing = true;

      const itemId = this.getAttribute("data-id");
      const isMinus = this.classList.contains("minus");
      const isPlus = this.classList.contains("plus");

      if (isMinus) {
        updateQuantity(itemId, -1);
      } else if (isPlus) {
        updateQuantity(itemId, 1);
      }

      setTimeout(() => {
        isProcessing = false;
      }, 300);
    });
  });

  // Handle remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const itemId = this.getAttribute("data-id");
      removeItem(itemId);
    });
  });
}

const MAX_QUANTITY = 10;

// FIXED: Update quantity by exact amount
function updateQuantity(itemId, change) {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    (item) => (item.id || generateProductId(item)) === itemId
  );

  if (itemIndex === -1) return;

  // Ensure quantity exists
  const currentQuantity = parseInt(cart[itemIndex].quantity) || 1;
  const newQuantity = currentQuantity + change;

  if (newQuantity <= 0) {
    // Remove item if quantity reaches zero
    cart.splice(itemIndex, 1);
    saveCart(cart);
    showMessage("تم حذف المنتج من السلة");
    renderCart();
  } else if (newQuantity > MAX_QUANTITY) {
    // Don't exceed max quantity
    showMessage(`الحد الأقصى للكمية هو ${MAX_QUANTITY}`, true);
  } else {
    // Update quantity
    cart[itemIndex].quantity = newQuantity;
    saveCart(cart);
    showMessage(change > 0 ? "تم زيادة الكمية" : "تم تقليل الكمية");
    renderCart();
  }
}

// FIXED: Remove without confirmation
function removeItem(itemId) {
  const cart = getCart();
  const newCart = cart.filter(
    (item) => (item.id || generateProductId(item)) !== itemId
  );
  saveCart(newCart);
  showMessage("تم حذف المنتج من السلة");
  renderCart();
}

function checkout() {
  const items = getCartItemsWithDetails();
  if (items.length === 0) {
    showMessage("السلة فارغة!", true);
    return;
  }

  const message = createWhatsAppMessage(items);
  const phoneNumber = "+966500000000";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
  showMessage("جاري تحويلك إلى واتساب لإتمام الطلب");
}

function createWhatsAppMessage(items) {
  let message = "مرحباً، أريد طلب المنتجات التالية من متجر نكست:\n\n";

  items.forEach((item, index) => {
    message += ` ${index + 1}. ${item.name}\n`;
    message += ` الكمية: ${item.quantity}\n`;
    if (item.size) message += ` المقاس: ${item.size}\n`;
    if (item.color) message += `  اللون: ${item.color}\n`;
    message += ` السعر: ${formatPrice(
      item.price * item.quantity,
      item.currency
    )}\n\n`;
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const currency = items[0].currency;
  const shipping = currency === "YER" ? 5000 : 30;
  const grandTotal = total + shipping;

  message += ` المجموع الفرعي: ${formatPrice(total, currency)}\n`;
  message += ` الشحن: ${formatPrice(shipping, currency)}\n`;
  message += ` المجموع الكلي: ${formatPrice(grandTotal, currency)}\n\n`;
  message += "شكراً لكم! 🌟";

  return message;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});

window.addEventListener("storage", (e) => {
  if (e.key === "cart") {
    renderCart();
    updateCartCount();
  }
});

// Make functions globally available
window.cartUpdateQuantity = updateQuantity;
window.cartRemoveItem = removeItem;
window.cartCheckout = checkout;
