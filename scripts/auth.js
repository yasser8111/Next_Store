import {
  initFirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "./firebase.js";

// ===== تهيئة Firebase =====
const { auth } = await initFirebase();

// ===== عناصر DOM =====
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form-container");
const switchLinks = document.querySelectorAll(".switch-tab");
const warning = document.getElementById("warning-message");
let warningTimeout;

// ===== دالة عرض الرسالة =====
function showMessage(message, type = "error") {
  // إعادة الأنميشن
  warning.classList.remove("shake");
  void warning.offsetWidth;

  // تحديد اللون حسب نوع الرسالة
  if (type === "success") {
    warning.style.background = "#e0ffe0";
    warning.style.border = "1px solid #00c853";
    warning.style.color = "#008000";
  } else {
    warning.style.background = "#ffe0e0";
    warning.style.border = "1px solid #ff4d4d";
    warning.style.color = "red";
  }

  // عرض الرسالة
  warning.textContent = message;
  warning.classList.add("active");

  if (type === "error") warning.classList.add("shake");

  // إخفاء الرسالة بعد 5 ثوانٍ
  clearTimeout(warningTimeout);
  warningTimeout = setTimeout(() => {
    warning.classList.remove("active", "shake");
  }, 5000);
}

// ===== التبديل بين النماذج =====
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
    const target = link.dataset.target;
    tabs.forEach((t) => t.classList.remove("active"));
    forms.forEach((f) => f.classList.remove("active"));
    document.querySelector(`.tab[data-target="${target}"]`).classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// ===== دوال التحقق =====
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
  // على الأقل 8 رموز وتحتوي على حرف ورقم
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

// ===== تسجيل الدخول =====
const loginForm = document.querySelector("#login-form form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    showMessage("⚠️ الرجاء ملء جميع الحقول.");
    return;
  }
  if (!validateEmail(email)) {
    showMessage("❌ البريد الإلكتروني غير صالح. تأكد من أنه يحتوي على @");
    return;
  }
  if (!validatePassword(password)) {
    showMessage("❌ كلمة المرور يجب أن تحتوي على 8 رموز على الأقل، وتتضمن رقمًا وحرفًا واحدًا على الأقل.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("✅ تم تسجيل الدخول بنجاح!", "success");
    setTimeout(() => (window.location.href = "../index.html"), 2000);
  } catch (error) {
    showMessage("⚠️ فشل تسجيل الدخول: " + error.message);
  }
});

// ===== إنشاء الحساب =====
const registerForm = document.querySelector("#register-form form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (!name || !email || !password || !confirmPassword) {
    showMessage("⚠️ الرجاء ملء جميع الحقول.");
    return;
  }
  if (!validateEmail(email)) {
    showMessage("❌ البريد الإلكتروني غير صالح. تأكد من أنه يحتوي على @");
    return;
  }
  if (!validatePassword(password)) {
    showMessage("❌ كلمة المرور يجب أن تحتوي على 8 رموز على الأقل، وتتضمن رقمًا وحرفًا واحدًا على الأقل.");
    return;
  }
  if (password !== confirmPassword) {
    showMessage("❌ كلمتا المرور غير متطابقتان.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showMessage("✅ تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.", "success");

    // الانتقال تلقائيًا إلى صفحة تسجيل الدخول
    setTimeout(() => {
      document.querySelector(`.tab[data-target="login-form"]`).click();
    }, 1500);
  } catch (error) {
    showMessage("⚠️ حدث خطأ أثناء إنشاء الحساب: " + error.message);
  }
});
