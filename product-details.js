// ===== Elements =====
const whatsappLink = document.getElementById("whatsapp-link");
const sizeBtns = document.querySelectorAll(".size-btn:not(.disabled)");
const colorBtns = document.querySelectorAll(".color-btn");
const warning = document.getElementById("warning-message");

const productName = "تيشيرت هجوم العمالقة";
const phoneNumber = "967739770762";

// ===== Get selected button in a group =====
const getSelected = (btns) => [...btns].find((b) => b.classList.contains("active"));

// ===== Update WhatsApp link =====
const updateLink = () => {
  const size = getSelected(sizeBtns);
  const color = getSelected(colorBtns);

  whatsappLink.href = size && color
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `سلام عليكم\nاريد شراء ${productName} بمقاس ${size.dataset.size} ولون ${color.dataset.color}`
      )}`
    : "#";
};

// ===== Activate a button in the group =====
const activateBtn = (btn) => {
  btn.parentElement.querySelectorAll(".active").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  warning.classList.remove("active");
  updateLink();
};

// ===== Attach click events =====
[...sizeBtns, ...colorBtns].forEach(btn => btn.addEventListener("click", () => activateBtn(btn)));

// ===== Warn if size or color not selected =====
whatsappLink.addEventListener("click", (e) => {
  if (!getSelected(sizeBtns) || !getSelected(colorBtns)) {
    e.preventDefault();
    warning.classList.add("active");
    setTimeout(() => warning.classList.remove("active"), 5000);
  }
});

// ===== Initialize link on page load =====
updateLink();
