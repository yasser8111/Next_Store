import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "../../backend/firebase.js";

// ===== Tab Switching =====
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form-container");
const switchLinks = document.querySelectorAll(".switch-tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    forms.forEach((f) => f.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

switchLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.dataset.target;
    forms.forEach((f) => f.classList.remove("active"));
    document.getElementById(targetId).classList.add("active");
    tabs.forEach((t) => t.classList.remove("active"));
    document.querySelector(`.tab[data-target="${targetId}"]`).classList.add("active");
  });
});

// ===== Auth Handlers =====
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// تسجيل الدخول
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ تم تسجيل الدخول بنجاح!");
    window.location.href = "../index.html"; // أو صفحة أخرى بعد الدخول
  } catch (error) {
    alert(`❌ خطأ: ${error.message}`);
  }
});

// إنشاء حساب
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("🎉 تم إنشاء الحساب بنجاح!");
    window.location.href = "../index.html";
  } catch (error) {
    alert(`❌ خطأ: ${error.message}`);
  }
});
