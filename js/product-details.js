// ===== Elements =====
const whatsappLink = document.getElementById("whatsapp-link");
const warning = document.getElementById("warning-message");
const sizeContainer = document.querySelector(".size-options");
const colorContainer = document.querySelector(".color-options");
const swiperWrapper = document.querySelector(".swiper-wrapper");
const productTitle = document.querySelector(".product-info h1");
const productDesc = document.querySelector(".product-info p");
const productPrice = document.querySelector(".product-price");
const specsList = document.querySelector(".product-specs ul");

// ===== Phone number =====
const phoneNumber = "967739770762";

// ===== Helper to get selected button =====
const getSelected = (btns) =>
  [...btns].find((b) => b.classList.contains("active"));

// ===== Update WhatsApp link =====
const updateLink = () => {
  const size = getSelected(
    document.querySelectorAll(".size-btn:not(.disabled)")
  );
  const color = getSelected(document.querySelectorAll(".color-btn"));
  whatsappLink.href =
    size && color
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          `Hello,\nI want to buy ${productTitle.textContent} in size ${size.dataset.size} and color ${color.dataset.color}`
        )}`
      : "#";
};

// ===== Activate a button =====
const activateBtn = (btn) => {
  btn.parentElement
    .querySelectorAll(".active")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  warning.classList.remove("active", "shake");
  updateLink();
};

// ===== WhatsApp click handler =====
whatsappLink.addEventListener("click", (e) => {
  const sizeSelected = getSelected(
    document.querySelectorAll(".size-btn:not(.disabled)")
  );
  const colorSelected = getSelected(document.querySelectorAll(".color-btn"));
  if (!sizeSelected || !colorSelected) {
    e.preventDefault();
    warning.classList.contains("active")
      ? (warning.classList.remove("shake"),
        void warning.offsetWidth,
        warning.classList.add("shake"))
      : warning.classList.add("active");
    clearTimeout(warning.timeoutId);
    warning.timeoutId = setTimeout(
      () => warning.classList.remove("active", "shake"),
      5000
    );
  }
});

// ===== Get product ID from URL =====
const productId = parseInt(
  new URLSearchParams(window.location.search).get("id")
);

const colorMap = {
  "أسود": "#000000",
  "أبيض": "#ffffff",
};


// ===== Fetch product data =====
fetch("data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // ===== Swiper images =====
    swiperWrapper.innerHTML = product.images
      .map(
        (src) =>
          `<div class="swiper-slide"><img src="${src}" alt="${product.name}"></div>`
      )
      .join("");
    if (window.productSwiper) productSwiper.destroy(true, true);
    window.productSwiper = new Swiper(".product-swiper", {
      loop: true,
      pagination: { el: ".swiper-pagination" },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    // ===== Product info =====
    productTitle.textContent = product.name;
    productDesc.textContent = product.description;
    productPrice.textContent = `${product.price} ${product.currency}`;

    // ===== Sizes (control availability only, buttons already in HTML) =====
    const availableSizes = product.sizes.map((s) => s.value || s); // جميع الأحجام المتوفرة

    document.querySelectorAll(".size-btn").forEach((btn) => {
      if (!availableSizes.includes(btn.dataset.size)) {
        btn.classList.add("disabled");
      } else {
        btn.classList.remove("disabled");
      }
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("disabled")) activateBtn(btn);
      });
    });

    // ===== Colors (add from JSON, auto-select if only one) =====
    colorContainer.innerHTML = ""; // نفرغ المحتوى القديم

    product.colors.forEach((color) => {
      const div = document.createElement("div");
      div.className = "color-btn";
      div.dataset.color = color;
      div.style.backgroundColor = colorMap[color] || "#ffffff";
      div.addEventListener("click", () => activateBtn(div));
      colorContainer.appendChild(div);
    });

    // ===== Auto-select if only one color =====
    if (product.colors.length === 1) {
      const onlyColorBtn = colorContainer.querySelector(".color-btn");
      activateBtn(onlyColorBtn);
    }

    // ===== Specs =====
    specsList.innerHTML = product.specs
      .map((s) => `<li><strong>${s.title}:</strong> ${s.value}</li>`)
      .join("");

    // ===== Update WhatsApp link =====
    updateLink();
  })
  .catch(console.error);
