import { initFirebase } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// تهيئة Firebase
const { db } = await initFirebase();

document.addEventListener("DOMContentLoaded", async () => {
  // ===== DOM container =====
  const container = document.querySelector(".product-details");
  if (!container) return;

  const phoneNumber = "967739770762";
  const colorMap = {
    أسود: "#000000",
    أبيض: "#ffffff",
    أزرق: "#007bff",
    أحمر: "#ff0000",
  };
  const warningDuration = 5000;

  // ===== Get product from localStorage =====
  const product =
    JSON.parse(localStorage.getItem("selectedProduct")) ||
    (await fetchSampleProduct());

  // ===== Build product HTML dynamically =====
  container.innerHTML = `
    <div id="warning-message">الرجاء اختيار المقاس واللون أولاً</div>
    <div class="img-con">
      <div class="swiper product-swiper">
        <div class="swiper-wrapper">
          ${product.images
            .map(
              (src) => `
    <div class="swiper-slide">
      <img src="https://res.cloudinary.com/dxbelrmq1/image/upload/${src}" alt="${product.name}" loading="lazy">
    </div>
  `
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

      <div class="product-price">${product.price} ${product.currency}</div>
      <a id="whatsapp-link" href="#" target="_blank" class="btn-buy">اطلب عبر واتساب</a>

      <div class="product-specs">
        <h3>تفاصيل المنتج:</h3>
        <ul>
          ${
            product.specs
              ?.map((s) => `<li><strong>${s.title}:</strong> ${s.value}</li>`)
              .join("") || ""
          }
        </ul>
      </div>
    </div>
  `;

  // ===== Select dynamic elements =====
  const whatsappLink = container.querySelector("#whatsapp-link");
  const warning = container.querySelector("#warning-message");
  const sizeBtns = container.querySelectorAll(".size-btn");
  const colorContainer = container.querySelector(".color-options");
  const productTitle = container.querySelector(".product-info h1");

  // ===== Populate colors dynamically =====
  colorContainer.innerHTML = "";
  product.colors?.forEach((color) => {
    const btn = document.createElement("div");
    btn.className = "color-btn";
    btn.dataset.color = color;
    btn.style.backgroundColor = colorMap[color] || "#ffffff";
    colorContainer.appendChild(btn);
  });

  // ===== Helper functions =====
  const getSelected = (btns) =>
    [...btns].find((b) => b.classList.contains("active"));
  const activateBtn = (btn) => {
    btn.parentElement
      .querySelectorAll(".active")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    warning.classList.remove("active", "shake");
    updateLink();
  };
  const updateLink = () => {
    const size = getSelected(sizeBtns);
    const color = getSelected(colorContainer.querySelectorAll(".color-btn"));
    whatsappLink.href =
      size && color
        ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            `Hello, I want to buy ${productTitle.textContent} in size ${size.dataset.size} and color ${color.dataset.color}`
          )}`
        : "#";
  };

  // ===== Event listeners =====
  sizeBtns.forEach((btn) => {
    if (!btn.classList.contains("disabled")) {
      btn.addEventListener("click", () => activateBtn(btn));
    }
  });

  colorContainer
    .querySelectorAll(".color-btn")
    .forEach((btn) => btn.addEventListener("click", () => activateBtn(btn)));

  whatsappLink.addEventListener("click", (e) => {
    if (
      !getSelected(sizeBtns) ||
      !getSelected(colorContainer.querySelectorAll(".color-btn"))
    ) {
      e.preventDefault();
      warning.classList.contains("active")
        ? (warning.classList.remove("shake"),
          void warning.offsetWidth,
          warning.classList.add("shake"))
        : warning.classList.add("active");
      clearTimeout(warning.timeoutId);
      warning.timeoutId = setTimeout(
        () => warning.classList.remove("active", "shake"),
        warningDuration
      );
    }
  });

  // ===== Initialize Swiper =====
  new Swiper(".product-swiper", {
    loop: true,
    pagination: { el: ".swiper-pagination" },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // ===== Sample fallback product if localStorage empty =====
  async function fetchSampleProduct() {
    // Optional: fetch from Firebase if needed
    const snapshot = await getDocs(collection(db, "products"));
    const first = snapshot.docs[0]?.data();
    return (
      first || {
        name: "تيشيرت افتراضي",
        description: "وصف افتراضي للتيشيرت",
        price: 15000,
        currency: "YER",
        images: ["AOT_1.webp", "AOT_2.webp"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["أسود", "أبيض", "أزرق"],
        specs: [
          { title: "الخامة", value: "قطن 100%" },
          { title: "الغسيل", value: "غسيل يدوي" },
        ],
      }
    );
  }
});
