import { getAllProducts } from "./firebase.js";

async function loadProducts() {
  const grid = document.querySelector(".product-grid");
  const loading = document.getElementById("loading-container");
  if (!grid) return;

  grid.innerHTML = "";
  if (loading) loading.style.display = "flex";

  try {
    // ===== Add "Customize" card first =====
    const customizeCardHTML = `
      <div class="product-card Customize-card" onclick="window.location.href='./html/customize-details.html'">
        <img src="./src/assets/img/t-shirt/customize.webp" alt="Customize" loading="lazy" />
        <h3>صمّم تيشيرتك...</h3>
        <p>15.000 YER</p>
      </div>
    `;
    grid.innerHTML += customizeCardHTML;

    // ===== Fetch products from cache or Firebase =====
    const products = JSON.parse(localStorage.getItem("cachedProducts")) || await getAllProducts();
    if (!localStorage.getItem("cachedProducts")) localStorage.setItem("cachedProducts", JSON.stringify(products));

    // ===== Add other products =====
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = p.id;

      card.onclick = () => {
        localStorage.setItem("selectedProduct", JSON.stringify(p));
        window.location.href = `/html/product-details.html?id=${p.id}`;
      };

      const imgSrc = p.images?.[0]?.startsWith("http") 
        ? p.images[0] 
        : `/src/assets/img/t-shirt/${p.images[0]}`;

      card.innerHTML = `
        <img src="${imgSrc}" alt="${p.name}" loading="lazy">
        <h3>${p.name}</h3>
        <p>${p.price} ${p.currency}</p>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    console.error("❌ خطأ أثناء تحميل المنتجات:", err);
    if (loading) loading.innerHTML = `<p style="color:red">خطأ في تحميل المنتجات</p>`;
  } finally {
    if (loading) loading.style.display = "none";
  }
}

window.addEventListener("load", loadProducts);
