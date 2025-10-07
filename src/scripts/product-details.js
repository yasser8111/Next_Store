document.addEventListener("DOMContentLoaded", () => {
  // ===== Select DOM elements =====
  const whatsappLink = document.getElementById("whatsapp-link");
  const warning = document.getElementById("warning-message");
  const sizeBtns = document.querySelectorAll(".size-btn");
  const colorContainer = document.querySelector(".color-options");
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const productTitle = document.querySelector(".product-info h1");
  const productDesc = document.querySelector(".product-info p");
  const productPrice = document.querySelector(".product-price");
  const specsList = document.querySelector(".product-specs ul");

  if (!whatsappLink || !warning || !sizeBtns.length || !colorContainer || !swiperWrapper || !productTitle) return;

  const phoneNumber = "967739770762";
  const colorMap = { أسود: "#000000", أبيض: "#ffffff", أزرق: "#007bff", أحمر: "#ff0000" };

  // ===== Sample product data (replace with localStorage data if exists) =====
  let product = JSON.parse(localStorage.getItem("selectedProduct")) || {
    name: "تيشيرت أنيق",
    description: "تيشيرت عالي الجودة بألوان رائعة",
    price: 15000,
    currency: "YER",
    images: ["AOT_1.webp", "AOT_2.webp"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أسود", "أبيض", "أزرق"],
    specs: [
      { title: "الخامة", value: "قطن 100%" },
      { title: "الغسيل", value: "غسيل يدوي" }
    ]
  };

  // ===== Helper functions =====
  const getSelected = (btns) => [...btns].find(b => b.classList.contains("active"));
  const activateBtn = (btn) => {
    btn.parentElement.querySelectorAll(".active").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    warning.classList.remove("active", "shake");
    updateLink();
  };
  const updateLink = () => {
    const size = getSelected(sizeBtns);
    const color = getSelected(colorContainer.querySelectorAll(".color-btn"));
    whatsappLink.href = size && color
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          `Hello,\nI want to buy ${productTitle.textContent} in size ${size.dataset.size} and color ${color.dataset.color}`
        )}`
      : "#";
  };

  // ===== WhatsApp click handler =====
  whatsappLink.addEventListener("click", (e) => {
    if (!getSelected(sizeBtns) || !getSelected(colorContainer.querySelectorAll(".color-btn"))) {
      e.preventDefault();
      warning.classList.contains("active") ? (warning.classList.remove("shake"), void warning.offsetWidth, warning.classList.add("shake")) : warning.classList.add("active");
      clearTimeout(warning.timeoutId);
      warning.timeoutId = setTimeout(() => warning.classList.remove("active", "shake"), 5000);
    }
  });

  // ===== Display product info =====
  productTitle.textContent = product.name;
  productDesc.textContent = product.description;
  productPrice.textContent = `${product.price} ${product.currency}`;

  // ===== Images =====
  if (product.images?.length) {
    swiperWrapper.innerHTML = product.images.map(src => `<div class="swiper-slide"><img src="../src/assets/img/t-shirt/${src}" alt="${product.name}"></div>`).join("");
    if (window.productSwiper) window.productSwiper.destroy(true,true);
    window.productSwiper = new Swiper(".product-swiper", { loop:true, pagination:{el:".swiper-pagination"}, navigation:{nextEl:".swiper-button-next", prevEl:".swiper-button-prev"} });
  }

  // ===== Sizes =====
  sizeBtns.forEach(btn => {
    btn.classList.toggle("disabled", !product.sizes.includes(btn.dataset.size));
    btn.addEventListener("click", () => { if(!btn.classList.contains("disabled")) activateBtn(btn); });
  });

  // ===== Colors =====
  colorContainer.innerHTML = "";
  product.colors?.forEach(color => {
    const div = document.createElement("div");
    div.className = "color-btn";
    div.dataset.color = color;
    div.style.backgroundColor = colorMap[color] || "#ffffff";
    div.addEventListener("click", () => activateBtn(div));
    colorContainer.appendChild(div);
  });
  if (product.colors?.length === 1) activateBtn(colorContainer.querySelector(".color-btn"));

  // ===== Specs =====
  specsList.innerHTML = product.specs?.map(s => `<li><strong>${s.title}:</strong> ${s.value}</li>`).join("") || "";

  // ===== Initial WhatsApp link update =====
  updateLink();
});
