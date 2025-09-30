// ===== Elements =====
const whatsappLink = document.getElementById("whatsapp-link");
const sizeBtns = document.querySelectorAll(".size-btn:not(.disabled)");
const colorBtns = document.querySelectorAll(".color-btn");
const warning = document.getElementById("warning-message");

const productName = "تيشيرت هجوم العمالقة";
const phoneNumber = "967739770762";

// ===== Get the selected button in a group =====
const getSelected = (btns) => [...btns].find(b => b.classList.contains("active"));

// ===== Update WhatsApp link based on selections =====
const updateLink = () => {
  const size = getSelected(sizeBtns), color = getSelected(colorBtns);
  whatsappLink.href = size && color
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `سلام عليكم\nاريد شراء ${productName} بمقاس ${size.dataset.size} ولون ${color.dataset.color}`
      )}`
    : "#";
};

// ===== Activate a button in a group =====
const activateBtn = (btn) => {
  btn.parentElement.querySelectorAll(".active").forEach(b => b.classList.remove("active")); // deactivate others
  btn.classList.add("active"); // activate clicked button
  warning.classList.remove("active", "shake"); // hide warning if visible
  updateLink(); // update WhatsApp link
};

// ===== Attach click events to all buttons =====
[...sizeBtns, ...colorBtns].forEach(btn => btn.addEventListener("click", () => activateBtn(btn)));

// ===== Handle WhatsApp click and show warning if selections missing =====
whatsappLink.addEventListener("click", (e) => {
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
    warning.timeoutId = setTimeout(() => warning.classList.remove("active", "shake"), 5000);
  }
});

// ===== Initialize WhatsApp link on page load =====
updateLink();
