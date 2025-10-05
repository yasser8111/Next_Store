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

// رقم الهاتف الافتراضي
const phoneNumber = "967739770762";

// ===== Get the selected button in a group =====
const getSelected = (btns) =>
  [...btns].find((b) => b.classList.contains("active"));

// ===== Update WhatsApp link based on selections =====
const updateLink = () => {
  const sizeBtns = document.querySelectorAll(".size-btn:not(.disabled)");
  const colorBtns = document.querySelectorAll(".color-btn");
  const size = getSelected(sizeBtns);
  const color = getSelected(colorBtns);

  if (size && color) {
    whatsappLink.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `سلام عليكم\nاريد شراء ${productTitle.textContent} بمقاس ${size.dataset.size} ولون ${color.dataset.color}`
    )}`;
  } else {
    whatsappLink.href = "#";
  }
};

// ===== Activate a button in a group =====
const activateBtn = (btn) => {
  btn.parentElement
    .querySelectorAll(".active")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  warning.classList.remove("active", "shake");
  updateLink();
};

// ===== Handle WhatsApp click =====
whatsappLink.addEventListener("click", (e) => {
  const sizeBtns = document.querySelectorAll(".size-btn:not(.disabled)");
  const colorBtns = document.querySelectorAll(".color-btn");
  if (!getSelected(sizeBtns) || !getSelected(colorBtns)) {
    e.preventDefault();
    if (warning.classList.contains("active")) {
      warning.classList.remove("shake");
      void warning.offsetWidth;
      warning.classList.add("shake");
    } else {
      warning.classList.add("active");
    }
    clearTimeout(warning.timeoutId);
    warning.timeoutId = setTimeout(
      () => warning.classList.remove("active", "shake"),
      5000
    );
  }
});

// ===== Read product ID from URL =====
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

// ===== Fetch product data =====
fetch("data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // ===== Update Swiper images =====
    swiperWrapper.innerHTML = "";
    product.images.forEach((src) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.innerHTML = `<img src="${src}" alt="${product.name}"/>`;
      swiperWrapper.appendChild(slide);
    });

    // ===== Initialize Swiper =====
    if (window.productSwiper) productSwiper.destroy(true, true);
    window.productSwiper = new Swiper(".product-swiper", {
      loop: true,
      pagination: { el: ".swiper-pagination" },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    // ===== Update product info =====
    productTitle.textContent = product.name;
    productDesc.textContent = product.description;
    productPrice.textContent = `${product.price} ${product.currency}`;

    // ===== Update sizes =====
    sizeContainer.innerHTML = "";
    product.sizes.forEach((size) => {
      const btn = document.createElement("button");
      btn.classList.add("size-btn");
      btn.dataset.size = size;
      btn.textContent = size;
      sizeContainer.appendChild(btn);
      btn.addEventListener("click", () => activateBtn(btn));
    });

    // ===== Update colors =====
    colorContainer.innerHTML = "";
    product.colors.forEach((color) => {
      const div = document.createElement("div");
      div.classList.add("color-btn");
      div.dataset.color = color;
      div.style.backgroundColor = color.toLowerCase();
      colorContainer.appendChild(div);
      div.addEventListener("click", () => activateBtn(div));
    });

    // ===== Update specs =====
    specsList.innerHTML = "";
    product.specs.forEach((spec) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${spec.title}: </strong>${spec.value}`;
      specsList.appendChild(li);
    });

    // ===== Initialize WhatsApp link =====
    updateLink();
  })
  .catch((err) => console.error(err));
