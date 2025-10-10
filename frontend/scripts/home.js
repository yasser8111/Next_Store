import { db, collection, getDocs } from "../../backend/firebase.js";

// Load products from Firestore
async function loadProducts() {
  const grid = document.querySelector(".product-grid");
  const loading = document.getElementById("loading-container");

  if (!grid) return;
  grid.innerHTML = "";

  // Show loading spinner if it exists
  if (loading) loading.style.display = "flex";

  try {
    // ===== Fetch all products from Firestore =====
    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {
      const product = doc.data();

      // Determine image source (local or full URL)
      const imgSrc = product.images?.[0]?.startsWith("http")
        ? product.images[0]
        : `https://res.cloudinary.com/dxbelrmq1/image/upload/${product.images[0]}`;

      // Create product card
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.dataset.id = doc.id;

      card.onclick = () => {
        // Save selected product to localStorage and go to details page
        localStorage.setItem(
          "selectedProduct",
          JSON.stringify({ id: doc.id, ...product })
        );
        window.location.href = `./html/product-details.html?id=${doc.id}`;
      };

      card.innerHTML = `
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p class="price">${product.price.toLocaleString()} ${
        product.currency
      }</p>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("❌ Error loading products:", error);
    if (grid)
      grid.innerHTML = `<p style="color:red">Failed to load products 😢</p>`;
  } finally {
    // Hide loading spinner
    if (loading) loading.style.display = "none";

    // ===== Add "Customize" card AFTER loading spinner is hidden =====
    const customizeCard = document.createElement("div");
    customizeCard.classList.add("product-card", "Customize-card");

    const customizeProduct = {
      id: "customize",
      name: "صمّم تيشيرتك...",
      price: 15000,
      currency: "YER",
      images:
        "https://res.cloudinary.com/dxbelrmq1/image/upload/customize_qcgbab.webp",
      description: "صمّم التيشيرت الخاص بك",
    };

    customizeCard.onclick = () => {
      localStorage.setItem("selectedProduct", JSON.stringify(customizeProduct));
      window.location.href = "./html/customize-details.html";
    };

    customizeCard.innerHTML = `
  <img src="${customizeProduct.images}" alt="Customize" loading="lazy">
  <h3>${customizeProduct.name}</h3>
  <p class="price">${customizeProduct.price.toLocaleString()} ${
      customizeProduct.currency
    }</p>
`;

    grid.prepend(customizeCard); // Add first in the grid
  }
}

// Load products when page is ready
window.addEventListener("load", loadProducts);
