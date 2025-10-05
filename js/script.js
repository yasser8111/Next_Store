// ===== Navbar background toggle on scroll =====
const navbar = document.getElementById("navbar");

function toggleNavbarBg() {
  navbar.classList.toggle("top", window.scrollY <= 1);
}
window.addEventListener("scroll", toggleNavbarBg);
window.addEventListener("load", toggleNavbarBg);

// ===== Smooth scroll with small offset below navbar =====
(() => {
  const nav = document.querySelector(".navbar");

  const getOffset = () =>
    (nav?.offsetHeight || 0) + (window.innerWidth >= 992 ? 24 : 12);

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - getOffset();
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // Handle internal link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    if (!id) return;

    e.preventDefault();
    history.replaceState(null, "", "#" + id);
    scrollToId(id);
  });

  // Handle page load with hash
  window.addEventListener("load", () => {
    if (location.hash) scrollToId(location.hash.slice(1));
  });

  // Handle back/forward navigation
  window.addEventListener("hashchange", () => {
    if (location.hash) scrollToId(location.hash.slice(1));
  });
})();

// ===== Mobile nav toggle =====
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  navToggle.classList.toggle("active");
});

navMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

// ===== Product card click to details page =====

function goToDetails(card) {
  const id = card.dataset.id;
  window.location.href = `product-details.html?id=${id}`;
}
