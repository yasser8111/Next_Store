import { initFirebase } from "../scripts/firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let db;
const productList = document.getElementById("productList");
const loading = document.getElementById("loading");

// Initialize Firebase with error handling
try {
  const firebase = await initFirebase();
  db = firebase.db;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  loading.innerHTML = `
          <div style="text-align: center; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>خطأ في الاتصال بقاعدة البيانات</h3>
            <p>تأكد من إعدادات Firebase وأن الإنترنت يعمل بشكل صحيح</p>
            <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">خطأ: ${error.message}</p>
          </div>
        `;
}

// Load products from Firebase
async function loadProducts() {
  if (!db || window.screen.width < 1200) {
    console.error("Database not initialized or screen too small");
    return;
  }

  try {
    loading.style.display = "flex";
    console.log("Loading products...");

    const querySnapshot = await getDocs(collection(db, "products"));
    productList.innerHTML = "";

    console.log(`Found ${querySnapshot.size} products`);

    if (querySnapshot.empty) {
      productList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-box-open"></i>
              <h3>لا توجد منتجات</h3>
              <p>ابدأ بإضافة منتجك الأول</p>
            </div>
          `;
      loading.style.display = "none";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const productId = docSnap.id;

      const productCard = `
            <div class="product-card">
              <div class="product-images">
                ${product.images
                  .slice(0, 3)
                  .map(
                    (src) =>
                      `<img src="https://res.cloudinary.com/dxbelrmq1/image/upload/${src}" alt="${product.name}" loading="lazy">`
                  )
                  .join("")}
              </div>
              <div class="product-content">
                <div class="product-header">
                  <h2>${product.name}</h2>
                </div>
                <p>${product.description}</p>
                <div class="size-options">
                  ${["S", "M", "L", "XL", "XXL", "XXXL"]
                    .map(
                      (size) =>
                        `<span class="size-btn ${
                          product.sizes.includes(size) ? "" : "disabled"
                        }">${size}</span>`
                    )
                    .join("")}
                </div>
                <div class="product-price">${product.currency} ${
        product.price
      }</div>
                ${
                  product.specs && product.specs.length > 0
                    ? `
                  <div class="product-specs">
                    ${product.specs
                      .map(
                        (s) =>
                          `<div class="spec-item">
                            <span class="spec-value">${s.value}</span>
                            <span class="spec-title">${s.title}</span>
                          </div>`
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
                <div class="product-actions">
                      <button class="action-btn delete-btn" onclick="deleteProduct('${productId}')">
                        <i class="fas fa-trash"></i>
                      </button>
                      <button class="action-btn edit-btn" onclick="editProduct('${productId}')">
                        <i class="fas fa-edit"></i>
                      </button>
                  </div>
              </div>
            </div>
          `;

      productList.innerHTML += productCard;
    });

    loading.style.display = "none";
  } catch (error) {
    console.error("Error loading products:", error);
    loading.style.display = "none";

    productList.innerHTML = `
            <div class="empty-state" style="border-color: #e74c3c;">
              <i class="fas fa-exclamation-circle" style="color: #e74c3c;"></i>
              <h3 style="color: #e74c3c;">حدث خطأ في تحميل المنتجات</h3>
              <p>${error.message}</p>
              <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: #000; color: #fff; border: none; border-radius: 8px; cursor: pointer;">
                إعادة المحاولة
              </button>
            </div>
          `;
  }
}

// Open Add Modal
window.openAddModal = function () {
  document.getElementById("modalTitle").textContent = "إضافة منتج جديد";
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("specsContainer").innerHTML = "";
  document.getElementById("productModal").classList.add("active");
};

// Close Modal
window.closeModal = function () {
  document.getElementById("productModal").classList.remove("active");
};

// Add Spec Field
window.addSpecField = function (title = "", value = "") {
  const specsContainer = document.getElementById("specsContainer");
  const specItem = document.createElement("div");
  specItem.className = "spec-item-input";
  specItem.innerHTML = `
        <input type="text" placeholder="العنوان" value="${title}">
        <input type="text" placeholder="القيمة" value="${value}">
        <button type="button" onclick="this.parentElement.remove()">
          <i class="fas fa-trash"></i>
        </button>
      `;
  specsContainer.appendChild(specItem);
};

// Edit Product
window.editProduct = async function (id) {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDocs(collection(db, "products"));

    let product = null;
    docSnap.forEach((d) => {
      if (d.id === id) {
        product = { id: d.id, ...d.data() };
      }
    });

    if (!product) return;

    document.getElementById("modalTitle").textContent = "تعديل المنتج";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productCurrency").value = product.currency;
    document.getElementById("productImages").value = product.images.join(", ");

    // Set sizes
    document.querySelectorAll('input[name="sizes"]').forEach((checkbox) => {
      checkbox.checked = product.sizes.includes(checkbox.value);
    });

    // Set specs
    document.getElementById("specsContainer").innerHTML = "";
    if (product.specs && product.specs.length > 0) {
      product.specs.forEach((spec) => {
        addSpecField(spec.title, spec.value);
      });
    }

    document.getElementById("productModal").classList.add("active");
  } catch (error) {
    console.error("Error editing product:", error);
    alert("حدث خطأ في تحميل بيانات المنتج");
  }
};

// Delete Product
window.deleteProduct = async function (id) {
  if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

  try {
    await deleteDoc(doc(db, "products", id));
    await loadProducts();
    alert("تم حذف المنتج بنجاح");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("حدث خطأ في حذف المنتج");
  }
};

// Submit Form
document
  .getElementById("productForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("productId").value;
    const selectedSizes = Array.from(
      document.querySelectorAll('input[name="sizes"]:checked')
    ).map((cb) => cb.value);

    const images = document
      .getElementById("productImages")
      .value.split(",")
      .map((img) => img.trim())
      .filter((img) => img);

    // Get specs
    const specs = [];
    document
      .querySelectorAll("#specsContainer .spec-item-input")
      .forEach((item) => {
        const inputs = item.querySelectorAll("input");
        if (inputs[0].value && inputs[1].value) {
          specs.push({
            title: inputs[0].value,
            value: inputs[1].value,
          });
        }
      });

    const productData = {
      name: document.getElementById("productName").value,
      description: document.getElementById("productDescription").value,
      price: parseFloat(document.getElementById("productPrice").value),
      currency: document.getElementById("productCurrency").value,
      sizes: selectedSizes,
      images: images,
      specs: specs,
    };

    try {
      if (id) {
        // Update
        await updateDoc(doc(db, "products", id), productData);
        alert("تم تحديث المنتج بنجاح");
      } else {
        // Add
        await addDoc(collection(db, "products"), productData);
        alert("تم إضافة المنتج بنجاح");
      }

      closeModal();
      await loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("حدث خطأ في حفظ المنتج");
    }
  });

// Close modal on outside click
document.getElementById("productModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Initial load
loadProducts();
