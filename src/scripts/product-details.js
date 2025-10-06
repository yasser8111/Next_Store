document.addEventListener("DOMContentLoaded", () => {
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

  if (
    !whatsappLink ||
    !warning ||
    !sizeContainer ||
    !colorContainer ||
    !swiperWrapper ||
    !productTitle
  ) {
    console.error("Missing required HTML elements");
    return;
  }

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

  // ===== Color map =====
  const colorMap = {
    أسود: "#000000",
    أبيض: "#ffffff",
  };

  // ===== استرجاع بيانات المنتج من localStorage =====
  const productData = localStorage.getItem("selectedProduct");

  if (!productData) {
    console.error("No product data found in localStorage");
    return;
  }

  let product;
  try {
    product = JSON.parse(productData);
    console.log("Product loaded from localStorage:", product);
  } catch (err) {
    console.error("Error parsing product data:", err);
    return;
  }

  // ===== عرض بيانات المنتج =====

  // ===== Images =====
  if (product.images && product.images.length > 0) {
    swiperWrapper.innerHTML = product.images
      .map(
        (src) =>
          `<div class="swiper-slide"><img src="./public/img/t-shirt/${src}" alt="${product.name}"></div>`
      )
      .join("");
    if (window.productSwiper) window.productSwiper.destroy(true, true);
    window.productSwiper = new Swiper(".product-swiper", {
      loop: true,
      pagination: { el: ".swiper-pagination" },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  // ===== Product info =====
  productTitle.textContent = product.name || "";
  productDesc.textContent = product.description || "";
  productPrice.textContent = `${product.price || 0} ${product.currency || ""}`;

  // ===== Sizes =====
  const availableSizes = product.sizes
    ? product.sizes.map((s) => s.value || s)
    : [];
  document.querySelectorAll(".size-btn").forEach((btn) => {
    if (!availableSizes.includes(btn.dataset.size))
      btn.classList.add("disabled");
    else btn.classList.remove("disabled");
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("disabled")) activateBtn(btn);
    });
  });

  // ===== Colors =====
  colorContainer.innerHTML = "";
  if (product.colors && product.colors.length > 0) {
    product.colors.forEach((color) => {
      const div = document.createElement("div");
      div.className = "color-btn";
      div.dataset.color = color;
      div.style.backgroundColor = colorMap[color] || "#ffffff";
      div.addEventListener("click", () => activateBtn(div));
      colorContainer.appendChild(div);
    });
    if (product.colors.length === 1)
      activateBtn(colorContainer.querySelector(".color-btn"));
  }

  // ===== Specs =====
  if (specsList) {
    specsList.innerHTML =
      product.specs && product.specs.length > 0
        ? product.specs
            .map((s) => `<li><strong>${s.title}:</strong> ${s.value}</li>`)
            .join("")
        : "";
  }

  updateLink();
});
