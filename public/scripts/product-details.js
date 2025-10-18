import { initFirebase } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Initialize Firebase
const { db } = await initFirebase();

// =============================================================
// 🎬 ANIMATION FUNCTIONS
// =============================================================

function addToCartWithAnimation(productElement) {
  const productImg = productElement.querySelector("img");

  // Find cart element
  let cartElement = document.querySelector(".cart-linke a");

  if (!cartElement) {
    cartElement = document.querySelector(".cart-linke");
  }

  if (!cartElement) {
    cartElement = document.querySelector(".cart-btn");
  }

  if (!productImg || !cartElement) {
    console.error("Product image or cart element not found");
    return;
  }

  console.log("Animation starting - Cart element found:", cartElement);

  // Create flying image
  const flyingImg = document.createElement("img");
  flyingImg.src = productImg.src;
  flyingImg.className = "flying-image";

  // Get positions
  const imgRect = productImg.getBoundingClientRect();
  const cartRect = cartElement.getBoundingClientRect();

  console.log("Image position:", imgRect);
  console.log("Cart position:", cartRect);

  // Set initial position
  const startX = imgRect.left + imgRect.width / 2 - 40;
  const startY = imgRect.top + imgRect.height / 2 - 40;

  flyingImg.style.left = startX + "px";
  flyingImg.style.top = startY + "px";

  document.body.appendChild(flyingImg);

  // Calculate end position
  const endX = cartRect.left + cartRect.width / 2 - 40;
  const endY = cartRect.top + cartRect.height / 2 - 40;

  const translateX = endX - startX;
  const translateY = endY - startY;

  console.log("Translation:", { translateX, translateY });

  // Start animation
  setTimeout(() => {
    flyingImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2) rotate(360deg)`;
    flyingImg.style.opacity = "0";
  }, 10);

  // Bump cart element
  if (cartElement) {
    cartElement.classList.add("bump");
    setTimeout(() => cartElement.classList.remove("bump"), 300);
  }

  // Remove flying image
  setTimeout(() => flyingImg.remove(), 900);

  // Update cart count
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  console.log("Updating cart count:", totalItems);

  let cartElement = document.querySelector(".cart-linke a");

  if (!cartElement) {
    cartElement = document.querySelector(".cart-linke");
  }

  if (!cartElement) {
    cartElement = document.querySelector(".cart-btn");
  }

  if (!cartElement) {
    console.error("Cart element not found for badge");
    return;
  }

  console.log("Cart element for badge:", cartElement);

  let badge = cartElement.querySelector(".cart-count");

  if (!badge && totalItems > 0) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    cartElement.appendChild(badge);
    console.log("Badge created");
  }

  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      console.log("Badge updated:", totalItems);
    } else {
      badge.remove();
      console.log("Badge removed");
    }
  }
}

function showSuccessMessage(message) {
  let messageDiv = document.querySelector("#message");

  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = "message";
    document.body.appendChild(messageDiv);
  }

  messageDiv.classList.remove("warning", "success", "active");
  messageDiv.textContent = message;
  messageDiv.classList.add("success", "active");

  setTimeout(() => {
    messageDiv.classList.remove("active");
  }, 3000);
}

// =============================================================
// 📦 MAIN LOGIC
// =============================================================

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".product-details");
  if (!container) return;

  // Update cart count on page load
  updateCartCount();

  // Configuration
  const colorMap = {
    أسود: "#000000",
    أبيض: "#ffffff",
    أزرق: "#007bff",
    أحمر: "#ff0000",
  };

  // Get product from localStorage
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    container.innerHTML =
      '<p style="text-align:center;padding:3rem;">لم يتم العثور على المنتج</p>';
    return;
  }

  // Create dynamic content
  container.innerHTML = buildProductHTML(product);

  // DOM Elements
  const warning = container.querySelector("#message");
  const sizeBtns = container.querySelectorAll(".size-btn");
  const colorContainer = container.querySelector(".color-options");
  const addToCartBtn = container.querySelector("#add-to-cart");

  // Create color buttons
  renderColorButtons(product.colors, colorContainer, colorMap);

  // Auto-activate color if only one available
  const colorBtns = colorContainer.querySelectorAll(".color-btn");
  if (colorBtns.length === 1) colorBtns[0].classList.add("active");

  // Button event handlers
  sizeBtns.forEach((btn) => {
    if (!btn.classList.contains("disabled")) {
      btn.addEventListener("click", () => {
        activateButton(btn, sizeBtns);
        hideWarning(); // Hide warning when size is selected
      });
    }
  });

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activateButton(btn, colorBtns);
      hideWarning(); // Hide warning when color is selected
    });
  });

  // Add to cart button handler
  addToCartBtn.addEventListener("click", () => {
    const size = getSelected(sizeBtns);
    const color = getSelected(colorBtns);

    // Check if both size and color are selected
    if (!size && !color) {
      showWarning("الرجاء اختيار المقاس واللون أولاً");
      return;
    }

    if (!size) {
      showWarning("الرجاء اختيار المقاس أولاً");
      return;
    }

    if (!color) {
      showWarning("الرجاء اختيار اللون أولاً");
      return;
    }

    const orderItem = {
      name: product.name,
      size: size.dataset.size,
      color: color.dataset.color,
      price: product.price,
      currency: product.currency,
      image: product.images[0],
      quantity: 1,
    };

    // Add product to cart
    addToCart(orderItem);

    // 🎬 Play animation
    const imgContainer = container.querySelector(".img-con");
    addToCartWithAnimation(imgContainer);

    // 🎉 Show success message
    showSuccessMessage("تم إضافة المنتج إلى السلة بنجاح!");

    // Update button state
    addToCartBtn.innerHTML = `<i class="fa-solid fa-check"></i> تمت الإضافة للسلة`;
    addToCartBtn.disabled = true;

    // Re-enable button after 2 seconds
    setTimeout(() => {
      addToCartBtn.innerHTML = "أضف إلى السلة";
      addToCartBtn.disabled = false;
    }, 2000);
  });

  // Initialize Swiper for images
  new Swiper(".product-swiper", {
    loop: true,
    pagination: { el: ".swiper-pagination" },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

// =============================================================
// 📦 HELPER FUNCTIONS
// =============================================================

function buildProductHTML(product) {
  return `
        <div id="message" class="warning-message">الرجاء اختيار المقاس واللون أولاً</div>

        <div class="img-con">
            <div class="swiper product-swiper">
                <div class="swiper-wrapper">
                    ${product.images
                      .map(
                        (src) => `
                        <div class="swiper-slide">
                            <img src="https://res.cloudinary.com/dxbelrmq1/image/upload/${src}" 
                                alt="${product.name}" loading="lazy">
                        </div>`
                      )
                      .join("")}
                </div>
                <div class="swiper-button-prev"><i class="fa-solid fa-caret-right"></i></div>
                <div class="swiper-button-next"><i class="fa-solid fa-caret-left"></i></div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

        <div class="product-info">
            <h1>${product.name}</h1>
            <p>${product.description}</p>

            <div class="options">
                <label>اختر المقاس:</label>
                <div class="size-options">
                    ${["S", "M", "L", "XL", "XXL", "XXXL"]
                      .map(
                        (size) => `
                            <button class="size-btn ${
                              product.sizes.includes(size) ? "" : "disabled"
                            }" data-size="${size}">${size}</button>
                        `
                      )
                      .join("")}
                </div>
            </div>

            <div class="options">
                <label>اختر اللون:</label>
                <div class="color-options"></div>
            </div>

            <div class="product-price">${product.price} ${
    product.currency
  }</div>
            <button id="add-to-cart" class="btn-buy">أضف إلى السلة</button>

            <div class="product-specs">
                <h3>تفاصيل المنتج:</h3>
                <ul>
                    ${
                      product.specs
                        ?.map(
                          (s) =>
                            `<li><strong>${s.title}:</strong> ${s.value}</li>`
                        )
                        .join("") || ""
                    }
                </ul>
            </div>
        </div>
    `;
}

function renderColorButtons(colors = [], container, colorMap) {
  container.innerHTML = "";
  colors.forEach((color) => {
    const btn = document.createElement("div");
    btn.className = "color-btn";
    btn.dataset.color = color;
    btn.title = color;
    btn.style.backgroundColor = colorMap[color] || "#ccc";
    container.appendChild(btn);
  });
}

function getSelected(btns) {
  return [...btns].find((b) => b.classList.contains("active"));
}

function activateButton(btn, group) {
  group.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function showWarning(message) {
  const warning = document.querySelector("#message");
  if (!warning) return;

  // Update warning message
  warning.textContent = message;
  warning.classList.add("warning", "active", "shake");

  // Clear any existing timeout
  if (warning.timeoutId) {
    clearTimeout(warning.timeoutId);
  }

  // Auto-hide after 5 seconds
  warning.timeoutId = setTimeout(() => {
    warning.classList.remove("active", "shake");
  }, 5000);
}

function hideWarning() {
  const warning = document.querySelector("#message");
  if (warning) {
    warning.classList.remove("active", "shake");
    if (warning.timeoutId) {
      clearTimeout(warning.timeoutId);
    }
  }
}

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(
    (p) =>
      p.name === item.name && p.size === item.size && p.color === item.color
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}
